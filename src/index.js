// Native
const path = require('path');
const fs = require('fs');

// GitHub Actions
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

// Module
const {
  ActionOutput,
  InternalToken,
  ActionInput,
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  DEFAULT_COMMENT_MARKER,
} = require('./constants');
const { replaceTokens } = require('./utils');
const { parseCoverageSummaryJSON } = require('./parse');
const { formatFilesCoverageDataToHTMLTable } = require('./format');

async function run() {
  if (github.context.eventName !== 'pull_request') {
    return;
  }

  const gitHubToken = core.getInput('github_token').trim();
  if (!gitHubToken) {
    console.error('GitHub token missing (github_token).');
    return;
  }

  const coverageOutputDirectory = core.getInput(ActionInput.coverage_output_directory);
  const coverageSummaryJSONPath = path.resolve(
    coverageOutputDirectory,
    DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  );
  const coverageSummaryJSON = JSON.parse(
    fs.readFileSync(coverageSummaryJSONPath, { encoding: 'utf-8' }),
  );

  const changedFiles = await getChangedFiles();
  const summary = parseCoverageSummaryJSON(coverageSummaryJSON, {
    basePath: core.getInput(ActionInput.sources_base_path),
    changedFiles,
  });

  const commitSHA = github.context.payload.pull_request.head.sha;
  let outputs = {
    [ActionOutput.total_lines_coverage_percent]: summary[ActionOutput.total_lines_coverage_percent],
    [ActionOutput.total_statements_coverage_percent]:
      summary[ActionOutput.total_statements_coverage_percent],
    [ActionOutput.total_functions_coverage_percent]:
      summary[ActionOutput.total_functions_coverage_percent],
    [ActionOutput.total_branches_coverage_percent]:
      summary[ActionOutput.total_branches_coverage_percent],
    [ActionOutput.files_coverage_table]: formatFilesCoverageDataToHTMLTable(
      summary[InternalToken.files_coverage_data],
      {
        order: core.getInput(ActionInput.files_coverage_table_output_type_order),
        filePrefix: getFilePrefix(),
      },
    ),
    [ActionOutput.changed_files_coverage_table]: formatFilesCoverageDataToHTMLTable(
      summary[InternalToken.changed_files_coverage_data],
      {
        order: core.getInput(ActionInput.files_coverage_table_output_type_order),
        filePrefix: getFilePrefix(),
      },
    ),
    [ActionOutput.commit_sha]: commitSHA,
    [ActionOutput.short_commit_sha]: commitSHA.substr(0, 7),
    [ActionOutput.commit_link]: `${github.context.payload.pull_request.number}/commits/${commitSHA}`,
  };

  const commentTemplateMDPath = path.resolve(core.getInput(ActionInput.comment_template_file));
  const commentTemplate = fs.readFileSync(commentTemplateMDPath, { encoding: 'utf-8' });
  let commentBody = replaceTokens(commentTemplate, outputs);

  const commentMark = `<!-- ${DEFAULT_COMMENT_MARKER} -->`;
  const commentMode = core.getInput(ActionInput.comment_mode);

  const octokit = await github.getOctokit(gitHubToken);
  const existingComment =
    commentMode === 'replace' ? await findCommentByBody(octokit, commentMark) : null;

  if (existingComment) {
    commentBody += '\n' + commentMark + '\n';
    await octokit.rest.issues.updateComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      comment_id: existingComment.id,
      body: commentBody,
    });
  } else {
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      body: commentBody,
    });
  }

  Object.entries(outputs).forEach(([token, value]) => {
    core.setOutput(token, value);
  });
}

async function getChangedFiles() {
  const { base, head } = github.context.payload.pull_request;
  const { exitCode, output } = await executeCommand(
    `git diff --name-only --diff-filter=ACMRT origin/${base.sha} origin/${head.sha}`,
  );
  if (exitCode === 0) {
    const filesChanged = output.split(/\r?\n/).filter((line) => line.length > 0);
    return filesChanged;
  } else {
    console.error('An error occurred while executing command.', {
      exitCode,
      output,
    });
  }
}

async function executeCommand(command) {
  let output = '';

  const options = {};
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      output += data.toString();
    },
  };

  const exitCode = await exec.exec(command, [], options);

  return { exitCode, output };
}

async function findCommentByBody(octokit, commentBodyIncludes) {
  const parameters = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.payload.pull_request.number,
  };

  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    parameters,
  )) {
    const comment = comments.find((comment) => comment.body.includes(commentBodyIncludes));
    if (comment) return comment;
  }

  return undefined;
}

function getFilePrefix() {
  console.log('github.context.payload.pull_request', github.context.payload.pull_request);
  return `../blob/${github.context.payload.pull_request.head.sha}/`;
}

run().catch((error) => {
  core.setFailed(error.stack || error.message);
});

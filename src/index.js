// Native
const path = require('path');
const fs = require('fs');

// GitHub Actions
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

// Module
// const { ActionOutput, InternalToken, ActionInput, DEFAULT_COMMENT_MARKER } = require('./constants');
const { ActionOutput, InternalToken, ActionInput } = require('./constants');
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

  const coverageFile = core.getInput(ActionInput.coverage_file);
  const coverageSummaryJSONPath = path.resolve(coverageFile);
  const coverageSummaryJSON = JSON.parse(
    fs.readFileSync(coverageSummaryJSONPath, { encoding: 'utf-8' }),
  );

  let baseCoverageSummaryJSON;
  const baseCoverageFile = core.getInput(ActionInput.base_coverage_file);
  if (baseCoverageFile) {
    const baseCoverageSummaryJSONPath = path.resolve(baseCoverageFile);
    try {
      baseCoverageSummaryJSON = JSON.parse(
        fs.readFileSync(baseCoverageSummaryJSONPath, { encoding: 'utf-8' }),
      );
    } catch (e) {
      console.warn('Base coverage json was not readable.');
    }
  }

  const { changedFiles } = await getChangedFiles();

  const { output, other } = parseCoverageSummaryJSON(coverageSummaryJSON, {
    basePath: core.getInput(ActionInput.sources_base_path),
    changedFiles,
    baseCoverageSummaryJSON,
  });

  const commitSHA = github.context.payload.pull_request.head.sha;
  const baseCommitSHA = github.context.payload.pull_request.base.sha;
  let outputs = {
    ...output,
    [ActionOutput.files_coverage_table]: formatFilesCoverageDataToHTMLTable(
      other[InternalToken.files_coverage_data],
      {
        order: core.getInput(ActionInput.files_coverage_table_output_type_order),
        filePrefix: getFilePrefix(),
      },
    ),
    [ActionOutput.changed_files_coverage_table]: formatFilesCoverageDataToHTMLTable(
      other[InternalToken.changed_files_coverage_data],
      {
        order: core.getInput(ActionInput.files_coverage_table_output_type_order),
        filePrefix: getFilePrefix(),
      },
    ),
    [ActionOutput.commit_sha]: commitSHA,
    [ActionOutput.short_commit_sha]: commitSHA.substr(0, 7),
    [ActionOutput.commit_link]: `${github.context.payload.pull_request.number}/commits/${commitSHA}`,
    [ActionOutput.base_commit_sha]: baseCommitSHA,
    [ActionOutput.base_short_commit_sha]: baseCommitSHA.substr(0, 7),
    [ActionOutput.base_commit_link]: `../commit/${baseCommitSHA}`,
    [ActionOutput.base_ref]: `${github.context.payload.pull_request.base.ref}`,
  };

  const commentTemplateFilePath = path.resolve(core.getInput(ActionInput.comment_template_file));
  const commentMark = `<!-- ${core.getInput(ActionInput.comment_marker)} -->`;
  // const commentMark = `<!-- ${DEFAULT_COMMENT_MARKER} -->`;

  let commentBody;
  if (commentTemplateFilePath.endsWith('.svelte')) {
    const props = Object.assign({}, outputs, {
      changed_files_coverage_data: other[InternalToken.changed_files_coverage_data],
    });
    const propsFilename = `tmp-report-nyc-coverage-${commitSHA}-props.json`;
    const outputFilename = `tmp-report-nyc-coverage-${commitSHA}-output.html`;
    fs.writeFileSync(propsFilename, JSON.stringify(props), 'utf-8');
    const svelteToHTMLCommand = await exec.getExecOutput(
      `npx svelte-to-html ${commentTemplateFilePath} ${outputFilename} ${propsFilename}`,
      [],
      {
        ignoreReturnCode: true,
      },
    );
    if (svelteToHTMLCommand.exitCode === 0) {
      commentBody = fs.readFileSync(outputFilename, 'utf-8');
    } else {
      console.error('Svelte to HTML transformation failed.', svelteToHTMLCommand);
    }
  } else {
    const commentTemplate = fs.readFileSync(commentTemplateFilePath, { encoding: 'utf-8' });
    commentBody = replaceTokens(commentTemplate, outputs);
  }
  commentBody += '\n' + commentMark + '\n';

  const commentMode = core.getInput(ActionInput.comment_mode);

  const octokit = await github.getOctokit(gitHubToken);
  const existingComment =
    commentMode === 'replace' ? await findCommentByBody(octokit, commentMark) : null;

  if (existingComment) {
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

// dummy

async function getChangedFiles() {
  const { base, head } = github.context.payload.pull_request;

  const diffCommand = await exec.getExecOutput(
    `git diff --name-only --diff-filter=ACMRT origin/${base.ref}...${head.sha}`,
    [],
    {
      ignoreReturnCode: true,
    },
  );
  if (diffCommand.exitCode === 0) {
    const changedFiles = diffCommand.stdout.split(/\r?\n/).filter((line) => line.length > 0);
    return { changedFiles };
  } else {
    console.error('A non-fatal error occurred while performing git diff: ', diffCommand);
    return { error: true };
  }
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
  return `../blob/${github.context.payload.pull_request.head.sha}/`;
}

run().catch((error) => {
  core.setFailed(error.stack || error.message);
});

// 2

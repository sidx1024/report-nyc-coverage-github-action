// Native
const path = require('path');
const fs = require('fs');

// GitHub Actions
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

// Module
const {
  Token,
  InternalToken,
  ActionInput,
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  DEFAULT_COMMENT_TEMPLATE_MD_FILENAME,
} = require('./constants');
const { replaceTokens } = require('./utils');
const { parseCoverageSummaryJSON } = require('./parse');
const { formatChangedFilesCoverageDataToHTMLTable } = require('./format');

async function run() {
  const coverageOutputDirectory = core.getInput(ActionInput.coverage_output_directory);
  const coverageSummaryJSONPath = path.resolve(
    coverageOutputDirectory,
    DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  );
  const coverageSummaryJSON = JSON.parse(
    fs.readFileSync(coverageSummaryJSONPath, { encoding: 'utf-8' }),
  );
  const summary = parseCoverageSummaryJSON(coverageSummaryJSON, {
    basePath: core.getInput(ActionInput.sources_base_path),
  });

  let tokenMap = {
    [Token.total_lines_coverage_percent]: summary[Token.total_lines_coverage_percent],
    [Token.total_statements_coverage_percent]: summary[Token.total_statements_coverage_percent],
    [Token.total_functions_coverage_percent]: summary[Token.total_functions_coverage_percent],
    [Token.total_branches_coverage_percent]: summary[Token.total_branches_coverage_percent],
    [Token.files_coverage_table]: formatChangedFilesCoverageDataToHTMLTable(
      summary[InternalToken.files_coverage_data],
    ),
    [Token.changed_files_coverage_table]: formatChangedFilesCoverageDataToHTMLTable(
      summary[InternalToken.changed_files_coverage_data],
    ),
  };

  const gitHubToken = core.getInput('github_token').trim();
  if (gitHubToken !== '' && github.context.eventName === 'pull_request') {
    const commentTemplateMDPath = path.resolve(DEFAULT_COMMENT_TEMPLATE_MD_FILENAME);
    const commentTemplate = fs.readFileSync(commentTemplateMDPath, { encoding: 'utf-8' });
    const commentBody = replaceTokens(commentTemplate, tokenMap);
    const octokit = await github.getOctokit(gitHubToken);
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      body: commentBody,
    });
    getGitDiff();
  }

  Object.entries(tokenMap).forEach(([token, value]) => {
    core.setOutput(token, value);
  });
}

async function getGitDiff() {
  const { base, head } = github.context.payload.pull_request;
  const { exitCode, output } = await executeCommand(
    `git diff --name-only --diff-filter=ACMRT ${base.sha} ${head.sha}`,
  );
  if (exitCode === 0) {
    console.log(output);
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

run().catch((error) => {
  core.setFailed(error.stack || error.message);
});

const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
// const os = require('os');

const { replaceTokens } = require('./utils');
const { parseCoverageSummaryJSON } = require('./parse');
const {
  Token,
  InternalToken,
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  ActionInput,
  DEFAULT_COMMENT_TEMPLATE_MD_FILENAME,
} = require('./constants');
const { formatChangedFilesCoverageDataToMarkdownTable } = require('./format');

async function run() {
  // const tmpPath = path.resolve(os.tmpdir(), github.context.action);

  const coverageOutputDirectory = core.getInput(ActionInput.coverage_output_directory);

  const coverageSummaryJSONPath = path.resolve(
    coverageOutputDirectory,
    DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME,
  );
  const coverageSummaryJSON = JSON.parse(fs.readFileSync(coverageSummaryJSONPath, 'utf8'));

  const summary = parseCoverageSummaryJSON(coverageSummaryJSON);

  console.log('Done creating summary');

  const tokenMap = {
    [Token.total_lines_coverage_percent]: summary[Token.total_lines_coverage_percent],
    [Token.total_statements_coverage_percent]: summary[Token.total_statements_coverage_percent],
    [Token.total_functions_coverage_percent]: summary[Token.total_functions_coverage_percent],
    [Token.total_branches_coverage_percent]: summary[Token.total_branches_coverage_percent],
    [Token.changed_files_coverage_table]: formatChangedFilesCoverageDataToMarkdownTable(
      summary[InternalToken.changed_files_coverage_data],
    ),
  };

  console.log('Done creating tokenMap', tokenMap);

  if (gitHubToken !== '' && github.context.eventName === 'pull_request') {
    const commentTemplateMDPath = path.resolve(DEFAULT_COMMENT_TEMPLATE_MD_FILENAME);
    const commentTemplate = fs.readFileSync(commentTemplateMDPath, 'utf8');

    const commentBody = replaceTokens(commentTemplate, tokenMap);

    const gitHubToken = core.getInput('github-token').trim();
    const octokit = await github.getOctokit(gitHubToken);
    await octokit.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.pull_request.number,
      body: commentBody,
    });
  }

  Object.entries(tokenMap).forEach(([token, value]) => {
    core.setOutput(token, value);
  });
}

run().catch((error) => {
  core.setFailed(error.message);
});

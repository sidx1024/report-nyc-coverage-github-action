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
  ActionInput, DEFAULT_COMMENT_TEMPLATE_MD_FILENAME,
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

  const tokenMap = {
    [Token.total_lines_coverage_percent]: summary[Token.total_lines_coverage_percent],
    [Token.total_statements_coverage_percent]: summary[Token.total_statements_coverage_percent],
    [Token.total_functions_coverage_percent]: summary[Token.total_functions_coverage_percent],
    [Token.total_branches_coverage_percent]: summary[Token.total_branches_coverage_percent],
    [Token.changed_files_coverage_table]: formatChangedFilesCoverageDataToMarkdownTable(
      summary[InternalToken.changed_files_coverage_data],
    ),
  };

  const commentTemplateMDPath = path.resolve(DEFAULT_COMMENT_TEMPLATE_MD_FILENAME);
  const commentTemplate = fs.readFileSync(commentTemplateMDPath, 'utf8');

  const commentBody = replaceTokens(commentTemplate, tokenMap);

  core.setOutput(Token.total_lines_coverage_percent, summary.total_lines_coverage_percent);
  core.setOutput(Token.comment_body, commentBody);
}

run().catch((error) => {
  core.setFailed(error.message);
});

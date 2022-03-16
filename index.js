const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
// const os = require('os');

const { replaceTokens } = require('./utils');

async function run() {
  // const tmpPath = path.resolve(os.tmpdir(), github.context.action);
  const coverageOutputDirectory = core.getInput('coverage-output-directory');

  const coverageSummaryJSONPath = path.resolve(coverageOutputDirectory, 'coverage-summary.json');
  const coverageSummaryJSON = JSON.parse(fs.readFileSync(coverageSummaryJSONPath, 'utf-8'));

  const summary = parseCoverageSummaryJSON(coverageSummaryJSON);

  core.setOutput('total_lines_coverage_percent', summary.total_lines_coverage_percent);
}

run().catch((error) => {
  core.setFailed(error.message);
});

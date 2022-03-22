const { ActionOutput, InternalToken } = require('./constants');
const { trimBasePath } = require('./utils');
const { formatPercentWithIndicator } = require("./format");

function parseCoverageSummaryJSON(json, { changedFiles, basePath } = {}) {
  const total = json.total;
  delete json.total;

  const coverageData = Object.entries(json).map(([absolutePath, data]) => {
    return [trimBasePath(absolutePath, basePath), data];
  });

  let changedFilesCoverageData = [];
  if (Array.isArray(changedFiles)) {
    changedFilesCoverageData = coverageData.filter(([file]) => {
      return changedFiles.includes(file);
    });
  }

  return {
    [ActionOutput.total_lines_coverage_percent]: formatPercentWithIndicator(total.lines.pct),
    [ActionOutput.total_statements_coverage_percent]: formatPercentWithIndicator(total.statements.pct),
    [ActionOutput.total_functions_coverage_percent]: formatPercentWithIndicator(total.functions.pct),
    [ActionOutput.total_branches_coverage_percent]: formatPercentWithIndicator(total.branches.pct),
    [ActionOutput.total_lines_coverage_percent_raw]: total.lines.pct,
    [ActionOutput.total_statements_coverage_percent_raw]: total.statements.pct,
    [ActionOutput.total_functions_coverage_percent_raw]: total.functions.pct,
    [ActionOutput.total_branches_coverage_percent_raw]: total.branches.pct,
    [InternalToken.files_coverage_data]: coverageData,
    [InternalToken.changed_files_coverage_data]: changedFilesCoverageData,
  };
}

module.exports = {
  parseCoverageSummaryJSON,
};

const { Token, InternalToken } = require('./constants');
const { trimBasePath } = require('./utils');

function parseCoverageSummaryJSON(json, { changedFiles, basePath } = {}) {
  const total = json.total;
  delete json.total;

  const coverageData = Object.entries(json).map(([absolutePath, data]) => {
    return [trimBasePath(absolutePath, basePath), data];
  });

  let changedFilesCoverageData = [];
  if (changedFiles) {
    changedFilesCoverageData = coverageData.filter(([file]) => {
      return Object.hasOwn(changedFiles, file);
    });
  }

  return {
    [Token.total_lines_coverage_percent]: total.lines.pct,
    [Token.total_statements_coverage_percent]: total.statements.pct,
    [Token.total_functions_coverage_percent]: total.functions.pct,
    [Token.total_branches_coverage_percent]: total.branches.pct,
    [InternalToken.files_coverage_data]: coverageData,
    [InternalToken.changed_files_coverage_data]: changedFilesCoverageData,
  };
}

module.exports = {
  parseCoverageSummaryJSON,
};

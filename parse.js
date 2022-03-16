const { Token, InternalToken } = require('./constants');

function parseCoverageSummaryJSON(json, changed_files) {
  const total = json.total;
  delete json.total;

  let changedFilesCoverageData = Object.entries(json);

  if (changed_files) {
    changedFilesCoverageData = changedFilesCoverageData.filter(([file]) => {
      return Object.hasOwn(changed_files, file);
    });
  }

  return {
    [Token.total_lines_coverage_percent]: total.lines.pct,
    [Token.total_statements_coverage_percent]: total.statements.pct,
    [Token.total_functions_coverage_percent]: total.functions.pct,
    [Token.total_branches_coverage_percent]: total.branches.pct,
    [InternalToken.changed_files_coverage_data]: changedFilesCoverageData,
  };
}

module.exports = {
  parseCoverageSummaryJSON,
};

const { ActionOutput, InternalToken } = require('./constants');
const { trimBasePath } = require('./utils');
const { formatPercentWithIndicator, formatPercentDiff } = require('./format');

const OUTPUT_BLANK = {
  [ActionOutput.total_lines_coverage_percent]: '?',
  [ActionOutput.total_statements_coverage_percent]: '?',
  [ActionOutput.total_functions_coverage_percent]: '?',
  [ActionOutput.total_branches_coverage_percent]: '?',
  [ActionOutput.total_lines_coverage_percent_raw]: '?',
  [ActionOutput.total_statements_coverage_percent_raw]: '?',
  [ActionOutput.total_functions_coverage_percent_raw]: '?',
  [ActionOutput.total_branches_coverage_percent_raw]: '?',
  [ActionOutput.base_total_lines_coverage_percent]: '?',
  [ActionOutput.base_total_statements_coverage_percent]: '?',
  [ActionOutput.base_total_functions_coverage_percent]: '?',
  [ActionOutput.base_total_branches_coverage_percent]: '?',
  [ActionOutput.base_total_lines_coverage_percent_raw]: '?',
  [ActionOutput.base_total_statements_coverage_percent_raw]: '?',
  [ActionOutput.base_total_functions_coverage_percent_raw]: '?',
  [ActionOutput.base_total_branches_coverage_percent_raw]: '?',
  [ActionOutput.total_lines_coverage_percent_diff]: '?',
  [ActionOutput.total_statements_coverage_percent_diff]: '?',
  [ActionOutput.total_functions_coverage_percent_diff]: '?',
  [ActionOutput.total_branches_coverage_percent_diff]: '?',
  [ActionOutput.total_lines_coverage_percent_diff_raw]: '?',
  [ActionOutput.total_statements_coverage_percent_diff_raw]: '?',
  [ActionOutput.total_functions_coverage_percent_diff_raw]: '?',
  [ActionOutput.total_branches_coverage_percent_diff_raw]: '?',
};

function parseCoverageSummaryJSON(json, { changedFiles, basePath, baseCoverageSummaryJSON } = {}) {
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

  const output = Object.assign({}, OUTPUT_BLANK, {
    [ActionOutput.total_lines_coverage_percent]: formatPercentWithIndicator(total.lines.pct),
    [ActionOutput.total_statements_coverage_percent]: formatPercentWithIndicator(
      total.statements.pct,
    ),
    [ActionOutput.total_functions_coverage_percent]: formatPercentWithIndicator(
      total.functions.pct,
    ),
    [ActionOutput.total_branches_coverage_percent]: formatPercentWithIndicator(total.branches.pct),
    [ActionOutput.total_lines_coverage_percent_raw]: total.lines.pct,
    [ActionOutput.total_statements_coverage_percent_raw]: total.statements.pct,
    [ActionOutput.total_functions_coverage_percent_raw]: total.functions.pct,
    [ActionOutput.total_branches_coverage_percent_raw]: total.branches.pct,
    [InternalToken.files_coverage_data]: coverageData,
    [InternalToken.changed_files_coverage_data]: changedFilesCoverageData,
  });

  if (baseCoverageSummaryJSON) {
    const baseTotal = baseCoverageSummaryJSON.total;
    delete baseTotal.total;

    Object.assign(output, {
      [ActionOutput.base_total_lines_coverage_percent]: formatPercentWithIndicator(
        baseTotal.lines.pct,
      ),
      [ActionOutput.base_total_statements_coverage_percent]: formatPercentWithIndicator(
        baseTotal.statements.pct,
      ),
      [ActionOutput.base_total_functions_coverage_percent]: formatPercentWithIndicator(
        baseTotal.functions.pct,
      ),
      [ActionOutput.base_total_branches_coverage_percent]: formatPercentWithIndicator(
        baseTotal.branches.pct,
      ),
      [ActionOutput.base_total_lines_coverage_percent_raw]: baseTotal.lines.pct,
      [ActionOutput.base_total_statements_coverage_percent_raw]: baseTotal.statements.pct,
      [ActionOutput.base_total_functions_coverage_percent_raw]: baseTotal.functions.pct,
      [ActionOutput.base_total_branches_coverage_percent_raw]: baseTotal.branches.pct,
      [ActionOutput.total_lines_coverage_percent_diff]: formatPercentDiff(
        total.lines.pct - baseTotal.lines.pct,
      ),
      [ActionOutput.total_statements_coverage_percent_diff]: formatPercentDiff(
        total.statements.pct - baseTotal.statements.pct,
      ),
      [ActionOutput.total_functions_coverage_percent_diff]: formatPercentDiff(
        total.functions.pct - baseTotal.functions.pct,
      ),
      [ActionOutput.total_branches_coverage_percent_diff]: formatPercentDiff(
        total.branches.pct - baseTotal.branches.pct,
      ),
      [ActionOutput.total_lines_coverage_percent_diff_raw]: total.lines.pct - baseTotal.lines.pct,
      [ActionOutput.total_statements_coverage_percent_diff_raw]:
        total.statements.pct - baseTotal.statements.pct,
      [ActionOutput.total_functions_coverage_percent_diff_raw]:
        total.functions.pct - baseTotal.functions.pct,
      [ActionOutput.total_branches_coverage_percent_diff_raw]:
        total.branches.pct - baseTotal.branches.pct,
    });
  }

  return output;
}

module.exports = {
  parseCoverageSummaryJSON,
};

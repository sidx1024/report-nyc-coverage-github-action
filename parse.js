function parseCoverageSummaryJSON(json, changed_files) {
  const changedFilesCoverageData = Object.entries(json).filter(([file]) => {
    return Object.hasOwn(changed_files, file);
  });

  return {
    total_lines_coverage_percent: json.total.lines.pct,
    total_statements_coverage_percent: json.total.statements.pct,
    total_functions_coverag_percent: json.total.functions.pct,
    total_branches_coverage_percent: json.total.branches.pct,
    changed_files_coverage_data: changedFilesCoverageData,
  };
}

module.exports = {
  parseCoverageSummaryJSON,
};

function test() {
  const fs = require('fs');
  const json = JSON.parse(fs.readFileSync('coverage-summary.json'));
  const changed_files = {
    '/__w/leadgenie/leadgenie/assets/app/history.js': 1,
    '/__w/leadgenie/leadgenie/assets/app/routes.jsx': 1,
    '/__w/leadgenie/leadgenie/assets/app/actions/accountActions.js': 1,
  };
  console.log(parseCoverageSummaryJSON(json, changed_files));
}

test();

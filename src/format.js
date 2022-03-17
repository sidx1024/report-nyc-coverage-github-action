const { createHTMLTableFromArray } = require('./utils');

function formatFilesCoverageDataToHTMLTable(changedFilesCoverageData, options = {}) {
  const { statements = false, branches = false, functions = false, lines = true } = options;

  const headers = [
    'File',
    statements && 'Statements',
    branches && 'Branches',
    functions && 'Functions',
    lines && 'Lines',
  ].filter(Boolean);

  const rows = changedFilesCoverageData.map(([file, data]) => {
    return [
      file,
      statements && addPercentSignOrReturnEmptyString(data.statements.pct),
      branches && addPercentSignOrReturnEmptyString(data.branches.pct),
      functions && addPercentSignOrReturnEmptyString(data.functions.pct),
      lines && addPercentSignOrReturnEmptyString(data.lines.pct),
    ].filter(Boolean);
  });

  return createHTMLTableFromArray([headers, ...rows]);
}

function addPercentSignOrReturnEmptyString(input) {
  return Number.isFinite(input) ? input + '%' : '';
}

module.exports = {
  formatFilesCoverageDataToHTMLTable,
};

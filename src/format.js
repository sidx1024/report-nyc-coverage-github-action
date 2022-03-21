const { createHTMLTableFromArray } = require('./utils');

const LETTER_LABEL = {
  S: 'Statements',
  B: 'Branches',
  F: 'Functions',
  L: 'Lines',
};

const LETTER_PERCENT = {
  S: (data) => addPercentSignOrReturnEmptyString(data.statements.pct),
  B: (data) => addPercentSignOrReturnEmptyString(data.branches.pct),
  F: (data) => addPercentSignOrReturnEmptyString(data.functions.pct),
  L: (data) => addPercentSignOrReturnEmptyString(data.lines.pct),
};

function formatFilesCoverageDataToHTMLTable(changedFilesCoverageData, options = {}) {
  const { order = 'SBFL' } = options;

  const [o1, o2, o3, o4] = order.split('');

  const headers = [
    'File',
    LETTER_LABEL[o1],
    LETTER_LABEL[o2],
    LETTER_LABEL[o3],
    LETTER_LABEL[o4],
  ].filter(Boolean);

  const rows = changedFilesCoverageData.map(([file, data]) => {
    return [
      file,
      LETTER_PERCENT[o1]?.(data),
      LETTER_PERCENT[o2]?.(data),
      LETTER_PERCENT[o3]?.(data),
      LETTER_PERCENT[o4]?.(data),
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

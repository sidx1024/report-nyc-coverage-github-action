const { createHTMLTableFromArray } = require('./utils');

const LETTER_LABEL = {
  S: 'Statements',
  B: 'Branches',
  F: 'Functions',
  L: 'Lines',
};

const LETTER_PERCENT = {
  S: (data) => formatPercentWithIndicator(data.statements.pct),
  B: (data) => formatPercentWithIndicator(data.branches.pct),
  F: (data) => formatPercentWithIndicator(data.functions.pct),
  L: (data) => formatPercentWithIndicator(data.lines.pct),
};

const COVERAGE_LEVEL_IMAGE = {
  low: 'https://user-images.githubusercontent.com/11299391/159445221-fe3dc085-8c56-4e03-9642-219784c88fe7.svg',
  medium:
    'https://user-images.githubusercontent.com/11299391/159445212-f135c6d7-f354-4e8c-9a9f-28bb3ff1b7b5.svg',
  high: 'https://user-images.githubusercontent.com/11299391/159445220-d88b3624-0814-4664-80c8-09f0f2b8e68b.svg',
};

function formatFilesCoverageDataToHTMLTable(filesCoverageData, options = {}) {
  const { order = 'SBFL', filePrefix = '' } = options;

  const [o1, o2, o3, o4] = order.split('');

  const headers = [
    'File',
    LETTER_LABEL[o1],
    LETTER_LABEL[o2],
    LETTER_LABEL[o3],
    LETTER_LABEL[o4],
  ].filter(Boolean);

  const rows = filesCoverageData.map(([file, data]) => {
    const fileCellValue = filePrefix ? createLink(filePrefix + file, file) : file;
    return [
      fileCellValue,
      LETTER_PERCENT[o1]?.(data),
      LETTER_PERCENT[o2]?.(data),
      LETTER_PERCENT[o3]?.(data),
      LETTER_PERCENT[o4]?.(data),
    ].filter(Boolean);
  });

  return createHTMLTableFromArray([headers, ...rows]);
}

function formatPercentWithIndicator(percent) {
  if (!Number.isFinite(percent)) {
    return '';
  }

  const imageSrc = getCoverageLevelImage(percent);
  const imageHTML = `<img src="${imageSrc}">`;

  return imageHTML + '&nbsp;' + percent + '%';
}

function formatPercentDiff(percent) {
  if (!Number.isFinite(percent)) {
    return '';
  }

  const percentWithSign = percent >= 0 ? `+${percent}` : `${percent}`;
  return percentWithSign;
}

function getCoverageLevelImage(percent) {
  // https://github.com/istanbuljs/istanbuljs/blob/c1559005b3bb318da01f505740adb0e782aaf14e/packages/istanbul-lib-report/lib/watermarks.js
  if (percent >= 80) {
    return COVERAGE_LEVEL_IMAGE.high;
  } else if (percent >= 50) {
    return COVERAGE_LEVEL_IMAGE.medium;
  } else {
    return COVERAGE_LEVEL_IMAGE.low;
  }
}

function createLink(link, label) {
  return `<a href="${link}">${label}</a>`;
}

module.exports = {
  formatFilesCoverageDataToHTMLTable,
  formatPercentWithIndicator,
  formatPercentDiff,
};

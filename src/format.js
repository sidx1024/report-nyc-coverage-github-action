function formatChangedFilesCoverageDataToHTMLTable(changedFilesCoverageData, options = {}) {
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
      statements && data.statements.pct,
      branches && data.branches.pct,
      functions && data.functions.pct,
      lines && data.lines.pct,
    ].filter(Boolean);
  });

  return createTable([headers, ...rows]);
}

function getCells(data, type) {
  return data.map((cell) => `<${type}>${cell}</${type}>`).join('');
}

function createBody(data) {
  return data.map((row) => `<tr>${getCells(row, 'td')}</tr>`).join('');
}

function createTable(data) {
  // Destructure the headings (first row) from
  // all the rows
  const [headings, ...rows] = data;

  // Return some HTML that uses `getCells` to create
  // some headings, but also to create the rows
  // in the tbody.
  return `
    <table>
      <thead>${getCells(headings, 'th')}</thead>
      <tbody>${createBody(rows)}</tbody>
    </table>
  `;
}

module.exports = {
 formatChangedFilesCoverageDataToHTMLTable,
};

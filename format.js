function formatChangedFilesCoverageDataToMarkdownTable(changedFilesCoverageData, options = {}) {
  const { statements = false, branches = false, functions = false, lines = true } = options;

  const headers = [
    'File',
    statements && 'Statements',
    branches && 'Branches',
    functions && 'Functions',
    lines && 'Lines',
  ].filter(Boolean);

  const headersString = `|${headers.join('|')}|`;
  const headersBreakString = `|${headers.map((_) => '----').join('|')}|`;

  const body = changedFilesCoverageData.map(([file, data]) => {
    const row = [
      file,
      statements && data.statements.pct,
      branches && data.branches.pct,
      functions && data.functions.pct,
      lines && data.lines.pct,
    ].filter(Boolean);

    const rowString = `|${row.join('|')}|`;
    return rowString;
  });

  const bodyString = body.join('\n');

  return [headersString, headersBreakString, bodyString].join('\n');
}

module.exports = {
  formatChangedFilesCoverageDataToMarkdownTable,
};

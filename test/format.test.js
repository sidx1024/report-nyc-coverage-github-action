const t = require('tap');
const { readFile } = require('./test-helpers');
const { formatFilesCoverageDataToHTMLTable } = require('../src/format');

t.test('formatFilesCoverageDataToHTMLTable', async () => {
  const actual = formatFilesCoverageDataToHTMLTable(
    JSON.parse(readFile('sample-coverage-summary-output.json')).files_coverage_data,
  );

  const expected = readFile('formatted-table.html').trim();

  require('fs').writeFileSync('./formatted-table.html', actual);

  t.equal(actual, expected);
});

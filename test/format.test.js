const t = require('tap');
const { readFile } = require('./test-helpers');
const { formatChangedFilesCoverageDataToHTMLTable } = require('../src/format');

t.test('formatChangedFilesCoverageDataToHTMLTable', async () => {
  const actual = formatChangedFilesCoverageDataToHTMLTable(
    JSON.parse(readFile('sample-coverage-summary-output.json')).files_coverage_data,
  );

  const expected = readFile('formatted-table.html').trim();

  t.equal(actual, expected);
});

const t = require('tap');
const { readFile } = require('./test-helpers');

const { parseCoverageSummaryJSON } = require('../src/parse');

t.test('parseCoverageSummaryJSON', async () => {
  const sampleCoverageSummaryInputJSON = readFile('sample-coverage-summary-input.json');
  const sampleCoverageSummaryOutputJSON = readFile('sample-coverage-summary-output.json');

  const actual = JSON.parse(
    JSON.stringify(parseCoverageSummaryJSON(JSON.parse(sampleCoverageSummaryInputJSON))),
  );
  const expected = JSON.parse(sampleCoverageSummaryOutputJSON);

  require('fs').writeFileSync('./sample-coverage-summary-output.json', JSON.stringify(actual));

  t.strictSame(actual, expected);
});

t.test('parseCoverageSummaryJSON with base path trimmed', async () => {
  const sampleCoverageSummaryInputJSON = readFile('sample-coverage-summary-input.json');
  const sampleCoverageSummaryOutputJSON = readFile(
    'sample-coverage-summary-output-base-path-trimmed.json',
  );

  const actual = JSON.parse(
    JSON.stringify(
      parseCoverageSummaryJSON(JSON.parse(sampleCoverageSummaryInputJSON), {
        basePath: '/Users/sid/Work/other/coverage-reporter-action/',
      }),
    ),
  );
  const expected = JSON.parse(sampleCoverageSummaryOutputJSON);

  require('fs').writeFileSync('./sample-coverage-summary-output-base-path-trimmed.json', JSON.stringify(actual));

  t.strictSame(actual, expected);
});

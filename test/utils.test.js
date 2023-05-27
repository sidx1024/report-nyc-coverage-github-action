const t = require('tap');

const { replaceTokens } = require('../src/utils');

t.test('replaceTokens', async () => {
  t.equal(
    replaceTokens('{{one}}, {{two}}, and {{three}}', { one: 1, two: 2, three: 3 }),
    '1, 2, and 3',
  );

  t.throws(function throwsErrorForMissingToken() {
    replaceTokens('{{one}}, {{four}}, and {{five}}', { one: 1, two: 2, three: 3 });
  }, new Error('Invalid or missing tokens: four,five'));
});

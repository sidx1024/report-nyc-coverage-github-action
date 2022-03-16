/**
 * Given an input string and the token map
 * @param {string} input The input string containing tokens
 * @param {object} tokenMap Object containing the key-value pair for the token, and it's value
 * @returns {string}
 */
export function replaceTokens(input, tokenMap) {
  if (typeof input !== 'string') {
    throw new Error('Invalid argument input.');
  }

  if (!tokenMap || typeof tokenMap !== 'object') {
    throw new Error('Invalid argument tokenMap.');
  }

  let invalidOrMissingTokens = [];
  let output = input.replaceAll(/({{[^}][^}]*}})/g, function (token) {
    const rawToken = token.slice(2, -2);

    if (!Object.hasOwn(tokenMap, rawToken)) {
      invalidOrMissingTokens.push(rawToken);
      return token;
    }

    return tokenMap[rawToken];
  });

  if (invalidOrMissingTokens.length) {
    throw new Error('Invalid or missing tokens: ' + [invalidOrMissingTokens].join(','));
  }

  return output;
}

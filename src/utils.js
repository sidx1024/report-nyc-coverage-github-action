/**
 * Given an input string and the token map
 * @param {string} input The input string containing tokens
 * @param {object} tokenMap Object containing the key-value pair for the token, and it's value
 * @returns {string}
 */
function replaceTokens(input, tokenMap) {
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

function createHTMLTableFromArray(data) {
  // Destructure the headings (first row) from
  // all the rows
  const [headings, ...rows] = data;

  // Return some HTML that uses `getCells` to create
  // some headings, but also to create the rows
  // in the tbody.
  return `<table><thead>${getCells(headings, 'th')}</thead><tbody>${createBody(
    rows,
  )}</tbody></table>`;
}

function getCells(data, type) {
  return data.map((cell) => `<${type}>${cell}</${type}>`).join('');
}

function createBody(data) {
  return data.map((row) => `<tr>${getCells(row, 'td')}</tr>`).join('');
}

function trimBasePath(absolutePath, basePath) {
  if (basePath && absolutePath.startsWith(basePath)) {
    return absolutePath.slice(basePath.length);
  }

  return absolutePath;
}

module.exports = {
  replaceTokens,
  createHTMLTableFromArray,
  trimBasePath,
};

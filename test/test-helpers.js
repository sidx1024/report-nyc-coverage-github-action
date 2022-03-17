const t = require('tap');
const path = require('path');
const fs = require('fs');

module.exports = {
  readFile: (name) => fs.readFileSync(path.resolve(t.testdir(), '..', name), { encoding: 'utf-8' }),
};

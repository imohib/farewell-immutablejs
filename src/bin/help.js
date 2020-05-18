const { join } = require('path');
const { readFileSync } = require('fs');

module.exports = readFileSync(join(__dirname, './help.txt'), 'utf8');

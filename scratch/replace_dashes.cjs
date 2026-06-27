const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// Replace em-dash (—) and en-dash (–) with standard hyphen (-)
content = content.replace(/\u2014/g, '-');
content = content.replace(/\u2013/g, '-');

// Clean up spaced hyphens if needed (e.g. " - " instead of " - ")
content = content.replace(/\s+-\s+/g, ' - ');

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Em-dashes and en-dashes successfully replaced with small dashes!');

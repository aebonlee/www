const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const dirs = fs.readdirSync(BASE).filter(d => {
  const fp = path.join(BASE, d);
  return fs.statSync(fp).isDirectory() && !d.startsWith('.');
}).sort();

console.log('Total directories: ' + dirs.length + '\n');

for (const d of dirs) {
  const fp = path.join(BASE, d);
  const hasSrc = fs.existsSync(path.join(fp, 'src'));
  const hasTsconfig = fs.existsSync(path.join(fp, 'tsconfig.json'));
  const hasPkg = fs.existsSync(path.join(fp, 'package.json'));
  const hasIndex = fs.existsSync(path.join(fp, 'index.html'));
  const flags = [
    hasSrc ? 'src' : '',
    hasTsconfig ? 'tsconfig' : '',
    hasPkg ? 'pkg' : '',
    hasIndex ? 'html' : ''
  ].filter(Boolean).join(', ');
  console.log(d.padEnd(22) + flags);
}

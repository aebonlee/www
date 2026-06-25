const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const dirs = fs.readdirSync(BASE).filter(d => {
  const fp = path.join(BASE, d);
  return fs.statSync(fp).isDirectory()
    && fs.existsSync(path.join(fp, 'src'))
    && fs.existsSync(path.join(fp, 'tsconfig.json'));
});
console.log('Projects with src/ + tsconfig.json (' + dirs.length + '):');
dirs.sort().forEach(d => console.log('  ' + d));

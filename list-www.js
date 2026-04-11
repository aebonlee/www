const fs = require('fs');
const path = require('path');
const dir = 'D:\\dreamit-web\\www';
fs.readdirSync(dir).filter(f => !f.startsWith('.')).forEach(d => {
  const full = path.join(dir, d);
  const stat = fs.statSync(full);
  console.log(stat.isDirectory() ? `[DIR]  ${d}` : `       ${d}`);
});

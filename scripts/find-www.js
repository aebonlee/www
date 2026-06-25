const fs = require('fs');
const path = require('path');
const base = 'D:\\dreamit-web';
fs.readdirSync(base).forEach(d => {
  if (d === 'www') return;
  const p = path.join(base, d, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (pkg.homepage && pkg.homepage.includes('www.dreamitbiz'))
      console.log(d, '->', pkg.homepage);
  } catch {}
});

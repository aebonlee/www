const fs = require('fs');
const path = require('path');
const base = 'D:\\dreamit-web';
fs.readdirSync(base).forEach(d => {
  if (d === 'www') return;
  const p = path.join(base, d, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (pkg.homepage) console.log(d, '->', pkg.homepage);
  } catch {}
});
// Also check CNAME files
fs.readdirSync(base).forEach(d => {
  if (d === 'www') return;
  const c = path.join(base, d, 'public', 'CNAME');
  try {
    const cname = fs.readFileSync(c, 'utf8').trim();
    if (cname.includes('www') || cname.includes('dreamitbiz'))
      console.log(`[CNAME] ${d} -> ${cname}`);
  } catch {}
});

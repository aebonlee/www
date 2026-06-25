const fs = require('fs');
const path = require('path');
const src = path.join('D:\\dreamit-web\\www\\react-source\\dist');
const dst = path.join('D:\\dreamit-web\\www');

// Copy index.html
fs.copyFileSync(path.join(src, 'index.html'), path.join(dst, 'index.html'));
console.log('Copied index.html');

// Remove old JS/CSS from dst/assets (keep images)
const dstAssets = path.join(dst, 'assets');
function removeOld(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f !== 'images') removeOld(fp);
    } else if (/\.(js|css)$/.test(f)) {
      fs.unlinkSync(fp);
    }
  });
}
if (fs.existsSync(dstAssets)) removeOld(dstAssets);
console.log('Cleaned old assets');

// Copy new assets
function copyDir(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.readdirSync(s).forEach(f => {
    const sp = path.join(s, f);
    const dp = path.join(d, f);
    if (fs.statSync(sp).isDirectory()) copyDir(sp, dp);
    else fs.copyFileSync(sp, dp);
  });
}
copyDir(path.join(src, 'assets'), dstAssets);
console.log('Copied new assets');
console.log('Deploy to www root complete!');

const fs = require('fs');
const path = require('path');

const src = 'D:\\dreamit-web\\edu-hub';
const dst = 'D:\\dreamit-web\\ai-hub';
const skip = new Set(['node_modules', 'dist', '.git', '.claude', 'package-lock.json']);

function copyDir(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const sp = path.join(s, entry.name);
    const dp = path.join(d, entry.name);
    if (entry.isDirectory()) {
      copyDir(sp, dp);
    } else {
      fs.copyFileSync(sp, dp);
    }
  }
}

copyDir(src, dst);
console.log('Done: copied edu-hub -> ai-hub');

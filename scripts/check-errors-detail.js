const { execSync } = require('child_process');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const PROJECTS = ['koreatech', 'ahp_basic'];

for (const p of PROJECTS) {
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: path.join(BASE, p), encoding: 'utf8', timeout: 120000 });
  } catch (e) {
    const lines = (e.stdout || '').split('\n').filter(l => l.includes('error TS'));
    if (lines.length > 0) {
      console.log('\n=== ' + p + ' (' + lines.length + ' errors) ===');
      lines.forEach(l => console.log(l));
    }
  }
}

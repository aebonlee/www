const { execSync } = require('child_process');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const PROJECTS = [
  'planning', 'aI-agents', 'chatgpt', 'autowork', 'genspark',
  'koreait', 'gemini', 'ai-media', 'career', 'allthat',
  'software', 'papers', 'ai-data', 'uxdesign', 'marketing',
  'koreatech', 'ai-prompt', 'ahp_basic'
];

let total = 0;
for (const p of PROJECTS) {
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: path.join(BASE, p), encoding: 'utf8', timeout: 120000 });
    console.log(p + ': 0 errors');
  } catch (e) {
    const lines = (e.stdout || '').split('\n').filter(l => l.includes('error TS'));
    if (lines.length > 0) {
      console.log(p + ': ' + lines.length + ' errors');
      total += lines.length;
    } else {
      console.log(p + ': 0 errors');
    }
  }
}
console.log('\nTotal: ' + total);

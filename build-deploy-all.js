/**
 * Build & Deploy all 18 projects
 */
const { execSync } = require('child_process');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const PROJECTS = [
  'planning', 'aI-agents', 'chatgpt', 'autowork', 'genspark',
  'koreait', 'gemini', 'ai-media', 'career', 'allthat',
  'software', 'papers', 'ai-data', 'uxdesign', 'marketing',
  'koreatech', 'ai-prompt', 'ahp_basic'
];

const results = { success: [], failed: [] };

for (const proj of PROJECTS) {
  const dir = path.join(BASE, proj);
  console.log('\n═══ ' + proj + ' ═══');

  // Build
  try {
    console.log('  Building...');
    execSync('npx vite build', { cwd: dir, encoding: 'utf8', timeout: 120000, stdio: 'pipe' });
    console.log('  Build OK');
  } catch (e) {
    const msg = (e.stderr || e.stdout || '').toString().substring(0, 300);
    console.log('  Build FAILED: ' + msg);
    results.failed.push(proj + ' (build)');
    continue;
  }

  // Deploy
  try {
    console.log('  Deploying...');
    execSync('npx gh-pages -d dist', { cwd: dir, encoding: 'utf8', timeout: 120000, stdio: 'pipe' });
    console.log('  Deploy OK');
    results.success.push(proj);
  } catch (e) {
    const msg = (e.stderr || e.stdout || '').toString().substring(0, 300);
    console.log('  Deploy FAILED: ' + msg);
    results.failed.push(proj + ' (deploy)');
  }
}

console.log('\n════════════════════════════════');
console.log('Success: ' + results.success.length + '/' + PROJECTS.length);
console.log('Failed: ' + results.failed.length);
if (results.failed.length > 0) {
  console.log('Failed projects:');
  results.failed.forEach(p => console.log('  - ' + p));
}
console.log('════════════════════════════════');

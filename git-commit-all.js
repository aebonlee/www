/**
 * Git commit & push all projects with TSC fixes
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

const MSG = 'fix: resolve all tsc --noEmit errors for TypeScript migration';

for (const proj of PROJECTS) {
  const dir = path.join(BASE, proj);
  try {
    // Check if there are changes
    const status = execSync('git status --porcelain', { cwd: dir, encoding: 'utf8' }).trim();
    if (!status) {
      console.log(proj + ': no changes');
      continue;
    }

    // Count modified files
    const modifiedCount = status.split('\n').length;
    console.log(proj + ': ' + modifiedCount + ' files changed');

    // Stage all changes
    execSync('git add -A', { cwd: dir, encoding: 'utf8' });

    // Commit
    execSync('git commit -m "' + MSG + '"', { cwd: dir, encoding: 'utf8' });
    console.log('  Committed');

    // Push
    execSync('git push', { cwd: dir, encoding: 'utf8', timeout: 60000 });
    console.log('  Pushed');

  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || '').toString().substring(0, 200);
    console.log(proj + ': ERROR - ' + msg);
  }
}

// Also commit Dev_md04 doc
try {
  const devMd = path.join(BASE, 'Dev_md04');
  const status = execSync('git status --porcelain', { cwd: BASE, encoding: 'utf8' }).trim();
  if (status.includes('Dev_md04')) {
    console.log('\nDev_md04: committing documentation');
    execSync('git -C "' + BASE + '" add Dev_md04/', { encoding: 'utf8' });
    execSync('git -C "' + BASE + '" commit -m "docs: TSC 에러 일괄 수정 보고서 추가"', { encoding: 'utf8' });
    execSync('git -C "' + BASE + '" push', { encoding: 'utf8', timeout: 60000 });
    console.log('  Done');
  }
} catch (e) {
  console.log('Dev_md04: ' + (e.message || '').substring(0, 200));
}

console.log('\nDone!');

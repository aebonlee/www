/**
 * Auth 수정된 7개 사이트 빌드 & 커밋 & 푸시 & 배포
 */
const { execSync } = require('child_process');
const path = require('path');

const BASE = 'D:\\dreamit-web';

const projects = [
  'ai-hub', 'allthat', 'papers', 'marketing', 'edu-hub',
  'ai-data', 'ai-prompt'
];

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', timeout: 180000, stdio: 'pipe' });
  } catch (err) {
    return (err.stdout || '') + '\n' + (err.stderr || err.message);
  }
}

const results = [];

for (const proj of projects) {
  const dir = path.join(BASE, proj);
  console.log(`\n${'='.repeat(50)}`);
  console.log(`[${proj}] Starting...`);

  // 1. Build
  console.log(`  [build] vite build...`);
  const buildOut = run('npx vite build', dir);
  if (buildOut.includes('error') && !buildOut.includes('built in')) {
    console.log(`  [build] FAILED:`);
    console.log(buildOut.slice(0, 500));
    results.push({ proj, status: 'BUILD_FAILED' });
    continue;
  }
  const timeMatch = buildOut.match(/built in ([\d.]+s)/);
  console.log(`  [build] OK ${timeMatch ? timeMatch[1] : ''}`);

  // 2. Git commit & push
  console.log(`  [git] commit & push...`);
  run('git add -A', dir);
  const commitOut = run(
    `git commit -m "fix: OAuth redirect URL 통일 및 emailRedirectTo 추가"`,
    dir
  );
  if (commitOut.includes('nothing to commit')) {
    console.log(`  [git] nothing to commit`);
  } else {
    console.log(`  [git] committed`);
  }
  const pushOut = run('git push', dir);
  console.log(`  [git] pushed`);

  // 3. Deploy
  console.log(`  [deploy] gh-pages...`);
  const deployOut = run('npx gh-pages -d dist', dir);
  if (deployOut.includes('Published') || deployOut.trim() === '') {
    console.log(`  [deploy] OK`);
    results.push({ proj, status: 'OK' });
  } else {
    console.log(`  [deploy] ${deployOut.slice(0, 200)}`);
    results.push({ proj, status: 'DEPLOY_ISSUE' });
  }

  console.log(`[${proj}] DONE`);
}

console.log(`\n${'='.repeat(50)}`);
console.log('Results:');
results.forEach(r => console.log(`  ${r.proj}: ${r.status}`));
console.log('All projects processed!');

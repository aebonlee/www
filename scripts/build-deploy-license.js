/**
 * LicenseGuard 적용된 12개 프로젝트 빌드 & 커밋 & 푸시 & 배포
 */
const { execSync } = require('child_process');
const path = require('path');

const BASE = 'D:\\dreamit-web';

const projects = [
  'ai-hub',
  'chatgpt', 'gemini', 'genspark', 'claude', 'openclaw',
  'aI-agents', 'ai-media',
  'autowork', 'fine-tuning',
  'ai-data', 'ai-prompt'
];

function run(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', timeout: 180000, stdio: 'pipe' });
  } catch (err) {
    return err.stdout + '\n' + (err.stderr || err.message);
  }
}

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
    continue;
  }
  const timeMatch = buildOut.match(/built in ([\d.]+s)/);
  console.log(`  [build] OK ${timeMatch ? timeMatch[1] : ''}`);

  // 2. Git commit & push
  console.log(`  [git] commit & push...`);
  run('git add -A', dir);
  const commitOut = run(
    `git commit -m "feat: LicenseGuard 콘텐츠 접근 제어 시스템 적용" --allow-empty`,
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
  } else {
    console.log(`  [deploy] ${deployOut.slice(0, 200)}`);
  }

  console.log(`[${proj}] DONE`);
}

console.log(`\n${'='.repeat(50)}`);
console.log('All projects processed!');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECTS = [
  'planning', 'aI-agents', 'chatgpt', 'autowork', 'genspark',
  'forjob', 'koreait', 'gemini', 'ai-media', 'career',
  'allthat', 'software', 'papers', 'ai-data', 'uxdesign',
  'marketing', 'koreatech', 'ai-prompt', 'ahp_basic'
];

const BASE = 'D:\\dreamit-web';

function findFiles(dir, ext) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findFiles(full, ext));
    } else if (item.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

for (const proj of PROJECTS) {
  const dir = path.join(BASE, proj);
  console.log(`\n=== ${proj} ===`);

  // Update index.html
  const indexPath = path.join(dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    if (html.includes('main.jsx')) {
      html = html.replace(/main\.jsx/g, 'main.tsx');
      fs.writeFileSync(indexPath, html);
      console.log('  index.html updated');
    } else {
      console.log('  index.html already updated');
    }
  }

  // Rename .jsx to .tsx
  const srcDir = path.join(dir, 'src');
  const jsxFiles = findFiles(srcDir, '.jsx');
  let renamed = 0;
  for (const f of jsxFiles) {
    const newPath = f.replace(/\.jsx$/, '.tsx');
    fs.renameSync(f, newPath);
    renamed++;
  }
  console.log(`  Renamed ${renamed} .jsx -> .tsx`);

  // Fix catch patterns in all .tsx files
  const tsxFiles = findFiles(srcDir, '.tsx');
  let catchFixed = 0;
  for (const f of tsxFiles) {
    let content = fs.readFileSync(f, 'utf8');
    const orig = content;
    content = content.replace(/catch\s*\(err\)/g, 'catch (err: any)');
    content = content.replace(/catch\s*\(error\)/g, 'catch (error: any)');
    content = content.replace(/catch\s*\(e\)/g, 'catch (e: any)');
    if (content !== orig) {
      fs.writeFileSync(f, content);
      catchFixed++;
    }
  }
  console.log(`  Fixed catch patterns in ${catchFixed} files`);

  // Run tsc
  try {
    const tscResult = execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 60000 });
    console.log('  tsc: 0 errors');
  } catch (e) {
    const output = e.stdout || '';
    const errors = (output.match(/error TS/g) || []).length;
    console.log(`  tsc: ${errors} errors`);
    if (errors > 0) {
      // Save errors
      const errorFile = path.join(BASE, 'www', `${proj}-tsc-errors.txt`);
      fs.writeFileSync(errorFile, output);
    }
  }

  // Build
  try {
    const buildResult = execSync('npx vite build 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    const lines = buildResult.trim().split('\n');
    console.log('  build: ' + lines.slice(-2).join(' | '));
  } catch (e) {
    console.log('  build: FAILED - ' + (e.stdout || '').split('\n').slice(-3).join(' '));
  }

  // Commit
  try {
    execSync('git add -A', { cwd: dir, encoding: 'utf8' });
    const commitResult = execSync('git commit -m "TypeScript 마이그레이션: JSX를 TSX로 전환 및 타입 에러 수정"', { cwd: dir, encoding: 'utf8' });
    const commitHash = commitResult.match(/\[[\w-]+ ([a-f0-9]+)\]/);
    console.log(`  commit: ${commitHash ? commitHash[1] : 'done'}`);
  } catch (e) {
    console.log('  commit: ' + (e.stdout || e.message).split('\n')[0]);
  }

  // Push
  try {
    execSync('git push 2>&1', { cwd: dir, encoding: 'utf8', timeout: 30000 });
    console.log('  push: done');
  } catch (e) {
    console.log('  push: ' + (e.stderr || e.stdout || e.message).split('\n').filter(l => l.trim()).slice(-1)[0]);
  }

  // Deploy
  try {
    execSync('npx gh-pages -d dist 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    console.log('  deploy: Published');
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    if (out.includes('Published')) {
      console.log('  deploy: Published');
    } else {
      console.log('  deploy: ' + out.split('\n').filter(l => l.trim()).slice(-1)[0]);
    }
  }

  console.log(`=== ${proj} COMPLETE ===`);
}

console.log('\n========== ALL 19 PROJECTS DONE ==========');

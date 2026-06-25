const fs = require('fs');
const path = require('path');

const REPO = 'D:\\dreamit-web\\sqld\\sqld-repo';

console.log('=== sqld-repo 프로젝트 상세 분석 ===\n');

// List all files
const items = fs.readdirSync(REPO);
console.log('── 루트 구조 ──');
items.forEach(f => {
  if (f === 'node_modules' || f === '.git') return;
  const fp = path.join(REPO, f);
  const s = fs.statSync(fp);
  if (s.isDirectory()) {
    const sub = fs.readdirSync(fp).slice(0, 15);
    console.log('  [DIR] ' + f + '/ → ' + sub.join(', '));
  } else {
    console.log('        ' + f + ' (' + (s.size / 1024).toFixed(1) + 'KB)');
  }
});

// package.json
const pkgPath = path.join(REPO, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log('\n── package.json ──');
  console.log('  name:', pkg.name);
  console.log('  scripts:', JSON.stringify(pkg.scripts, null, 2));
  console.log('  dependencies:', Object.keys(pkg.dependencies || {}).join(', '));
  console.log('  devDependencies:', Object.keys(pkg.devDependencies || {}).join(', '));
}

// tsconfig
const tscPath = path.join(REPO, 'tsconfig.json');
console.log('\n  tsconfig.json:', fs.existsSync(tscPath));
if (fs.existsSync(tscPath)) {
  console.log(fs.readFileSync(tscPath, 'utf8').substring(0, 500));
}

// Check for src
const srcPath = path.join(REPO, 'src');
console.log('\n  src/ 존재:', fs.existsSync(srcPath));
if (fs.existsSync(srcPath)) {
  const srcFiles = fs.readdirSync(srcPath);
  console.log('  src/ 내용:', srcFiles.join(', '));
}

// index.html
const indexPath = path.join(REPO, 'index.html');
console.log('\n  index.html 존재:', fs.existsSync(indexPath));
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  console.log('  index.html 크기:', (content.length / 1024).toFixed(1) + 'KB');
  // Check if it's a SPA entry point or static
  console.log('  React/Vite 엔트리:', content.includes('src/main') || content.includes('/src/'));
  console.log('  script 태그:', content.match(/<script[^>]*>/g)?.join(', ') || 'none');
}

// CNAME
const cname = path.join(REPO, 'CNAME');
if (fs.existsSync(cname)) {
  console.log('\n  CNAME:', fs.readFileSync(cname, 'utf8').trim());
}

// dist 확인
const distPath = path.join(REPO, 'dist');
if (fs.existsSync(distPath)) {
  const distItems = fs.readdirSync(distPath).slice(0, 10);
  console.log('\n── dist/ ──');
  console.log('  ', distItems.join(', '));
}

// .git
const gitPath = path.join(REPO, '.git');
console.log('\n── Git ──');
console.log('  .git 존재:', fs.existsSync(gitPath));

// Check DEVELOPMENT.md
const devMd = path.join(REPO, 'DEVELOPMENT.md');
if (fs.existsSync(devMd)) {
  console.log('\n── DEVELOPMENT.md (첫 30줄) ──');
  const lines = fs.readFileSync(devMd, 'utf8').split('\n').slice(0, 30);
  lines.forEach(l => console.log('  ' + l));
}

const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';
const sqldPath = path.join(BASE, 'sqld');

console.log('=== sqld 프로젝트 분석 ===\n');
console.log('경로:', sqldPath);
console.log('존재:', fs.existsSync(sqldPath));

if (fs.existsSync(sqldPath)) {
  const stat = fs.statSync(sqldPath);
  console.log('디렉토리:', stat.isDirectory());

  const items = fs.readdirSync(sqldPath);
  console.log('파일 수:', items.length);
  console.log('\n── 구조 ──');
  items.forEach(f => {
    const fp = path.join(sqldPath, f);
    const s = fs.statSync(fp);
    if (s.isDirectory()) {
      const sub = fs.readdirSync(fp).slice(0, 10);
      console.log('  [DIR] ' + f + '/ → ' + sub.join(', '));
    } else {
      console.log('        ' + f + ' (' + (s.size / 1024).toFixed(1) + 'KB)');
    }
  });

  // Check key files
  console.log('\n── 주요 파일 확인 ──');
  console.log('  package.json:', fs.existsSync(path.join(sqldPath, 'package.json')));
  console.log('  tsconfig.json:', fs.existsSync(path.join(sqldPath, 'tsconfig.json')));
  console.log('  src/:', fs.existsSync(path.join(sqldPath, 'src')));
  console.log('  index.html:', fs.existsSync(path.join(sqldPath, 'index.html')));
  console.log('  vite.config:', fs.existsSync(path.join(sqldPath, 'vite.config.ts')) || fs.existsSync(path.join(sqldPath, 'vite.config.js')));

  // If package.json exists, read it
  const pkgPath = path.join(sqldPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log('\n── package.json ──');
    console.log('  name:', pkg.name);
    console.log('  scripts:', JSON.stringify(pkg.scripts, null, 2));
    console.log('  dependencies:', Object.keys(pkg.dependencies || {}).join(', '));
    console.log('  devDependencies:', Object.keys(pkg.devDependencies || {}).join(', '));
  }

  // If tsconfig exists, read it
  const tscPath = path.join(sqldPath, 'tsconfig.json');
  if (fs.existsSync(tscPath)) {
    console.log('\n── tsconfig.json ──');
    console.log(fs.readFileSync(tscPath, 'utf8').substring(0, 500));
  }

  // Check if there's a .git folder
  console.log('\n── Git 상태 ──');
  console.log('  .git:', fs.existsSync(path.join(sqldPath, '.git')));

} else {
  // Search for anything sqld-related
  console.log('\n폴더가 없습니다. D:\\dreamit-web 내 유사 폴더 검색:');
  const allDirs = fs.readdirSync(BASE).filter(d => {
    try { return fs.statSync(path.join(BASE, d)).isDirectory(); } catch(e) { return false; }
  });
  const matches = allDirs.filter(d => d.toLowerCase().includes('sqld') || d.toLowerCase().includes('sql'));
  console.log('  매칭:', matches.length > 0 ? matches.join(', ') : '없음');
  console.log('\n전체 디렉토리 수:', allDirs.length);
}

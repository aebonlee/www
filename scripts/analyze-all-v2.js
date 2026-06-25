const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE = 'D:\\dreamit-web';
const EXCLUDE = ['jobpath'];

// Get all project dirs with tsconfig.json
const projects = fs.readdirSync(BASE).filter(d => {
  if (EXCLUDE.includes(d)) return false;
  const fp = path.join(BASE, d);
  return fs.statSync(fp).isDirectory()
    && fs.existsSync(path.join(fp, 'src'))
    && fs.existsSync(path.join(fp, 'tsconfig.json'));
}).sort();

console.log('Analyzing ' + projects.length + ' projects (excluding: ' + EXCLUDE.join(', ') + ')\n');

const results = [];
let totalErrors = 0;
let zeroCount = 0;

for (const proj of projects) {
  const dir = path.join(BASE, proj);
  process.stdout.write(proj + '... ');
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    results.push({ proj, errors: 0, details: [], categories: {} });
    zeroCount++;
    console.log('0');
  } catch (e) {
    const stdout = e.stdout || '';
    const lines = stdout.split('\n').filter(l => l.includes('error TS'));
    const count = lines.length;
    totalErrors += count;

    const categories = {};
    lines.forEach(l => {
      const match = l.match(/error (TS\d+)/);
      if (match) categories[match[1]] = (categories[match[1]] || 0) + 1;
    });

    results.push({ proj, errors: count, details: lines, categories });
    console.log(count);
  }
}

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║      TSC --noEmit 전��� 분석 결과 (v2)           ║');
console.log('╠══════════════════════════════════════════════════╣');
console.log('║  총 프로젝트: ' + projects.length.toString().padStart(3) + '                               ║');
console.log('��  에러 0개:    ' + zeroCount.toString().padStart(3) + '                               ║');
console.log('║  에러 있음:   ' + (projects.length - zeroCount).toString().padStart(3) + '                               ║');
console.log('║  총 에러:     ' + totalErrors.toString().padStart(5) + '                             ║');
console.log('╚══════════════════════════════════════════════════╝');

console.log('\n── 프로젝트별 에러 수 ──');
const sorted = [...results].sort((a, b) => b.errors - a.errors);
for (const r of sorted) {
  const bar = r.errors > 0 ? ' ' + '█'.repeat(Math.min(Math.ceil(r.errors / 5), 50)) : '';
  const status = r.errors === 0 ? ' ✓' : '';
  console.log(r.proj.padEnd(20) + r.errors.toString().padStart(5) + status + bar);
}

// Detailed errors
const withErrors = results.filter(r => r.errors > 0);
if (withErrors.length > 0) {
  console.log('\n── 에러 유형별 글로벌 분석 ──');
  const globalCats = {};
  for (const r of withErrors) {
    for (const [code, count] of Object.entries(r.categories)) {
      globalCats[code] = (globalCats[code] || 0) + count;
    }
  }
  Object.entries(globalCats).sort((a, b) => b[1] - a[1]).forEach(([code, count]) => {
    console.log('  ' + code + ': ' + count + '개');
  });

  console.log('\n── 프로젝트별 상세 에러 ──');
  for (const r of withErrors.sort((a, b) => b.errors - a.errors)) {
    console.log('\n=== ' + r.proj + ' (' + r.errors + ' errors) ===');
    r.details.slice(0, 50).forEach(l => console.log('  ' + l));
    if (r.details.length > 50) console.log('  ... (' + (r.details.length - 50) + ' more)');
  }
}

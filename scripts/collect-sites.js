const fs = require('fs');
const path = require('path');

const baseDir = path.join('D:', 'dreamit-web');
const skipDirs = new Set(['www', 'Dev_md04', 'Dev_md', 'Dev_md0320', 'node_modules', '.git']);

const entries = fs.readdirSync(baseDir, { withFileTypes: true });
const results = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (skipDirs.has(entry.name)) continue;

  const projDir = path.join(baseDir, entry.name);
  const pkgPath = path.join(projDir, 'package.json');

  if (!fs.existsSync(pkgPath)) continue;

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    continue;
  }

  const homepage = pkg.homepage || '';

  let cname = '';
  const cnameRoot = path.join(projDir, 'CNAME');
  const cnamePublic = path.join(projDir, 'public', 'CNAME');
  if (fs.existsSync(cnameRoot)) {
    cname = fs.readFileSync(cnameRoot, 'utf8').trim();
  } else if (fs.existsSync(cnamePublic)) {
    cname = fs.readFileSync(cnamePublic, 'utf8').trim();
  }

  let framework = 'Unknown';
  const hasNextTs = fs.existsSync(path.join(projDir, 'next.config.ts'));
  const hasNextJs = fs.existsSync(path.join(projDir, 'next.config.js'));
  const hasNextMjs = fs.existsSync(path.join(projDir, 'next.config.mjs'));
  const hasViteTs = fs.existsSync(path.join(projDir, 'vite.config.ts'));
  const hasViteJs = fs.existsSync(path.join(projDir, 'vite.config.js'));

  if (hasNextTs || hasNextJs || hasNextMjs) {
    framework = 'Next.js';
  } else if (hasViteTs || hasViteJs) {
    framework = 'Vite';
  }

  const url = cname ? ('https://' + cname) : (homepage || '(none)');

  results.push({ name: entry.name, framework, cname, homepage, url });
}

results.sort((a, b) => a.name.localeCompare(b.name));

console.log('');
console.log('='.repeat(90));
console.log('  DEPLOYED SITES UNDER D:/dreamit-web/');
console.log('='.repeat(90));
console.log('');
console.log(pad('PROJECT', 20) + ' | ' + pad('FRAMEWORK', 10) + ' | URL');
console.log(pad('-', 20, '-') + ' | ' + pad('-', 10, '-') + ' | ' + '-'.repeat(55));

for (const r of results) {
  console.log(pad(r.name, 20) + ' | ' + pad(r.framework, 10) + ' | ' + r.url);
}

console.log('');
console.log('Total projects: ' + results.length);
console.log('');
console.log('--- DETAIL: CNAME vs Homepage ---');
console.log(pad('PROJECT', 20) + ' | ' + pad('CNAME', 35) + ' | HOMEPAGE');
console.log(pad('-', 20, '-') + ' | ' + pad('-', 35, '-') + ' | ' + '-'.repeat(55));
for (const r of results) {
  console.log(pad(r.name, 20) + ' | ' + pad(r.cname || '(none)', 35) + ' | ' + (r.homepage || '(none)'));
}
console.log('');

function pad(str, len, ch) {
  ch = ch || ' ';
  if (ch === '-') return ch.repeat(len);
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

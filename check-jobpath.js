const { execSync } = require('child_process');
const path = require('path');

const dir = path.join('D:\\dreamit-web', 'jobpath');
console.log('=== jobpath tsc --noEmit ===');
try {
  execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
  console.log('0 errors');
} catch (e) {
  const lines = (e.stdout || '').split('\n').filter(l => l.includes('error TS'));
  console.log(lines.length + ' errors');
  if (lines.length > 0) {
    // Categorize
    const cats = {};
    lines.forEach(l => {
      const m = l.match(/error (TS\d+)/);
      if (m) cats[m[1]] = (cats[m[1]] || 0) + 1;
    });
    console.log('\nError categories:');
    Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([c,n]) => console.log('  ' + c + ': ' + n));
    console.log('\nAll errors:');
    lines.slice(0, 80).forEach(l => console.log('  ' + l));
    if (lines.length > 80) console.log('  ... (' + (lines.length - 80) + ' more)');
  }
}

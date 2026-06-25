const fs = require('fs');
const path = require('path');
const BASE = 'D:\\dreamit-web';

// Check forjob specifically
const forjobPath = path.join(BASE, 'forjob');
console.log('forjob exists:', fs.existsSync(forjobPath));
if (fs.existsSync(forjobPath)) {
  console.log('  is directory:', fs.statSync(forjobPath).isDirectory());
  console.log('  has src:', fs.existsSync(path.join(forjobPath, 'src')));
  console.log('  has tsconfig:', fs.existsSync(path.join(forjobPath, 'tsconfig.json')));
  console.log('  has package.json:', fs.existsSync(path.join(forjobPath, 'package.json')));
  try {
    const contents = fs.readdirSync(forjobPath).slice(0, 20);
    console.log('  contents:', contents.join(', '));
  } catch(e) { console.log('  error:', e.message); }
} else {
  // Check if it's a symlink or something
  console.log('Checking all dirs containing "forjob":');
  fs.readdirSync(BASE).filter(d => d.toLowerCase().includes('forjob') || d.toLowerCase().includes('for-job')).forEach(d => {
    console.log('  ' + d);
  });
}

// Also check all dirs with src+tsconfig for a complete count
const withTsc = fs.readdirSync(BASE).filter(d => {
  const fp = path.join(BASE, d);
  try {
    return fs.statSync(fp).isDirectory()
      && fs.existsSync(path.join(fp, 'src'))
      && fs.existsSync(path.join(fp, 'tsconfig.json'));
  } catch(e) { return false; }
});
console.log('\nTotal with src+tsconfig: ' + withTsc.length);
console.log(withTsc.sort().join(', '));

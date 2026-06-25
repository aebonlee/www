const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git') {
      results.push(...getAllFiles(fullPath, ext));
    } else if (item.isFile() && item.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = 'D:/dreamit-web/sqld/src';

// Rename .jsx -> .tsx
const jsxFiles = getAllFiles(srcDir, '.jsx');
console.log(`Found ${jsxFiles.length} .jsx files`);
for (const f of jsxFiles) {
  const newPath = f.replace(/\.jsx$/, '.tsx');
  fs.renameSync(f, newPath);
  console.log(`  ${path.relative(srcDir, f)} -> ${path.basename(newPath)}`);
}

// Rename .js -> .ts (check for JSX content first)
const jsFiles = getAllFiles(srcDir, '.js');
console.log(`\nFound ${jsFiles.length} .js files`);
for (const f of jsFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const hasJSX = /<[A-Z][a-zA-Z]*[\s/>]/.test(content) || /return\s*\([\s\S]*</.test(content) || /React\.createElement/.test(content);
  const newExt = hasJSX ? '.tsx' : '.ts';
  const newPath = f.replace(/\.js$/, newExt);
  fs.renameSync(f, newPath);
  console.log(`  ${path.relative(srcDir, f)} -> ${path.basename(newPath)}${hasJSX ? ' (contains JSX)' : ''}`);
}

console.log('\nDone!');

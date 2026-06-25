const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext) {
  const results = [];
  try {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git') {
        results.push(...getAllFiles(fullPath, ext));
      } else if (item.isFile() && item.name.endsWith(ext)) {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

function convertProject(projPath) {
  const srcDir = path.join(projPath, 'src');
  const projName = path.basename(projPath);

  const jsFiles = getAllFiles(srcDir, '.js');
  console.log(`\n=== ${projName}: ${jsFiles.length} .js files ===`);

  let converted = 0;
  for (const f of jsFiles) {
    const content = fs.readFileSync(f, 'utf8');
    // Check if file contains JSX syntax
    const hasJSX = /<[A-Z][a-zA-Z]*[\s/>]/.test(content) ||
                   /return\s*\([\s\S]*</.test(content) ||
                   /React\.createElement/.test(content) ||
                   content.includes('import React');

    const newExt = hasJSX ? '.tsx' : '.ts';
    const newPath = f.replace(/\.js$/, newExt);
    fs.renameSync(f, newPath);
    converted++;

    const rel = path.relative(srcDir, f);
    if (hasJSX) {
      console.log(`  ${rel} -> ${newExt} (JSX detected)`);
    }
  }

  console.log(`  Converted: ${converted} files`);

  // Count results
  const tsxCount = getAllFiles(srcDir, '.tsx').length;
  const tsCount = getAllFiles(srcDir, '.ts').length;
  const jsxRemaining = getAllFiles(srcDir, '.jsx').length;
  const jsRemaining = getAllFiles(srcDir, '.js').length;
  const total = tsxCount + tsCount + jsxRemaining + jsRemaining;
  const tsRatio = total > 0 ? ((tsxCount + tsCount) / total * 100).toFixed(0) : 0;
  console.log(`  Result: TSX=${tsxCount}, TS=${tsCount}, JSX=${jsxRemaining}, JS=${jsRemaining} => TS ratio: ${tsRatio}%`);

  return converted;
}

// Process both projects
const projects = ['D:/dreamit-web/autowork', 'D:/dreamit-web/fine-tuning'];
let total = 0;
for (const p of projects) {
  total += convertProject(p);
}
console.log(`\nTotal converted: ${total} files`);

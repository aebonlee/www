const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sqldRoot = 'D:/dreamit-web/sqld';
const sqldRepo = 'D:/dreamit-web/sqld/sqld-repo';

// Items in sqld-repo to move
const items = fs.readdirSync(sqldRepo);
console.log('Items to move:', items);

// Move each item (except node_modules and .git)
for (const item of items) {
  if (item === 'node_modules') {
    console.log(`  SKIP: ${item} (will reinstall later)`);
    continue;
  }

  const src = path.join(sqldRepo, item);
  const dest = path.join(sqldRoot, item);

  if (fs.existsSync(dest)) {
    console.log(`  SKIP: ${item} (already exists at destination)`);
    continue;
  }

  // Use robocopy for directories, copy for files on Windows
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    // For .git, use xcopy
    execSync(`xcopy "${src.replace(/\//g, '\\')}" "${dest.replace(/\//g, '\\')}\\" /E /H /I /Q`, { stdio: 'inherit' });
    console.log(`  MOVED dir: ${item}`);
  } else {
    fs.copyFileSync(src, dest);
    console.log(`  MOVED file: ${item}`);
  }
}

console.log('\nDone moving files. Now remove sqld-repo...');

// Remove sqld-repo (use rimraf-like approach)
execSync(`rmdir /S /Q "${sqldRepo.replace(/\//g, '\\')}"`, { stdio: 'inherit' });
console.log('sqld-repo removed successfully!');

// Verify
const newItems = fs.readdirSync(sqldRoot);
console.log('\nNew sqld root contents:', newItems);

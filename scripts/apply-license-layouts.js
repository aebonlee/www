/**
 * PublicLayout.tsx에 LicenseProvider/LockOverlay 적용 + CSS import 추가
 * Pattern A: gemini, genspark, claude, openclaw, aI-agents, ai-media
 * Pattern B: autowork, fine-tuning
 * Pattern C: ai-data, ai-prompt (Outlet 패턴, src/components/)
 */
const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';

// === Pattern A sites (src/layouts/PublicLayout.tsx, Routes 내부) ===
const patternA = ['gemini', 'genspark', 'claude', 'openclaw', 'aI-agents', 'ai-media'];

for (const site of patternA) {
  const layoutPath = path.join(BASE, site, 'src', 'layouts', 'PublicLayout.tsx');
  if (!fs.existsSync(layoutPath)) {
    console.log(`SKIP layout: ${site} — file not found`);
    continue;
  }

  let content = fs.readFileSync(layoutPath, 'utf-8');

  // Skip if already applied
  if (content.includes('LicenseProvider')) {
    console.log(`SKIP layout: ${site} — already applied`);
    continue;
  }

  // Add imports after existing imports
  const importLines = [
    "import { LicenseProvider } from '../components/LicenseGuard';",
    "import LockOverlay from '../components/LockOverlay';"
  ].join('\n');

  // Find the last import line and add after it
  const importRegex = /^import .+;$/gm;
  let lastImportIndex = 0;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportIndex = match.index + match[0].length;
  }
  content = content.slice(0, lastImportIndex) + '\n' + importLines + content.slice(lastImportIndex);

  // Wrap the outer div with LicenseProvider
  // Find: return ( <div className="site-wrapper">
  content = content.replace(
    /return\s*\(\s*\n(\s*)<div className="site-wrapper">/,
    'return (\n$1<LicenseProvider>\n$1<div className="site-wrapper">'
  );

  // Add LockOverlay before closing </div> and add </LicenseProvider>
  // Find: </Footer> </div> );
  content = content.replace(
    /(<Footer\s*\/>)\s*\n(\s*)<\/div>\s*\n(\s*)\);/,
    '$1\n$2  <LockOverlay />\n$2</div>\n$2</LicenseProvider>\n$3);'
  );

  fs.writeFileSync(layoutPath, content, 'utf-8');
  console.log(`OK layout: ${site}`);
}

// === Pattern B sites (autowork, fine-tuning — same layout structure) ===
const patternB = ['autowork', 'fine-tuning'];

for (const site of patternB) {
  const layoutPath = path.join(BASE, site, 'src', 'layouts', 'PublicLayout.tsx');
  if (!fs.existsSync(layoutPath)) {
    console.log(`SKIP layout: ${site} — file not found`);
    continue;
  }

  let content = fs.readFileSync(layoutPath, 'utf-8');

  if (content.includes('LicenseProvider')) {
    console.log(`SKIP layout: ${site} — already applied`);
    continue;
  }

  const importLines = [
    "import { LicenseProvider } from '../components/LicenseGuard';",
    "import LockOverlay from '../components/LockOverlay';"
  ].join('\n');

  const importRegex = /^import .+;$/gm;
  let lastImportIndex = 0;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportIndex = match.index + match[0].length;
  }
  content = content.slice(0, lastImportIndex) + '\n' + importLines + content.slice(lastImportIndex);

  content = content.replace(
    /return\s*\(\s*\n(\s*)<div className="site-wrapper">/,
    'return (\n$1<LicenseProvider>\n$1<div className="site-wrapper">'
  );

  content = content.replace(
    /(<Footer\s*\/>)\s*\n(\s*)<\/div>\s*\n(\s*)\);/,
    '$1\n$2  <LockOverlay />\n$2</div>\n$2</LicenseProvider>\n$3);'
  );

  fs.writeFileSync(layoutPath, content, 'utf-8');
  console.log(`OK layout: ${site}`);
}

// === Pattern C sites (ai-data, ai-prompt — src/components/PublicLayout.tsx, Outlet) ===
const patternC = ['ai-data', 'ai-prompt'];

for (const site of patternC) {
  const layoutPath = path.join(BASE, site, 'src', 'components', 'PublicLayout.tsx');
  if (!fs.existsSync(layoutPath)) {
    console.log(`SKIP layout: ${site} — file not found`);
    continue;
  }

  let content = fs.readFileSync(layoutPath, 'utf-8');

  if (content.includes('LicenseProvider')) {
    console.log(`SKIP layout: ${site} — already applied`);
    continue;
  }

  const importLines = [
    "import { LicenseProvider } from './LicenseGuard';",
    "import LockOverlay from './LockOverlay';"
  ].join('\n');

  const importRegex = /^import .+;$/gm;
  let lastImportIndex = 0;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportIndex = match.index + match[0].length;
  }
  content = content.slice(0, lastImportIndex) + '\n' + importLines + content.slice(lastImportIndex);

  // Wrap with LicenseProvider
  content = content.replace(
    /return\s*\(\s*\n(\s*)<div className="site-wrapper">/,
    'return (\n$1<LicenseProvider>\n$1<div className="site-wrapper">'
  );

  // Add LockOverlay before closing
  content = content.replace(
    /(<Footer\s*\/>)\s*\n(\s*)<\/div>\s*\n(\s*)\);/,
    '$1\n$2  <LockOverlay />\n$2</div>\n$2</LicenseProvider>\n$3);'
  );

  fs.writeFileSync(layoutPath, content, 'utf-8');
  console.log(`OK layout: ${site}`);
}

// === CSS Import 추가 ===
console.log('\\n--- CSS Imports ---');

// Pattern A/B sites: src/styles/index.css
const cssNormalSites = ['gemini', 'genspark', 'claude', 'openclaw', 'aI-agents', 'ai-media', 'autowork', 'fine-tuning'];
for (const site of cssNormalSites) {
  const cssPath = path.join(BASE, site, 'src', 'styles', 'index.css');
  if (!fs.existsSync(cssPath)) {
    console.log(`SKIP css: ${site} — index.css not found`);
    continue;
  }
  let css = fs.readFileSync(cssPath, 'utf-8');
  if (css.includes('license-lock.css')) {
    console.log(`SKIP css: ${site} — already has import`);
    continue;
  }
  css = css.trimEnd() + '\n@import \'./license-lock.css\';\n';
  fs.writeFileSync(cssPath, css, 'utf-8');
  console.log(`OK css: ${site}`);
}

// Pattern C sites: src/index.css
for (const site of patternC) {
  const cssPath = path.join(BASE, site, 'src', 'index.css');
  if (!fs.existsSync(cssPath)) {
    console.log(`SKIP css: ${site} — index.css not found`);
    continue;
  }
  let css = fs.readFileSync(cssPath, 'utf-8');
  if (css.includes('license-lock.css')) {
    console.log(`SKIP css: ${site} — already has import`);
    continue;
  }
  css = css.trimEnd() + '\n@import \'./styles/license-lock.css\';\n';
  fs.writeFileSync(cssPath, css, 'utf-8');
  console.log(`OK css: ${site}`);
}

console.log('\\nAll done!');

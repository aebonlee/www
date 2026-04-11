/**
 * LicenseGuard 공유 컴포넌트를 11개 사이트에 복사하는 스크립트
 * - LicenseGuard.tsx, LockOverlay.tsx → src/components/
 * - license-lock.css → src/styles/
 * chatgpt는 이미 적용됨, 나머지 10개 사이트에 복사
 */
const fs = require('fs');
const path = require('path');

const BASE = 'D:\\dreamit-web';

// chatgpt 원본 파일 경로
const SRC_GUARD = path.join(BASE, 'chatgpt', 'src', 'components', 'LicenseGuard.tsx');
const SRC_OVERLAY = path.join(BASE, 'chatgpt', 'src', 'components', 'LockOverlay.tsx');
const SRC_CSS = path.join(BASE, 'chatgpt', 'src', 'styles', 'license-lock.css');

// 나머지 10개 사이트
const sites = [
  'gemini', 'genspark', 'claude', 'openclaw',
  'aI-agents', 'ai-media',
  'autowork', 'fine-tuning',
  'ai-data', 'ai-prompt'
];

const guardContent = fs.readFileSync(SRC_GUARD, 'utf-8');
const overlayContent = fs.readFileSync(SRC_OVERLAY, 'utf-8');
const cssContent = fs.readFileSync(SRC_CSS, 'utf-8');

for (const site of sites) {
  const siteDir = path.join(BASE, site);
  if (!fs.existsSync(siteDir)) {
    console.log(`SKIP: ${site} directory not found`);
    continue;
  }

  const compDir = path.join(siteDir, 'src', 'components');
  const styleDir = path.join(siteDir, 'src', 'styles');

  // src/components/ 디렉토리 확인
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }

  // src/styles/ 디렉토리 확인
  if (!fs.existsSync(styleDir)) {
    fs.mkdirSync(styleDir, { recursive: true });
  }

  // LicenseGuard.tsx 복사
  fs.writeFileSync(path.join(compDir, 'LicenseGuard.tsx'), guardContent, 'utf-8');

  // LockOverlay.tsx 복사
  fs.writeFileSync(path.join(compDir, 'LockOverlay.tsx'), overlayContent, 'utf-8');

  // license-lock.css 복사
  fs.writeFileSync(path.join(styleDir, 'license-lock.css'), cssContent, 'utf-8');

  console.log(`OK: ${site} — 3 files copied`);
}

console.log('\\nDone! Next: create site-specific license.ts for each site');

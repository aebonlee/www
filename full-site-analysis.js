/**
 * 55개 사이트 전체 분석 (jobpath 제외)
 * 사이트 URL 기반으로 폴더 매핑하여 tsc 분석
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE = 'D:\\dreamit-web';

// URL → folder mapping (55 sites, jobpath excluded = 54)
const SITES = [
  { url: 'coding.dreamitbiz.com', folder: 'coding' },
  { url: 'papers.dreamitbiz.com', folder: 'papers' },
  { url: 'uxdesign.dreamitbiz.com', folder: 'uxdesign' },
  { url: 'allthat.dreamitbiz.com', folder: 'allthat' },
  { url: 'self-branding.dreamitbiz.com', folder: 'self-branding' },
  { url: 'marketing.dreamitbiz.com', folder: 'marketing' },
  { url: 'edu-hub.dreamitbiz.com', folder: 'edu-hub' },
  { url: 'koreatech.dreamitbiz.com', folder: 'koreatech' },
  { url: 'java-study.dreamitbiz.com', folder: 'java-study' },
  { url: 'claude.dreamitbiz.com', folder: 'claude' },
  { url: 'fine-tuning.dreamitbiz.com', folder: 'fine-tuning' },
  { url: 'c-study.dreamitbiz.com', folder: 'c-study' },
  { url: 'python-study.dreamitbiz.com', folder: 'python-study' },
  { url: 'openclaw.dreamitbiz.com', folder: 'openclaw' },
  { url: 'ai-media.dreamitbiz.com', folder: 'ai-media' },
  { url: 'algorithm.dreamitbiz.com', folder: 'algorithm' },
  { url: 'reactstudy.dreamitbiz.com', folder: 'reactStudy' },
  { url: 'webstudy.dreamitbiz.com', folder: 'webstudy' },
  { url: 'books.dreamitbiz.com', folder: 'books' },
  { url: 'pbirobot.dreamitbiz.com', folder: 'pbirobot' },
  { url: 'linux-study.dreamitbiz.com', folder: 'linux-study' },
  { url: 'db-study.dreamitbiz.com', folder: 'db-study' },
  { url: 'koreait.dreamitbiz.com', folder: 'koreait' },
  { url: 'presentation.dreamitbiz.com', folder: 'presentation' },
  { url: 'planning.dreamitbiz.com', folder: 'planning' },
  { url: 'html.dreamitbiz.com', folder: 'html' },
  { url: 'ai-agents.dreamitbiz.com', folder: 'aI-agents' },
  // { url: 'jobpath.dreamitbiz.com', folder: 'jobpath' },  // EXCLUDED - under dev
  { url: 'digitalbiz.dreamitbiz.com', folder: 'digitalbiz' },
  { url: 'ahp-basic.dreamitbiz.com', folder: 'ahp_basic' },
  { url: 'ai-prompt.dreamitbiz.com', folder: 'ai-prompt' },
  { url: 'teaching.dreamitbiz.com', folder: 'teaching' },
  { url: 'competency.dreamitbiz.com', folder: 'competency' },
  { url: 'ai-data.dreamitbiz.com', folder: 'ai-data' },
  { url: 'software.dreamitbiz.com', folder: 'software' },
  { url: 'career.dreamitbiz.com', folder: 'career' },
  { url: 'www.dreamitbiz.com', folder: 'www' },
  { url: 'docs.dreamitbiz.com', folder: 'docs' },
  { url: 'reserve.dreamitbiz.com', folder: 'reserve' },
  { url: 'gemini.dreamitbiz.com', folder: 'gemini' },
  { url: 'japanese.dreamitbiz.com', folder: 'japanese' },
  { url: 'korean.dreamitbiz.com', folder: 'korean' },
  { url: 'hohai.dreamitbiz.com', folder: 'hohai' },
  { url: 'autowork.dreamitbiz.com', folder: 'autowork' },
  { url: 'jdy.dreamitbiz.com', folder: 'jdy' },
  { url: 'pbi.dreamitbiz.com', folder: 'pbi' },
  { url: 'sqld.dreamitbiz.com', folder: 'sqld' },
  { url: 'data-structure.dreamitbiz.com', folder: 'data-structure' },
  { url: 'chatgpt.dreamitbiz.com', folder: 'chatgpt' },
  { url: 'english.dreamitbiz.com', folder: 'english' },
  { url: 'genspark.dreamitbiz.com', folder: 'genspark' },
  { url: 'eip.dreamitbiz.com', folder: 'eip' },
  { url: 'aebon.dreamitbiz.com', folder: 'aebon' },
  { url: 'wonjunjang.dreamitbiz.com', folder: 'wonjunjang' },
];

console.log('Analyzing ' + SITES.length + ' sites (jobpath excluded)\n');

const results = [];
let tscTotal = 0;

for (const site of SITES) {
  const dir = path.join(BASE, site.folder);
  const exists = fs.existsSync(dir);
  const hasSrc = exists && fs.existsSync(path.join(dir, 'src'));
  const hasTsconfig = exists && fs.existsSync(path.join(dir, 'tsconfig.json'));
  const hasPkg = exists && fs.existsSync(path.join(dir, 'package.json'));
  const isStatic = exists && !hasPkg && fs.existsSync(path.join(dir, 'index.html'));

  let type = 'unknown';
  let tscErrors = '-';

  if (!exists) {
    type = 'NOT_FOUND';
  } else if (isStatic) {
    type = 'Static HTML';
  } else if (hasSrc && hasTsconfig) {
    type = 'React+TS';
    // Run tsc
    try {
      execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
      tscErrors = 0;
    } catch (e) {
      const lines = (e.stdout || '').split('\n').filter(l => l.includes('error TS'));
      tscErrors = lines.length;
      tscTotal += lines.length;
    }
  } else if (hasPkg && !hasSrc) {
    type = 'Node.js/Other';
  } else if (hasPkg && hasSrc && !hasTsconfig) {
    type = 'React (no tsconfig)';
  } else {
    type = 'Other';
  }

  results.push({ ...site, exists, type, tscErrors });
  process.stdout.write('.');
}

console.log('\n');

// Summary
const reactTs = results.filter(r => r.type === 'React+TS');
const zeroErr = reactTs.filter(r => r.tscErrors === 0);
const withErr = reactTs.filter(r => r.tscErrors > 0);
const staticSites = results.filter(r => r.type === 'Static HTML');
const otherSites = results.filter(r => r.type !== 'React+TS' && r.type !== 'Static HTML');

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║    전체 사이트 분석 결과 (55개 중 jobpath 제외 54개)  ║');
console.log('╠══════════════════════════════════════════════════════╣');
console.log('║  React+TS 프로젝트: ' + reactTs.length.toString().padStart(3) + '  (tsc 분석 대상)           ║');
console.log('║    - 에러 0개:      ' + zeroErr.length.toString().padStart(3) + '                            ║');
console.log('║    - 에러 있음:     ' + withErr.length.toString().padStart(3) + '  (총 ' + tscTotal.toString().padStart(4) + '개 에러)          ║');
console.log('║  Static HTML:       ' + staticSites.length.toString().padStart(3) + '  (tsc 대상 아님)           ║');
console.log('║  기타:              ' + otherSites.length.toString().padStart(3) + '                            ║');
console.log('╚══════════════════════════════════════════════════════╝');

// Table
console.log('\n── 프로젝트별 상세 ──');
console.log('No.  URL'.padEnd(42) + 'Folder'.padEnd(18) + 'Type'.padEnd(16) + 'TSC Errors');
console.log('─'.repeat(90));
results.forEach((r, i) => {
  const num = (i + 1).toString().padStart(2);
  const status = r.tscErrors === 0 ? '0 ✓' : (r.tscErrors === '-' ? '-' : r.tscErrors.toString());
  console.log(num + '.  ' + r.url.padEnd(38) + r.folder.padEnd(18) + r.type.padEnd(16) + status);
});

// Errors detail
if (withErr.length > 0) {
  console.log('\n── 에러 있는 프로젝트 상세 ──');
  for (const r of withErr) {
    console.log('\n' + r.folder + ' (' + r.tscErrors + ' errors): https://' + r.url);
  }
}

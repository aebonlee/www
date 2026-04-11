const fs = require('fs');
const data = JSON.parse(fs.readFileSync('D:/dreamit-web/www/site-evaluation.json', 'utf8'));

// Filter: React web projects with CNAME only (deployed sites)
// Exclude: jobpath (in development), non-React, backups, duplicates, CLI tools
const EXCLUDE = [
  'jobpath',        // 개발 중 제외
  'node_modules',   // not a project
  'www_backup',     // backup
  'planning-extract', // extract/backup
  'database_test',  // test DB
  'jdy',            // no React
  'vibe-ready-cli', // CLI tool, not website
  'claude-code-2',  // forked repo
  'ahp',            // duplicate of ahp_basic/ahp_app
  'ahp_app',        // duplicate
];

const sites = data.filter(p => {
  if (EXCLUDE.includes(p.name)) return false;
  if (p.error) return false;
  if (!p.framework || !p.framework.some(f => f.startsWith('React'))) return false;
  if (!p.hasCNAME) return false;
  return true;
});

console.log(`Scoring ${sites.length} active deployed sites\n`);

function score(p) {
  const s = {};

  // 1. TypeScript 완성도 (25점)
  let ts = 0;
  if (p.hasTypeScript && p.hasTsconfig) ts += 5;        // TS 설치 + 설정
  if (p.tscErrors === 0) ts += 10;                       // TSC 0 errors
  const ratio = parseInt(p.tsRatio || '0');
  ts += Math.round(ratio / 100 * 10);                    // TS 비율 (0~10)
  s.typescript = ts;

  // 2. 코드 규모 & 구조 (20점)
  let code = 0;
  const total = p.totalSrc || 0;
  if (total >= 100) code += 8;
  else if (total >= 60) code += 6;
  else if (total >= 30) code += 4;
  else code += 2;

  const pages = p.pageCount || 0;
  if (pages >= 30) code += 6;
  else if (pages >= 10) code += 5;
  else if (pages >= 5) code += 3;
  else if (pages >= 1) code += 2;
  else code += 0;

  const comps = p.componentCount || 0;
  if (comps >= 20) code += 6;
  else if (comps >= 10) code += 5;
  else if (comps >= 5) code += 3;
  else if (comps >= 1) code += 2;
  else code += 0;
  s.codeStructure = Math.min(code, 20);

  // 3. 기술 스택 (20점)
  let tech = 0;
  if (p.framework.some(f => f.startsWith('React'))) tech += 5;
  if (p.framework.some(f => f.startsWith('Vite'))) tech += 5;
  if (p.hasRouter) tech += 3;
  if (p.hasSupabase) tech += 4;
  if (p.hasI18n) tech += 3;
  s.techStack = Math.min(tech, 20);

  // 4. 배포 & 인프라 (20점)
  let deploy = 0;
  if (p.hasCNAME) deploy += 8;
  if (p.hasDist) deploy += 6;
  if (p.hasEnv) deploy += 3;
  if (p.lastCommit && p.lastCommit !== 'N/A') deploy += 3;
  s.deployment = Math.min(deploy, 20);

  // 5. SEO & 품질 (15점)
  let quality = 0;
  if (p.hasSEO) quality += 8;
  const cssCount = p.cssCount || 0;
  if (cssCount >= 15) quality += 4;
  else if (cssCount >= 5) quality += 3;
  else if (cssCount >= 1) quality += 2;
  if (p.hasTailwind) quality += 3;
  s.seoQuality = Math.min(quality, 15);

  s.total = s.typescript + s.codeStructure + s.techStack + s.deployment + s.seoQuality;
  return s;
}

// Calculate scores
const scored = sites.map(p => {
  const s = score(p);
  return { ...p, finalScores: s };
}).sort((a, b) => b.finalScores.total - a.finalScores.total);

// Grade
function grade(total) {
  if (total >= 90) return 'S';
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  return 'F';
}

// Output
console.log('순위 | 프로젝트 | 도메인 | TS | 코드 | 기술 | 배포 | SEO | 총점 | 등급');
console.log('---|---|---|---|---|---|---|---|---|---');
scored.forEach((p, i) => {
  const s = p.finalScores;
  const g = grade(s.total);
  console.log(`${i+1} | ${p.name} | ${p.domain || ''} | ${s.typescript}/25 | ${s.codeStructure}/20 | ${s.techStack}/20 | ${s.deployment}/20 | ${s.seoQuality}/15 | **${s.total}/100** | ${g}`);
});

// Stats
const totals = scored.map(p => p.finalScores.total);
const avg = (totals.reduce((a,b) => a+b, 0) / totals.length).toFixed(1);
const gradeCount = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
totals.forEach(t => gradeCount[grade(t)]++);

console.log(`\n평균: ${avg}/100`);
console.log(`등급 분포: S(${gradeCount.S}) A(${gradeCount.A}) B(${gradeCount.B}) C(${gradeCount.C}) D(${gradeCount.D}) F(${gradeCount.F})`);

// Save
fs.writeFileSync('D:/dreamit-web/www/site-scores.json', JSON.stringify(scored.map(p => ({
  name: p.name,
  domain: p.domain,
  tsRatio: p.tsRatio,
  tscErrors: p.tscErrors,
  totalSrc: p.totalSrc,
  pageCount: p.pageCount,
  componentCount: p.componentCount,
  scores: p.finalScores,
  grade: grade(p.finalScores.total)
})), null, 2));

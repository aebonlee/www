const fs = require('fs');
const path = require('path');

const sqldSrc = 'D:/dreamit-web/sqld/src';
let totalFixes = 0;

function fix(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixes = 0;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      fixes++;
    }
  }
  if (fixes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed ${fixes} in ${path.relative(sqldSrc, filePath)}`);
    totalFixes += fixes;
  }
  return fixes;
}

function fixAll(filePath, from, to) {
  let content = fs.readFileSync(filePath, 'utf8');
  const count = (content.match(new RegExp(escapeRegExp(from), 'g')) || []).length;
  if (count > 0) {
    content = content.split(from).join(to);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed ${count}x "${from.slice(0,40)}" in ${path.relative(sqldSrc, filePath)}`);
    totalFixes += count;
  }
  return count;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ========================
// 1. createContext() -> createContext<any>(null)
// ========================
console.log('\n=== 1. Fix createContext ===');

fix(path.join(sqldSrc, 'contexts/ThemeContext.tsx'), [
  ['const ThemeContext = createContext();', 'const ThemeContext = createContext<any>(null);'],
]);

fix(path.join(sqldSrc, 'contexts/AuthContext.tsx'), [
  ['const AuthContext = createContext();', 'const AuthContext = createContext<any>(null);'],
]);

fix(path.join(sqldSrc, 'contexts/LanguageContext.tsx'), [
  ['const LanguageContext = createContext();', 'const LanguageContext = createContext<any>(null);'],
]);

fix(path.join(sqldSrc, 'contexts/ProgressContext.tsx'), [
  ['const ProgressContext = createContext();', 'const ProgressContext = createContext<any>(null);'],
]);

// ========================
// 2. Provider/Component props -> add : any
// ========================
console.log('\n=== 2. Fix component props ===');

fix(path.join(sqldSrc, 'contexts/ThemeContext.tsx'), [
  ['export const ThemeProvider = ({ children })', 'export const ThemeProvider = ({ children }: any)'],
]);

fix(path.join(sqldSrc, 'contexts/LanguageContext.tsx'), [
  ['export const LanguageProvider = ({ children })', 'export const LanguageProvider = ({ children }: any)'],
  ['const t = (key)', 'const t = (key: any)'],
]);

fix(path.join(sqldSrc, 'contexts/AuthContext.tsx'), [
  ['export function AuthProvider({ children })', 'export function AuthProvider({ children }: any)'],
]);

fix(path.join(sqldSrc, 'contexts/ProgressContext.tsx'), [
  ['export function ProgressProvider({ children })', 'export function ProgressProvider({ children }: any)'],
]);

// ========================
// 3. SqlBlock props -> make optional with : any
// ========================
console.log('\n=== 3. Fix SqlBlock props ===');

fix(path.join(sqldSrc, 'components/SqlBlock.tsx'), [
  ['export default function SqlBlock({ title, sql, columns, rows, description })',
   'export default function SqlBlock({ title, sql, columns, rows, description }: any)'],
]);

// ========================
// 4. SqlPlayground props + error.message
// ========================
console.log('\n=== 4. Fix SqlPlayground ===');

fix(path.join(sqldSrc, 'components/SqlPlayground.tsx'), [
  ['export default function SqlPlayground({ datasets })',
   'export default function SqlPlayground({ datasets }: any)'],
  ["if (!cancelled) setError('sql.js 초기화 실패: ' + e.message);",
   "if (!cancelled) setError('sql.js 초기화 실패: ' + (e as any).message);"],
  ["setError('DB 초기화 실패: ' + e.message);",
   "setError('DB 초기화 실패: ' + (e as any).message);"],
  ["setError(e.message);",
   "setError((e as any).message);"],
]);

// ========================
// 5. SEOHead props
// ========================
console.log('\n=== 5. Fix SEOHead ===');

fix(path.join(sqldSrc, 'components/SEOHead.tsx'), [
  ['const SEOHead = ({ title, description })',
   'const SEOHead = ({ title, description }: any)'],
]);

// ========================
// 6. Other component props
// ========================
console.log('\n=== 6. Fix other component props ===');

const componentPropsMap = {
  'components/BadgeCard.tsx': ['function BadgeCard(', ': any) {'],
  'components/Certificate.tsx': ['function Certificate(', ': any) {'],
  'components/LessonComplete.tsx': ['function LessonComplete(', ': any) {'],
  'components/StampGrid.tsx': ['function StampGrid(', ': any) {'],
  'components/SampleDataPanel.tsx': ['function SampleDataPanel(', ': any) {'],
  'layouts/PublicLayout.tsx': ['function PublicLayout(', ': any) {'],
  'components/layout/Navbar.tsx': ['function Navbar(', ': any) {'],
  'components/layout/Footer.tsx': ['function Footer(', ': any) {'],
};

// Let's check each file and add : any to the destructured props
for (const [relPath, _] of Object.entries(componentPropsMap)) {
  const filePath = path.join(sqldSrc, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${relPath}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Pattern: function ComponentName({ ... }) {
  // or: export default function ComponentName({ ... }) {
  // or: const ComponentName = ({ ... }) => {
  const funcPattern = /((?:export\s+(?:default\s+)?)?(?:function|const)\s+\w+\s*(?:=\s*)?\(\s*\{[^}]+\})\s*\)/;
  const match = content.match(funcPattern);
  if (match) {
    const original = match[0];
    if (!original.includes(': any)')) {
      const fixed = original.replace(/\}\s*\)$/, '}: any)');
      content = content.replace(original, fixed);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Fixed props in ${relPath}`);
      totalFixes++;
    }
  } else {
    console.log(`  No match in ${relPath}`);
  }
}

// ========================
// 7. ErrorBoundary in main.tsx
// ========================
console.log('\n=== 7. Fix ErrorBoundary ===');

fix(path.join(sqldSrc, 'main.tsx'), [
  ['class ErrorBoundary extends Component {',
   'class ErrorBoundary extends Component<any, any> {'],
]);

// ========================
// 8. rowSpan="N" -> rowSpan={N} in Subject1Ch1, Subject1Ch2
// ========================
console.log('\n=== 8. Fix rowSpan string -> number ===');

for (const file of ['pages/Subject1Ch1.tsx', 'pages/Subject1Ch2.tsx']) {
  const filePath = path.join(sqldSrc, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /rowSpan="(\d+)"/g;
  const count = (content.match(regex) || []).length;
  if (count > 0) {
    content = content.replace(regex, 'rowSpan={$1}');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed ${count}x rowSpan in ${file}`);
    totalFixes += count;
  }
}

// ========================
// 9. Profile.tsx Object.values typing
// ========================
console.log('\n=== 9. Fix Profile.tsx ===');

fix(path.join(sqldSrc, 'pages/Profile.tsx'), [
  ['const hasPassedExam = Object.values(examResults).some(r => r.score / r.total >= 0.6);',
   'const hasPassedExam = Object.values(examResults).some((r: any) => r.score / r.total >= 0.6);'],
  ['? Math.max(...Object.values(examResults).map(r => Math.round(r.score / r.total * 100)))',
   '? Math.max(...Object.values(examResults).map((r: any) => Math.round(r.score / r.total * 100)))'],
]);

// ========================
// 10. Fix any remaining pages that use useXxx hooks destructuring
// ========================
console.log('\n=== 10. Scan and fix remaining pages ===');

function getAllTsx(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...getAllTsx(fullPath));
    else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) results.push(fullPath);
  }
  return results;
}

// Check all ExamRound files for SEOHead description prop
for (const file of getAllTsx(sqldSrc)) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix colSpan="N" too
  const colSpanRegex = /colSpan="(\d+)"/g;
  if (colSpanRegex.test(content)) {
    content = content.replace(colSpanRegex, 'colSpan={$1}');
    changed = true;
    console.log(`  Fixed colSpan in ${path.relative(sqldSrc, file)}`);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixes++;
  }
}

console.log(`\nTotal fixes: ${totalFixes}`);

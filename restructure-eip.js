const fs = require('fs');
const path = require('path');

const eipRoot = 'D:/dreamit-web/eip/src';

// Define page moves: from components/ to pages/
const moves = [
  // home
  { from: 'components/home/HomePage.tsx', to: 'pages/HomePage.tsx' },
  // auth
  { from: 'components/auth/LoginPage.tsx', to: 'pages/auth/LoginPage.tsx' },
  { from: 'components/auth/AuthCallback.tsx', to: 'pages/auth/AuthCallback.tsx' },
  // written-exam
  { from: 'components/written-exam/WrittenExamHome.tsx', to: 'pages/written-exam/WrittenExamHome.tsx' },
  { from: 'components/written-exam/SubjectList.tsx', to: 'pages/written-exam/SubjectList.tsx' },
  { from: 'components/written-exam/ChapterStudy.tsx', to: 'pages/written-exam/ChapterStudy.tsx' },
  { from: 'components/written-exam/RoundSelect.tsx', to: 'pages/written-exam/RoundSelect.tsx' },
  { from: 'components/written-exam/MockTest.tsx', to: 'pages/written-exam/MockTest.tsx' },
  { from: 'components/written-exam/TestResult.tsx', to: 'pages/written-exam/TestResult.tsx' },
  // practical-exam
  { from: 'components/practical-exam/PracticalExamHome.tsx', to: 'pages/practical-exam/PracticalExamHome.tsx' },
  { from: 'components/practical-exam/PracticalRoundSelect.tsx', to: 'pages/practical-exam/PracticalRoundSelect.tsx' },
  { from: 'components/practical-exam/PracticalMockTest.tsx', to: 'pages/practical-exam/PracticalMockTest.tsx' },
  { from: 'components/practical-exam/PracticalTestResult.tsx', to: 'pages/practical-exam/PracticalTestResult.tsx' },
  { from: 'components/practical-exam/SQLPractice.tsx', to: 'pages/practical-exam/SQLPractice.tsx' },
  { from: 'components/practical-exam/AlgorithmPractice.tsx', to: 'pages/practical-exam/AlgorithmPractice.tsx' },
  { from: 'components/practical-exam/ShortAnswer.tsx', to: 'pages/practical-exam/ShortAnswer.tsx' },
  // coding-lab
  { from: 'components/coding-lab/CodingLabHome.tsx', to: 'pages/coding-lab/CodingLabHome.tsx' },
  { from: 'components/coding-lab/CodingExercise.tsx', to: 'pages/coding-lab/CodingExercise.tsx' },
  // coding-lab CodeEditor stays in components (reusable component, not a page)
  // lectures
  { from: 'components/lectures/LecturesHome.tsx', to: 'pages/lectures/LecturesHome.tsx' },
  { from: 'components/lectures/LecturePlayer.tsx', to: 'pages/lectures/LecturePlayer.tsx' },
  // mypage
  { from: 'components/mypage/MyPage.tsx', to: 'pages/mypage/MyPage.tsx' },
  { from: 'components/mypage/PassPrediction.tsx', to: 'pages/mypage/PassPrediction.tsx' },
  // cert
  { from: 'components/cert/CertIntroPage.tsx', to: 'pages/cert/CertIntroPage.tsx' },
  // community
  { from: 'components/community/CommunityPage.tsx', to: 'pages/community/CommunityPage.tsx' },
];

// 1. Create target directories
const dirs = new Set();
for (const m of moves) {
  dirs.add(path.dirname(path.join(eipRoot, m.to)));
}
for (const d of dirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log(`  mkdir: ${path.relative(eipRoot, d)}`);
  }
}

// 2. Move files and update internal imports
for (const m of moves) {
  const fromPath = path.join(eipRoot, m.from);
  const toPath = path.join(eipRoot, m.to);

  if (!fs.existsSync(fromPath)) {
    console.log(`  SKIP (not found): ${m.from}`);
    continue;
  }

  let content = fs.readFileSync(fromPath, 'utf8');

  // Calculate relative path changes for imports within the moved file
  const fromDir = path.dirname(m.from); // e.g. components/home
  const toDir = path.dirname(m.to);     // e.g. pages

  // Fix relative imports in the moved file
  // Common patterns:
  // '../contexts/' -> needs recalculation
  // '../data/' -> needs recalculation
  // '../lib/' -> needs recalculation
  // '../styles/' -> needs recalculation
  // './SomeComponent' -> if same folder moves, stays same
  // '../../' patterns

  // Check if file uses @/ aliases (if so, no path changes needed)
  if (content.includes("from '@/")) {
    // Already uses aliases, no relative path fixing needed
    console.log(`  ${m.from} → ${m.to} (alias imports, no path fix needed)`);
  } else {
    // Fix relative imports
    const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
    let match;
    const fixes = [];

    while ((match = importRegex.exec(content)) !== null) {
      const origImport = match[1];
      // Resolve to absolute src-relative path
      const resolvedAbs = path.posix.normalize(path.posix.join(fromDir, origImport));
      // Calculate new relative path from target location
      let newRelative = path.posix.relative(toDir, resolvedAbs);
      if (!newRelative.startsWith('.')) {
        newRelative = './' + newRelative;
      }
      if (origImport !== newRelative) {
        fixes.push({ orig: origImport, fixed: newRelative });
      }
    }

    for (const fix of fixes) {
      content = content.split(`'${fix.orig}'`).join(`'${fix.fixed}'`);
      content = content.split(`"${fix.orig}"`).join(`"${fix.fixed}"`);
    }

    if (fixes.length > 0) {
      console.log(`  ${m.from} → ${m.to} (${fixes.length} import paths fixed)`);
    } else {
      console.log(`  ${m.from} → ${m.to}`);
    }
  }

  fs.writeFileSync(toPath, content, 'utf8');
  fs.unlinkSync(fromPath);
}

// 3. Clean up empty directories in components/
const compDirs = ['home', 'auth', 'written-exam', 'practical-exam', 'coding-lab', 'lectures', 'mypage', 'cert', 'community'];
for (const d of compDirs) {
  const dirPath = path.join(eipRoot, 'components', d);
  if (fs.existsSync(dirPath)) {
    const remaining = fs.readdirSync(dirPath);
    if (remaining.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`  Removed empty: components/${d}/`);
    } else {
      console.log(`  Kept components/${d}/ (has ${remaining.length} remaining files: ${remaining.join(', ')})`);
    }
  }
}

// 4. Update App.tsx imports
const appPath = path.join(eipRoot, 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

const importFixes = [
  // home
  ["'./components/home/HomePage'", "'./pages/HomePage'"],
  // auth
  ["'./components/auth/LoginPage'", "'./pages/auth/LoginPage'"],
  ["'./components/auth/AuthCallback'", "'./pages/auth/AuthCallback'"],
  // written-exam
  ["'./components/written-exam/WrittenExamHome'", "'./pages/written-exam/WrittenExamHome'"],
  ["'./components/written-exam/SubjectList'", "'./pages/written-exam/SubjectList'"],
  ["'./components/written-exam/ChapterStudy'", "'./pages/written-exam/ChapterStudy'"],
  ["'./components/written-exam/RoundSelect'", "'./pages/written-exam/RoundSelect'"],
  ["'./components/written-exam/MockTest'", "'./pages/written-exam/MockTest'"],
  ["'./components/written-exam/TestResult'", "'./pages/written-exam/TestResult'"],
  // practical-exam
  ["'./components/practical-exam/PracticalExamHome'", "'./pages/practical-exam/PracticalExamHome'"],
  ["'./components/practical-exam/PracticalRoundSelect'", "'./pages/practical-exam/PracticalRoundSelect'"],
  ["'./components/practical-exam/PracticalMockTest'", "'./pages/practical-exam/PracticalMockTest'"],
  ["'./components/practical-exam/PracticalTestResult'", "'./pages/practical-exam/PracticalTestResult'"],
  ["'./components/practical-exam/SQLPractice'", "'./pages/practical-exam/SQLPractice'"],
  ["'./components/practical-exam/AlgorithmPractice'", "'./pages/practical-exam/AlgorithmPractice'"],
  ["'./components/practical-exam/ShortAnswer'", "'./pages/practical-exam/ShortAnswer'"],
  // coding-lab
  ["'./components/coding-lab/CodingLabHome'", "'./pages/coding-lab/CodingLabHome'"],
  ["'./components/coding-lab/CodingExercise'", "'./pages/coding-lab/CodingExercise'"],
  // lectures
  ["'./components/lectures/LecturesHome'", "'./pages/lectures/LecturesHome'"],
  ["'./components/lectures/LecturePlayer'", "'./pages/lectures/LecturePlayer'"],
  // mypage
  ["'./components/mypage/MyPage'", "'./pages/mypage/MyPage'"],
  // cert
  ["'./components/cert/CertIntroPage'", "'./pages/cert/CertIntroPage'"],
  // community
  ["'./components/community/CommunityPage'", "'./pages/community/CommunityPage'"],
];

let fixCount = 0;
for (const [from, to] of importFixes) {
  if (appContent.includes(from)) {
    appContent = appContent.replace(from, to);
    fixCount++;
  }
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log(`\n  App.tsx: ${fixCount} import paths updated`);

console.log('\nDone! Pages moved to src/pages/');

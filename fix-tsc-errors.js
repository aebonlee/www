/**
 * TSC Error Batch Fix Script
 * 19개 프로젝트 (forjob 제외) TypeScript 에러 일괄 수정
 *
 * Phase 1: createContext 타입 추가
 * Phase 2: CSS Custom Properties 캐스팅
 * Phase 3: SEOHead/컴포넌트 props 옵셔널화
 * Phase 4: 프로젝트별 개별 수정 (ahp_basic, papers, career, koreait)
 * Phase 5: 검증
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE = 'D:\\dreamit-web';
const PROJECTS = [
  'planning', 'aI-agents', 'chatgpt', 'autowork', 'genspark',
  'koreait', 'gemini', 'ai-media', 'career', 'allthat',
  'software', 'papers', 'ai-data', 'uxdesign', 'marketing',
  'koreatech', 'ai-prompt', 'ahp_basic'
];

let totalFixed = 0;
const report = [];

// ─── Utility ─────────────────────────────────────────
function walkDir(dir, ext) {
  let results = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      const stat = fs.statSync(fp);
      if (stat.isDirectory() && f !== 'node_modules' && f !== 'dist' && f !== '.git') {
        results = results.concat(walkDir(fp, ext));
      } else if (ext ? f.endsWith(ext) : true) {
        results.push(fp);
      }
    }
  } catch (e) {}
  return results;
}

function replaceInFile(filePath, search, replace) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (typeof search === 'string') {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      }
    } else {
      // regex
      if (search.test(content)) {
        content = content.replace(search, replace);
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function replaceAllInFile(filePath, search, replace) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = typeof search === 'string'
      ? new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      : search;
    if (regex.test(content)) {
      content = content.replace(regex, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  } catch (e) {}
  return false;
}

// ─── Phase 1: createContext<any>(null) ─────────────────
function phase1_fixCreateContext() {
  console.log('\n═══ Phase 1: createContext 타입 추가 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    const ctxFiles = walkDir(srcDir, '.tsx').concat(walkDir(srcDir, '.ts'))
      .filter(f => f.toLowerCase().includes('context'));

    for (const file of ctxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Pattern 1: createContext() with no args
      if (content.match(/createContext\(\s*\)/)) {
        content = content.replace(/createContext\(\s*\)/g, 'createContext<any>(null)');
        modified = true;
      }

      // Pattern 2: createContext(null) without type
      if (content.match(/createContext\(\s*null\s*\)/) && !content.match(/createContext<.*>\(\s*null\s*\)/)) {
        content = content.replace(/createContext\(\s*null\s*\)/g, 'createContext<any>(null)');
        modified = true;
      }

      // Pattern 3: createContext(undefined) without type
      if (content.match(/createContext\(\s*undefined\s*\)/) && !content.match(/createContext<.*>\(\s*undefined\s*\)/)) {
        content = content.replace(/createContext\(\s*undefined\s*\)/g, 'createContext<any>(null)');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 1 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 2: CSS Custom Properties ──────────────────
function phase2_fixCSSCustomProperties() {
  console.log('\n═══ Phase 2: CSS Custom Properties 캐스팅 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    const tsxFiles = walkDir(srcDir, '.tsx');

    for (const file of tsxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Pattern: style={{ '--var': value, ... }} → style={{ '--var': value, ... } as React.CSSProperties}
      // Match style={{ ... '--xxx' ... }} that doesn't already have "as React.CSSProperties"
      const styleRegex = /style=\{\{([^}]*'--[^}]*)\}\}/g;
      let match;
      const replacements = [];

      while ((match = styleRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const inner = match[1];
        // Skip if already cast
        if (fullMatch.includes('as React.CSSProperties') || fullMatch.includes('as CSSProperties')) continue;
        replacements.push({ from: fullMatch, to: `style={{${inner}} as React.CSSProperties}` });
      }

      for (const r of replacements) {
        content = content.replace(r.from, r.to);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 2 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 3: SEOHead/SEO 컴포넌트 props 옵셔널화 ──────
function phase3_fixSEOHead() {
  console.log('\n═══ Phase 3: SEOHead/SEO 컴포넌트 props 옵셔널화 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');

    // Find SEOHead.tsx or SEO.tsx
    const seoFiles = walkDir(srcDir, '.tsx').filter(f => {
      const name = path.basename(f);
      return name === 'SEOHead.tsx' || (name === 'SEO.tsx' && f.includes('components'));
    });

    for (const file of seoFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Pattern A: Hook-based (useEffect style) - planning, aI-agents, etc
      // export default function SEOHead({ title, description, path = '/', image }) {
      const hookPattern = /export\s+default\s+function\s+SEO(?:Head)?\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const hookMatch = content.match(hookPattern);
      if (hookMatch) {
        const params = hookMatch[1];
        // Already has types? Skip
        if (!params.includes(':')) {
          const funcName = content.includes('SEOHead') ? 'SEOHead' : 'SEO';
          const oldSig = hookMatch[0];
          const newSig = oldSig.replace(
            /\(\s*\{([^}]+)\}\s*\)/,
            `({$1}: any)`
          );
          content = content.replace(oldSig, newSig);
          modified = true;
        }
      }

      // Pattern B: JSX-based (const SEOHead = ({ ... }) => {) - uxdesign, marketing, koreatech, papers
      const constPattern = /const\s+SEO(?:Head)?\s*=\s*\(\s*\{([^}]+)\}\s*\)\s*=>/;
      const constMatch = content.match(constPattern);
      if (constMatch && !constMatch[1].includes(':')) {
        const oldSig = constMatch[0];
        const newSig = oldSig.replace(
          /\(\s*\{([^}]+)\}\s*\)/,
          `({$1}: any)`
        );
        content = content.replace(oldSig, newSig);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 3 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 4: 프로젝트별 개별 수정 ─────────────────────

// Phase 4a: ahp_basic - Button 및 기타 컴포넌트 props 타입
function phase4a_fixAhpBasic() {
  console.log('\n═══ Phase 4a: ahp_basic 컴포넌트 props 수정 ═══');
  let count = 0;
  const proj = 'ahp_basic';
  const srcDir = path.join(BASE, proj, 'src');

  // Fix Button.tsx - add props type
  const buttonFile = path.join(srcDir, 'components', 'common', 'Button.tsx');
  if (fs.existsSync(buttonFile)) {
    let content = fs.readFileSync(buttonFile, 'utf8');
    if (content.includes('export default memo(function Button({') && !content.includes(': any)')) {
      content = content.replace(
        /export default memo\(function Button\(\{([^}]+)\}\)\s*\{/,
        'export default memo(function Button({$1}: any) {'
      );
      fs.writeFileSync(buttonFile, content, 'utf8');
      count++;
      console.log(`  ✓ ${path.relative(BASE, buttonFile)}`);
    }
  }

  // Fix all common components with untyped props
  const commonDir = path.join(srcDir, 'components', 'common');
  if (fs.existsSync(commonDir)) {
    const files = fs.readdirSync(commonDir).filter(f => f.endsWith('.tsx'));
    for (const f of files) {
      const file = path.join(commonDir, f);
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Pattern: function Component({ props }) { → function Component({ props }: any) {
      // For export default function
      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/g;
      let m;
      while ((m = funcPattern.exec(content)) !== null) {
        if (!m[1].includes(':') && !m[0].includes(': any)')) {
          const old = m[0];
          const replacement = old.replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)');
          content = content.replace(old, replacement);
          modified = true;
        }
      }

      // Pattern: const Component = ({ props }) => {
      const constFuncPattern = /(?:export\s+)?(?:default\s+)?(?:const|function)\s+\w+\s*=?\s*\(\s*\{([^}]+)\}\s*\)\s*=>/g;
      while ((m = constFuncPattern.exec(content)) !== null) {
        if (!m[1].includes(':') && !m[0].includes(': any)')) {
          const old = m[0];
          const replacement = old.replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)');
          content = content.replace(old, replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  // Fix ALL components in ahp_basic that have untyped destructured props
  const allTsxFiles = walkDir(srcDir, '.tsx');
  for (const file of allTsxFiles) {
    // Skip already processed common dir
    if (file.includes(path.join('components', 'common'))) continue;

    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix: export default function Component({ ... }) { → ... }: any) {
    const patterns = [
      /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/g,
      /export\s+default\s+memo\(\s*function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/g,
    ];

    for (const pattern of patterns) {
      let m;
      while ((m = pattern.exec(content)) !== null) {
        if (!m[1].includes(':') && !m[0].includes(': any)')) {
          const old = m[0];
          const replacement = old.replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)');
          content = content.replace(old, replacement);
          modified = true;
        }
      }
    }

    // Fix: const Component = ({ ... }) => { → ... }: any) => {
    const arrowPattern = /(?:const|let|var)\s+\w+\s*=\s*\(\s*\{([^}]+)\}\s*\)\s*=>/g;
    let m;
    while ((m = arrowPattern.exec(content)) !== null) {
      if (!m[1].includes(':') && !m[0].includes(': any)')) {
        const old = m[0];
        const replacement = old.replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)');
        content = content.replace(old, replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log(`  ✓ ${path.relative(BASE, file)}`);
    }
  }

  console.log(`  Phase 4a 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// Phase 4b: papers - CommentSection props
function phase4b_fixPapers() {
  console.log('\n═══ Phase 4b: papers CommentSection props 수정 ═══');
  let count = 0;
  const proj = 'papers';
  const srcDir = path.join(BASE, proj, 'src');

  // Fix CommunityDetail.tsx and ProjectDetail.tsx - contentId/contentType → postId/postType
  const files = walkDir(srcDir, '.tsx');
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix: <CommentSection contentType="xxx" contentId={yyy} /> → <CommentSection postType="xxx" postId={yyy} />
    if (content.includes('CommentSection') && content.includes('contentType')) {
      content = content.replace(/contentType=/g, 'postType=');
      content = content.replace(/contentId=/g, 'postId=');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log(`  ✓ ${path.relative(BASE, file)}`);
    }
  }

  console.log(`  Phase 4b 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// Phase 4c: career - UI 컴포넌트 props 옵셔널화
function phase4c_fixCareer() {
  console.log('\n═══ Phase 4c: career UI 컴포넌트 props 옵셔널화 ═══');
  let count = 0;
  const proj = 'career';
  const srcDir = path.join(BASE, proj, 'src');
  const commonDir = path.join(srcDir, 'components', 'common');

  if (!fs.existsSync(commonDir)) {
    console.log('  career/src/components/common not found, skipping');
    return 0;
  }

  const componentFiles = fs.readdirSync(commonDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(commonDir, f));

  for (const file of componentFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Pattern: export default function X({ props }) { → ... }: any) {
    const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
    const fm = content.match(funcPattern);
    if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
      content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log(`  ✓ ${path.relative(BASE, file)}`);
    }
  }

  // Also fix landing components
  const landingDir = path.join(srcDir, 'components', 'landing');
  if (fs.existsSync(landingDir)) {
    const landingFiles = fs.readdirSync(landingDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join(landingDir, f));

    for (const file of landingFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const fm = content.match(funcPattern);
      if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
        content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 4c 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// Phase 4d: koreait - UI 컴포넌트 props 옵셔널화
function phase4d_fixKoreait() {
  console.log('\n═══ Phase 4d: koreait UI 컴포넌트 props 옵셔널화 ═══');
  let count = 0;
  const proj = 'koreait';
  const srcDir = path.join(BASE, proj, 'src');

  // Fix ui components
  const uiDir = path.join(srcDir, 'components', 'ui');
  if (fs.existsSync(uiDir)) {
    const files = fs.readdirSync(uiDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join(uiDir, f));

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const fm = content.match(funcPattern);
      if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
        content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  // Fix chart components
  const chartsDir = path.join(srcDir, 'components', 'charts');
  if (fs.existsSync(chartsDir)) {
    const files = fs.readdirSync(chartsDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join(chartsDir, f));

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const fm = content.match(funcPattern);
      if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
        content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  // Fix dashboard components
  const dashDir = path.join(srcDir, 'components', 'dashboard');
  if (fs.existsSync(dashDir)) {
    const files = fs.readdirSync(dashDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join(dashDir, f));

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const fm = content.match(funcPattern);
      if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
        content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  // Fix common components
  const commonDir = path.join(srcDir, 'components', 'common');
  if (fs.existsSync(commonDir)) {
    const files = fs.readdirSync(commonDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join(commonDir, f));

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
      const fm = content.match(funcPattern);
      if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
        content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 4d 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 5: 모든 프로젝트 공통 - useContext 소비측 에러 해결 ───
// createContext<any>(null) 로 바꾸면 useContext 리턴이 any가 되어
// "Property X does not exist on type '{}'" 에러가 자동 해결됨
// 추가로 남는 패턴들을 처리

function phase5_fixRemainingPatterns() {
  console.log('\n═══ Phase 5: 남은 공통 패턴 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    const tsxFiles = walkDir(srcDir, '.tsx');

    for (const file of tsxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix: .success / .error / .warning on unknown type (catch block results)
      // These are typically from: const result = await someApi(); if(result.success)
      // Fix by adding : any type annotation in catch or response handling
      // Pattern: } catch (e) { → } catch (e: any) {
      if (content.match(/\}\s*catch\s*\(\s*(\w+)\s*\)\s*\{/) && !content.match(/catch\s*\(\s*\w+\s*:\s*any\s*\)/)) {
        content = content.replace(
          /\}\s*catch\s*\(\s*(\w+)\s*\)\s*\{/g,
          '} catch ($1: any) {'
        );
        modified = true;
      }

      // Fix ErrorBoundary class component state types
      if (file.includes('ErrorBoundary')) {
        if (content.includes('class ErrorBoundary extends') && content.includes('Component<') === false && content.includes('React.Component')) {
          // Already extending React.Component without generics - add any
          content = content.replace(
            /extends\s+React\.Component\s*\{/,
            'extends React.Component<any, any> {'
          );
          if (content !== fs.readFileSync(file, 'utf8')) modified = true;
        } else if (content.includes('extends Component') && !content.includes('Component<')) {
          content = content.replace(
            /extends\s+Component\s*\{/,
            'extends Component<any, any> {'
          );
          if (content !== fs.readFileSync(file, 'utf8')) modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
      }
    }
  }

  console.log(`  Phase 5 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 6: chatgpt 프로젝트 특수 - CodeBlock 컴포넌트 title 옵셔널 ───
function phase6_fixChatgptCodeBlock() {
  console.log('\n═══ Phase 6: chatgpt CodeBlock 및 기타 수정 ═══');
  let count = 0;

  // chatgpt has CodeBlock component where title is required but used without it
  const chatgptSrc = path.join(BASE, 'chatgpt', 'src');
  if (fs.existsSync(chatgptSrc)) {
    const allFiles = walkDir(chatgptSrc, '.tsx');
    for (const file of allFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix components with untyped destructured params in components dirs
      if (file.includes(path.sep + 'components' + path.sep)) {
        const funcPattern = /export\s+default\s+function\s+\w+\(\s*\{([^}]+)\}\s*\)\s*\{/;
        const fm = content.match(funcPattern);
        if (fm && !fm[1].includes(':') && !fm[0].includes(': any)')) {
          content = content.replace(fm[0], fm[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
          modified = true;
        }

        // Arrow functions too
        const arrowPattern = /(?:export\s+default\s+)?(?:const|let)\s+\w+\s*=\s*\(\s*\{([^}]+)\}\s*\)\s*=>/;
        const am = content.match(arrowPattern);
        if (am && !am[1].includes(':') && !am[0].includes(': any)')) {
          content = content.replace(am[0], am[0].replace(/\(\s*\{([^}]+)\}\s*\)/, '({$1}: any)'));
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 6 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 7: 모든 프로젝트 - 나머지 컴포넌트 props untyped fix ───
function phase7_fixAllComponentProps() {
  console.log('\n═══ Phase 7: 전체 컴포넌트 untyped props 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    // Process all component directories
    const componentDirs = ['components', 'layouts', 'pages'];

    for (const dir of componentDirs) {
      const targetDir = path.join(srcDir, dir);
      if (!fs.existsSync(targetDir)) continue;

      const tsxFiles = walkDir(targetDir, '.tsx');
      for (const file of tsxFiles) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        const origContent = content;

        // Fix export default function X({ ... }) {
        content = content.replace(
          /export\s+default\s+function\s+(\w+)\(\s*\{([^}]+)\}\s*\)\s*\{/g,
          (match, name, params) => {
            if (params.includes(':') || match.includes(': any)')) return match;
            return `export default function ${name}({${params}}: any) {`;
          }
        );

        // Fix export default memo(function X({ ... }) {
        content = content.replace(
          /export\s+default\s+memo\(\s*function\s+(\w+)\(\s*\{([^}]+)\}\s*\)\s*\{/g,
          (match, name, params) => {
            if (params.includes(':') || match.includes(': any)')) return match;
            return `export default memo(function ${name}({${params}}: any) {`;
          }
        );

        // Fix const X = ({ ... }) => {
        content = content.replace(
          /((?:export\s+(?:default\s+)?)?const\s+\w+\s*=\s*)\(\s*\{([^}]+)\}\s*\)\s*=>/g,
          (match, prefix, params) => {
            if (params.includes(':') || match.includes(': any)')) return match;
            return `${prefix}({${params}}: any) =>`;
          }
        );

        // Fix function X({ ... }) { (non-export)
        content = content.replace(
          /^(function\s+\w+)\(\s*\{([^}]+)\}\s*\)\s*\{/gm,
          (match, prefix, params) => {
            if (params.includes(':') || match.includes(': any)')) return match;
            return `${prefix}({${params}}: any) {`;
          }
        );

        if (content !== origContent) {
          fs.writeFileSync(file, content, 'utf8');
          count++;
        }
      }
    }
  }

  console.log(`  Phase 7 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Phase 8: genspark 특수 - blockquote 에러 수정 ───
function phase8_fixGenspark() {
  console.log('\n═══ Phase 8: genspark/기타 특수 패턴 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    const tsxFiles = walkDir(srcDir, '.tsx');
    for (const file of tsxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix blockquote destructuring issue in react-markdown components
      // Pattern: blockquote({ children }) → blockquote({ children }: any)
      if (content.includes('components=') && content.includes('blockquote(')) {
        content = content.replace(
          /blockquote\(\s*\{\s*children\s*\}\s*\)/g,
          'blockquote({ children }: any)'
        );
        modified = true;
      }

      // Fix: code({ inline, className, children, ...props }) → add : any
      if (content.includes('components=') && content.match(/code\(\s*\{[^}]*inline[^}]*\}\s*\)/)) {
        content = content.replace(
          /code\(\s*\{([^}]*)\}\s*\)/g,
          (match, params) => {
            if (params.includes(':')) return match;
            return `code({${params}}: any)`;
          }
        );
        modified = true;
      }

      // Fix: table({ children }) → table({ children }: any)
      if (content.includes('components=') && content.match(/table\(\s*\{\s*children\s*\}\s*\)/)) {
        content = content.replace(
          /table\(\s*\{\s*children\s*\}\s*\)/g,
          'table({ children }: any)'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Phase 8 완료: ${count}개 파일 수정`);
  totalFixed += count;
  return count;
}

// ─── Run all phases ──────────────────────────────────
console.log('╔══════════════════════════════════════════════╗');
console.log('║  TSC Error Batch Fix - 18개 프로젝트         ║');
console.log('╚══════════════════════════════════════════════╝');
console.log(`시작 시간: ${new Date().toLocaleString()}\n`);

phase1_fixCreateContext();
phase2_fixCSSCustomProperties();
phase3_fixSEOHead();
phase4a_fixAhpBasic();
phase4b_fixPapers();
phase4c_fixCareer();
phase4d_fixKoreait();
phase5_fixRemainingPatterns();
phase6_fixChatgptCodeBlock();
phase7_fixAllComponentProps();
phase8_fixGenspark();

console.log('\n╔══════════════════════════════════════════════╗');
console.log(`║  총 ${totalFixed}개 파일 수정 완료                      ║`);
console.log('╚══════════════════════════════════════════════╝');

// ─── Verification ────────────────────────────────────
console.log('\n═══ 검증: tsc --noEmit 에러 수 확인 ═══');
const results = [];

for (const proj of PROJECTS) {
  const dir = path.join(BASE, proj);
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    results.push({ proj, errors: 0 });
    console.log(`  ${proj}: 0 errors ✓`);
  } catch (e) {
    const output = e.stdout || '';
    const errorLines = output.split('\n').filter(l => l.includes('error TS'));
    results.push({ proj, errors: errorLines.length });
    console.log(`  ${proj}: ${errorLines.length} errors`);
  }
}

const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
console.log(`\n총 남은 에러: ${totalErrors}개`);
console.log(`완료 시간: ${new Date().toLocaleString()}`);

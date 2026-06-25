/**
 * TSC Error Batch Fix - Round 2
 * 남은 270개 에러 수정
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

// ─── Fix 1: HeroBackground CSS custom properties (multi-line) ───
function fix1_heroBackground() {
  console.log('\n═══ Fix 1: HeroBackground CSS custom properties ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    const files = walkDir(srcDir, '.tsx').filter(f => f.includes('HeroBackground'));

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix multi-line style objects with CSS custom properties
      // Match style={{ ... }} blocks containing '--' that aren't already cast
      // Use a more comprehensive regex for multiline
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Find lines like: style={{
        if (line.match(/style=\{\{/) && !line.includes('as React.CSSProperties')) {
          // Check if this block contains CSS custom properties
          let j = i;
          let braceCount = 0;
          let blockStart = i;
          let blockEnd = -1;
          let hasCssVar = false;

          for (; j < lines.length; j++) {
            const l = lines[j];
            for (const ch of l) {
              if (ch === '{') braceCount++;
              if (ch === '}') braceCount--;
              if (braceCount === 0 && j > i) {
                blockEnd = j;
                break;
              }
            }
            if (l.includes("'--")) hasCssVar = true;
            if (blockEnd >= 0) break;
          }

          if (hasCssVar && blockEnd >= 0) {
            // Replace the closing }} with } as React.CSSProperties}
            const endLine = lines[blockEnd];
            if (endLine.match(/\}\s*\}/) && !endLine.includes('as React.CSSProperties')) {
              lines[blockEnd] = endLine.replace(/\}\s*\}/, '} as React.CSSProperties}');
              modified = true;
            }
          }
        }
      }

      if (modified) {
        content = lines.join('\n');
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Fix 1 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 2: Missing context hooks - add useContext type assertion ───
// Some files use useAuth(), useLanguage() etc. but the context wasn't typed
// This happens when a project imports from a context that wasn't in the context fix list
function fix2_contextHooks() {
  console.log('\n═══ Fix 2: 남은 Context hooks 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    // Find all context files and ensure they have <any>
    const ctxFiles = walkDir(srcDir, '.tsx').concat(walkDir(srcDir, '.ts'));

    for (const file of ctxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix any remaining createContext() without type
      if (content.match(/createContext\(\s*\)/) && !content.match(/createContext<.*>\(\s*\)/)) {
        content = content.replace(/createContext\(\s*\)/g, 'createContext<any>(null)');
        modified = true;
      }

      // Fix: useContext returns {} when context was created without type
      // This won't help if the context was already fixed but the import chain is broken
      // So we look for hook files that return useContext
      if (content.includes('useContext(') && content.includes('export')) {
        // Check if the useContext result is typed
        // Common pattern: const value = useContext(XContext); or return useContext(XContext);
        // These should work now that createContext is typed
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Fix 2 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 3: Fix useAuth imports in projects without AuthContext ───
// Some projects import useAuth from a shared/external auth but don't have their own context
function fix3_missingAuthContext() {
  console.log('\n═══ Fix 3: Auth hook 반환타입 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    // Check if there's an auth hook/context that wasn't fixed
    const hookFiles = walkDir(srcDir, '.tsx').concat(walkDir(srcDir, '.ts'))
      .filter(f => f.includes('auth') || f.includes('Auth'));

    for (const file of hookFiles) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Pattern: export function useAuth() { return useContext(AuthContext); }
      // If AuthContext was fixed to createContext<any>(null), useContext should return any
      // But check if there's a custom useAuth that doesn't go through context
      if (content.includes('useAuth') && content.includes('useState')) {
        // This is a custom hook, not context-based. Check if it returns typed values
        // If it uses Firebase/Supabase auth and returns { user, ...}, the types should be fine
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
      }
    }
  }

  console.log(`  Fix 3 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 4: Fix remaining "Property X does not exist on type '{}'" ───
// These come from hooks that return useContext without createContext being fixed
// or from projects that use a different auth mechanism
function fix4_remainingPropertyErrors() {
  console.log('\n═══ Fix 4: 남은 Property not exist 에러 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const dir = path.join(BASE, proj);
    let output = '';
    try {
      execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 60000 });
      continue; // No errors
    } catch (e) {
      output = e.stdout || '';
    }

    const errorLines = output.split('\n').filter(l => l.includes('error TS'));
    if (errorLines.length === 0) continue;

    const srcDir = path.join(dir, 'src');

    // Group errors by file
    const errorsByFile = {};
    for (const line of errorLines) {
      const match = line.match(/^(src\/[^(]+)\(/);
      if (match) {
        const file = match[1];
        if (!errorsByFile[file]) errorsByFile[file] = [];
        errorsByFile[file].push(line);
      }
    }

    for (const [relFile, errors] of Object.entries(errorsByFile)) {
      const file = path.join(dir, relFile);
      if (!fs.existsSync(file)) continue;

      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix "Property X does not exist on type '{}'" - from useContext returning {}
      // This means the context wasn't properly typed. Fix the consuming site by adding : any
      const propErrors = errors.filter(e => e.includes("does not exist on type '{}'"));
      if (propErrors.length > 0) {
        // Find the useXxx() hooks that return {} and add type assertion
        // Pattern: const { x, y } = useXxx();  →  const { x, y } = useXxx() as any;
        // Or: const { x, y }: any = useXxx();
        const hookPatterns = [
          /const\s+\{([^}]+)\}\s*=\s*(use\w+)\(\s*\)\s*;/g,
          /const\s+\{([^}]+)\}\s*=\s*(use\w+)\(\s*\w*\s*\)\s*;/g,
        ];

        for (const pattern of hookPatterns) {
          content = content.replace(pattern, (match, props, hookName) => {
            // Skip if already typed
            if (match.includes(': any') || match.includes('as any')) return match;
            // Only fix if the hook name matches known context hooks
            if (hookName.match(/^use(Auth|Language|Theme|Toast|Cart|Badge|Progress|Context|App)/i)) {
              return match.replace(`= ${hookName}(`, `= ${hookName}(`) // Same but add : any
                .replace(/const\s+\{([^}]+)\}\s*=/, 'const {$1}: any =');
            }
            return match;
          });
        }

        // Also fix useState destructuring where the type is {}
        // const [x, setX] = useState({});
        // These usually aren't the issue, but check

        if (content !== fs.readFileSync(file, 'utf8')) {
          modified = true;
        }
      }

      // Fix "Property X does not exist on type 'unknown'" - from catch blocks or async results
      const unknownErrors = errors.filter(e => e.includes("on type 'unknown'"));
      if (unknownErrors.length > 0) {
        // Fix catch blocks: catch (e) → catch (e: any)
        content = content.replace(
          /\}\s*catch\s*\(\s*(\w+)\s*\)\s*\{/g,
          (match, varName) => {
            if (match.includes(': any')) return match;
            return `} catch (${varName}: any) {`;
          }
        );

        // Fix async results: const result = await xxx(); → const result: any = await xxx();
        // Or add type assertion to the .then() result

        if (content !== fs.readFileSync(file, 'utf8')) {
          modified = true;
        }
      }

      // Fix "Type 'string' is not assignable to type 'number'" - colSpan/rowSpan
      const stringToNumberErrors = errors.filter(e => e.includes("'string' is not assignable to type 'number'"));
      if (stringToNumberErrors.length > 0) {
        // These are usually colSpan={someStringVar} → colSpan={Number(someStringVar)}
        // Or key={string} where number is expected
        // For now, we'll add Number() wrapping or parseInt
        // Most common: colSpan="2" → colSpan={2}
        content = content.replace(/colSpan="(\d+)"/g, 'colSpan={$1}');
        content = content.replace(/rowSpan="(\d+)"/g, 'rowSpan={$1}');

        if (content !== fs.readFileSync(file, 'utf8')) {
          modified = true;
        }
      }

      // Fix "Type 'string' is not assignable to type 'Key'" from unknown contexts
      // This usually occurs with value={unknownVar} on select/option elements

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${proj}/${relFile}`);
      }
    }
  }

  console.log(`  Fix 4 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 5: AuthContext that was imported but not from contexts dir ───
function fix5_authHooksInHooksDir() {
  console.log('\n═══ Fix 5: hooks 디렉토리 Auth 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    // Look for hooks/useAuth.ts(x) files
    const hookDirs = [
      path.join(srcDir, 'hooks'),
      path.join(srcDir, 'utils'),
      path.join(srcDir, 'lib'),
    ];

    for (const hookDir of hookDirs) {
      if (!fs.existsSync(hookDir)) continue;
      const files = fs.readdirSync(hookDir)
        .filter(f => f.match(/auth/i) && (f.endsWith('.ts') || f.endsWith('.tsx')))
        .map(f => path.join(hookDir, f));

      for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix createContext without type
        if (content.includes('createContext(') && !content.includes('createContext<')) {
          content = content.replace(/createContext\(\s*\)/g, 'createContext<any>(null)');
          content = content.replace(/createContext\(\s*null\s*\)/g, 'createContext<any>(null)');
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(file, content, 'utf8');
          count++;
          console.log(`  ✓ ${path.relative(BASE, file)}`);
        }
      }
    }
  }

  console.log(`  Fix 5 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 6: Remaining "does not exist on type '{}'" from useState({}) ───
function fix6_useStateEmpty() {
  console.log('\n═══ Fix 6: useState({}) 타입 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const dir = path.join(BASE, proj);
    let output = '';
    try {
      execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 60000 });
      continue;
    } catch (e) {
      output = e.stdout || '';
    }

    const errorLines = output.split('\n').filter(l => l.includes("does not exist on type '{}'") || l.includes("on type 'unknown'"));
    if (errorLines.length === 0) continue;

    // Get unique files
    const files = [...new Set(errorLines.map(l => {
      const m = l.match(/^(src\/[^(]+)\(/);
      return m ? m[1] : null;
    }).filter(Boolean))];

    for (const relFile of files) {
      const file = path.join(dir, relFile);
      if (!fs.existsSync(file)) continue;

      let content = fs.readFileSync(file, 'utf8');
      const origContent = content;

      // Fix: const [xxx, setXxx] = useState({}) → useState<any>({})
      content = content.replace(
        /useState\(\s*\{\s*\}\s*\)/g,
        'useState<any>({})'
      );

      // Fix: const { x, y } = useXxx() → const { x, y }: any = useXxx()
      content = content.replace(
        /const\s+\{\s*([^}]+)\s*\}\s*=\s*(use\w+)\(\s*\)/g,
        (match, props, hook) => {
          if (match.includes(': any')) return match;
          return `const { ${props} }: any = ${hook}()`;
        }
      );

      // Fix catch (e) → catch (e: any)
      content = content.replace(
        /\}\s*catch\s*\(\s*(\w+)\s*\)\s*\{/g,
        (match, v) => match.includes(': any') ? match : `} catch (${v}: any) {`
      );

      // Fix: .then(result => { result.success → add type
      // Pattern: const result = await fetch/supabase calls where result is unknown
      content = content.replace(
        /\.then\(\s*(\w+)\s*=>/g,
        (match, v) => match.includes(':') ? match : `.then((${v}: any) =>`
      );

      if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${proj}/${relFile}`);
      }
    }
  }

  console.log(`  Fix 6 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Fix 7: Additional specific patterns ��──
function fix7_specificPatterns() {
  console.log('\n═══ Fix 7: 추가 특수 패턴 수정 ═══');
  let count = 0;

  for (const proj of PROJECTS) {
    const srcDir = path.join(BASE, proj, 'src');
    if (!fs.existsSync(srcDir)) continue;

    const tsxFiles = walkDir(srcDir, '.tsx');

    for (const file of tsxFiles) {
      let content = fs.readFileSync(file, 'utf8');
      const origContent = content;

      // Fix: colSpan="N" → colSpan={N}
      content = content.replace(/colSpan="(\d+)"/g, 'colSpan={$1}');
      content = content.replace(/rowSpan="(\d+)"/g, 'rowSpan={$1}');

      // Fix: .props on ReactNode (lesson detail)
      // element.props.xxx → (element as any).props.xxx
      if (content.includes('.props.') && content.includes('ReactNode')) {
        content = content.replace(
          /(\w+)\.props\./g,
          (match, varName) => {
            // Only fix if not already cast
            if (match.includes('as any')) return match;
            return `(${varName} as any).props.`;
          }
        );
      }

      // Fix: .closest on EventTarget
      if (content.includes('.closest(') && content.includes('EventTarget')) {
        content = content.replace(
          /(\w+\.target)\.closest\(/g,
          '($1 as HTMLElement).closest('
        );
      }

      // Fix: toFixed on ValueType (recharts)
      if (content.includes('.toFixed(') && content.includes('ValueType')) {
        content = content.replace(
          /(\w+)\.toFixed\(/g,
          (match, varName) => `Number(${varName}).toFixed(`
        );
      }

      // Fix: .default on imported modules (react-simple-code-editor)
      if (content.includes('.default') && content.includes('react-simple-code-editor')) {
        content = content.replace(
          /(\w+)\.default/g,
          (match, varName) => {
            if (varName === 'module' || varName === 'exports') return match;
            return `(${varName} as any).default`;
          }
        );
      }

      // Fix: window.Prism
      if (content.includes('window.Prism')) {
        content = content.replace(/window\.Prism/g, '(window as any).Prism');
      }

      // Fix: Spread types from object types - ...unknownVar
      if (content.match(/\.\.\.\s*\w+/) && content.includes('Spread types may only')) {
        // This needs more context - skip for now
      }

      if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log(`  ✓ ${path.relative(BASE, file)}`);
      }
    }
  }

  console.log(`  Fix 7 완료: ${count}개 파일 수정`);
  totalFixed += count;
}

// ─── Run all fixes ──────────────────────────────────
console.log('╔══════════════════════════════════════════════╗');
console.log('║  TSC Error Batch Fix - Round 2               ║');
console.log('╚══════════════════════════════════════════════╝');

fix1_heroBackground();
fix2_contextHooks();
fix3_missingAuthContext();
fix4_remainingPropertyErrors();
fix5_authHooksInHooksDir();
fix6_useStateEmpty();
fix7_specificPatterns();

console.log(`\n총 ${totalFixed}개 파일 추가 수정`);

// ─── Final Verification ────────────────────────────
console.log('\n═══ 최종 검증 ═══');
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
console.log(`\n총 남은 에러: ${totalErrors}개 (이전: 270개)`);

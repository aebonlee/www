const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE = 'D:/dreamit-web';
const EXCLUDE = ['www', 'Dev_md04', 'edu-hub', '.git'];

// Discover all projects
const allDirs = fs.readdirSync(BASE, { withFileTypes: true })
  .filter(d => d.isDirectory() && !EXCLUDE.includes(d.name) && !d.name.startsWith('.'))
  .map(d => d.name);

console.log('Found projects:', allDirs.join(', '));
console.log('Total:', allDirs.length);
console.log('');

const results = [];

for (const proj of allDirs) {
  const projDir = path.join(BASE, proj);

  // Find the actual project root (handle nested repos like sqld/sqld-repo was)
  let srcRoot = projDir;
  const hasPkg = fs.existsSync(path.join(projDir, 'package.json'));
  if (!hasPkg) {
    // Check for subdirectories with package.json
    const subs = fs.readdirSync(projDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && fs.existsSync(path.join(projDir, d.name, 'package.json')));
    if (subs.length > 0) {
      srcRoot = path.join(projDir, subs[0].name);
    } else {
      results.push({ name: proj, error: 'No package.json found', scores: {} });
      continue;
    }
  }

  const info = { name: proj, root: srcRoot, scores: {} };

  try {
    // 1. Check package.json
    const pkg = JSON.parse(fs.readFileSync(path.join(srcRoot, 'package.json'), 'utf8'));
    info.framework = [];
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (allDeps['react']) info.framework.push('React ' + (allDeps['react'] || ''));
    if (allDeps['vite']) info.framework.push('Vite ' + (allDeps['vite'] || ''));
    if (allDeps['typescript']) info.framework.push('TypeScript');
    info.hasTypeScript = !!allDeps['typescript'];
    info.hasTypesReact = !!allDeps['@types/react'];

    // 2. Check tsconfig.json
    info.hasTsconfig = fs.existsSync(path.join(srcRoot, 'tsconfig.json'));

    // 3. Count source files
    const srcDir = path.join(srcRoot, 'src');
    if (fs.existsSync(srcDir)) {
      const countFiles = (dir, ext) => {
        let count = 0;
        try {
          for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            if (item.isDirectory() && item.name !== 'node_modules') {
              count += countFiles(path.join(dir, item.name), ext);
            } else if (item.isFile() && item.name.endsWith(ext)) {
              count++;
            }
          }
        } catch {}
        return count;
      };

      info.tsxCount = countFiles(srcDir, '.tsx');
      info.tsCount = countFiles(srcDir, '.ts');
      info.jsxCount = countFiles(srcDir, '.jsx');
      info.jsCount = countFiles(srcDir, '.js');
      info.cssCount = countFiles(srcDir, '.css');
      info.totalSrc = info.tsxCount + info.tsCount + info.jsxCount + info.jsCount;
      info.tsRatio = info.totalSrc > 0 ? ((info.tsxCount + info.tsCount) / info.totalSrc * 100).toFixed(0) : '0';
    }

    // 4. Check git status
    try {
      const gitLog = execSync(`git log --oneline -1`, { cwd: srcRoot, encoding: 'utf8', timeout: 5000 }).trim();
      info.lastCommit = gitLog;
    } catch { info.lastCommit = 'N/A'; }

    // 5. Check CNAME (custom domain)
    info.hasCNAME = fs.existsSync(path.join(srcRoot, 'CNAME')) || fs.existsSync(path.join(srcRoot, 'public', 'CNAME'));
    if (info.hasCNAME) {
      try {
        const cnamePath = fs.existsSync(path.join(srcRoot, 'CNAME'))
          ? path.join(srcRoot, 'CNAME')
          : path.join(srcRoot, 'public', 'CNAME');
        info.domain = fs.readFileSync(cnamePath, 'utf8').trim();
      } catch { info.domain = ''; }
    }

    // 6. Check for key features
    info.hasRouter = !!(allDeps['react-router-dom'] || allDeps['react-router']);
    info.hasSupabase = !!allDeps['@supabase/supabase-js'];
    info.hasTailwind = !!allDeps['tailwindcss'];
    info.hasI18n = false;
    // Check for i18n/language context
    if (fs.existsSync(srcDir)) {
      try {
        const allFiles = execSync(`dir /S /B "${srcDir.replace(/\//g,'\\')}" 2>NUL`, { encoding: 'utf8', timeout: 5000 });
        info.hasI18n = allFiles.toLowerCase().includes('language') || allFiles.toLowerCase().includes('i18n') || allFiles.toLowerCase().includes('translation');
      } catch {}
    }

    // 7. Check for SEO (meta tags, SEOHead component)
    info.hasSEO = false;
    if (fs.existsSync(srcDir)) {
      try {
        const allFiles = execSync(`dir /S /B "${srcDir.replace(/\//g,'\\')}" 2>NUL`, { encoding: 'utf8', timeout: 5000 });
        info.hasSEO = allFiles.toLowerCase().includes('seohead') || allFiles.toLowerCase().includes('helmet');
      } catch {}
    }

    // 8. Check dist folder exists (has been built)
    info.hasDist = fs.existsSync(path.join(srcRoot, 'dist'));

    // 9. Check .env (has backend/API config)
    info.hasEnv = fs.existsSync(path.join(srcRoot, '.env')) || fs.existsSync(path.join(srcRoot, '.env.local'));

    // 10. Count pages
    const pagesDir = path.join(srcRoot, 'src', 'pages');
    if (fs.existsSync(pagesDir)) {
      try {
        info.pageCount = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx')).length;
      } catch { info.pageCount = 0; }
    } else {
      info.pageCount = 0;
    }

    // 11. Count components
    const compDir = path.join(srcRoot, 'src', 'components');
    if (fs.existsSync(compDir)) {
      const countAll = (dir) => {
        let c = 0;
        try {
          for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            if (item.isDirectory()) c += countAll(path.join(dir, item.name));
            else if (item.name.endsWith('.tsx') || item.name.endsWith('.jsx')) c++;
          }
        } catch {}
        return c;
      };
      info.componentCount = countAll(compDir);
    } else {
      info.componentCount = 0;
    }

    // 12. TSC check (only for TS projects)
    if (info.hasTypeScript && info.hasTsconfig) {
      try {
        execSync('npx tsc --noEmit 2>&1', { cwd: srcRoot, encoding: 'utf8', timeout: 30000 });
        info.tscErrors = 0;
      } catch (e) {
        const output = e.stdout || e.stderr || '';
        const errCount = (output.match(/error TS/g) || []).length;
        info.tscErrors = errCount;
      }
    } else {
      info.tscErrors = -1; // not applicable
    }

  } catch (e) {
    info.error = e.message;
  }

  results.push(info);
  console.log(`Evaluated: ${proj} (${info.totalSrc || 0} files, TS: ${info.tsRatio || 0}%, TSC: ${info.tscErrors ?? 'N/A'})`);
}

// Output JSON for further processing
fs.writeFileSync(path.join(BASE, 'www', 'site-evaluation.json'), JSON.stringify(results, null, 2));
console.log('\nResults saved to site-evaluation.json');

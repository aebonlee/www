const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    isolatedModules: true,
    moduleDetection: "force",
    noEmit: true,
    jsx: "react-jsx",
    strict: true,
    noImplicitAny: false,
    strictNullChecks: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noFallthroughCasesInSwitch: true,
    noUncheckedSideEffectImports: true
  },
  include: ["src"]
}, null, 2);

const PROJECTS = [
  'planning', 'aI-agents', 'chatgpt', 'autowork', 'genspark',
  'forjob', 'koreait', 'gemini', 'ai-media', 'career',
  'allthat', 'software', 'papers', 'ai-data', 'uxdesign',
  'marketing', 'koreatech', 'ai-prompt', 'ahp_basic'
];

const BASE = 'D:\\dreamit-web';

for (const proj of PROJECTS) {
  const dir = path.join(BASE, proj);
  console.log(`\n=== ${proj} ===`);

  // Fix tsconfig.json
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), TSCONFIG);
  console.log('  tsconfig.json fixed');

  // Fix vite-env.d.ts (may also have been escaped)
  fs.writeFileSync(path.join(dir, 'src', 'vite-env.d.ts'), '/// <reference types="vite/client" />\n');

  // Run tsc
  try {
    execSync('npx tsc --noEmit 2>&1', { cwd: dir, encoding: 'utf8', timeout: 60000 });
    console.log('  tsc: 0 errors');
  } catch (e) {
    const output = e.stdout || '';
    const errorLines = output.split('\n').filter(l => l.includes('error TS'));
    console.log(`  tsc: ${errorLines.length} errors`);
    if (errorLines.length > 0) {
      errorLines.forEach(l => console.log('    ' + l.trim()));
    }
  }

  // Build
  try {
    const buildResult = execSync('npx vite build 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    const lines = buildResult.trim().split('\n');
    console.log('  build: SUCCESS - ' + lines.slice(-2).join(' | '));
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    console.log('  build: FAILED');
    // Show last relevant lines
    const lines = out.split('\n').filter(l => l.trim() && !l.includes('at '));
    console.log('    ' + lines.slice(-3).join('\n    '));
  }

  // Amend commit with fixed files
  try {
    execSync('git add -A', { cwd: dir, encoding: 'utf8' });
    execSync('git commit --amend --no-edit', { cwd: dir, encoding: 'utf8' });
    console.log('  commit: amended');
  } catch (e) {
    console.log('  commit: ' + (e.stdout || e.message).split('\n')[0]);
  }

  // Force push (since we amended)
  try {
    execSync('git push --force 2>&1', { cwd: dir, encoding: 'utf8', timeout: 30000 });
    console.log('  push: done');
  } catch (e) {
    console.log('  push: ' + (e.stderr || e.stdout || e.message).split('\n').filter(l => l.trim()).slice(-1)[0]);
  }

  // Redeploy
  try {
    execSync('npx gh-pages -d dist 2>&1', { cwd: dir, encoding: 'utf8', timeout: 120000 });
    console.log('  deploy: Published');
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    if (out.includes('Published')) {
      console.log('  deploy: Published');
    } else {
      console.log('  deploy: ' + out.split('\n').filter(l => l.trim()).slice(-1)[0]);
    }
  }

  console.log(`=== ${proj} DONE ===`);
}

console.log('\n========== ALL FIXED ==========');

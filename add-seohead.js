const fs = require('fs');
const path = require('path');

const seoHeadCode = `import { useEffect } from 'react';

const SEOHead = ({ title, description }: any) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEOHead;
`;

const projects = [
  {
    name: 'career',
    root: 'D:/dreamit-web/career',
    seoDir: 'src/components',
    pages: [
      {
        file: 'src/pages/HomePage.tsx',
        title: 'Career Development | 커리어 개발 플랫폼',
        desc: '멘토링, 코스, 가이드를 통한 체계적인 커리어 개발 플랫폼',
        importAfter: "import CTASection from '../components/landing/CTASection';",
        insertBefore: '<HeroSection />',
        importPath: '../components/SEOHead',
      },
    ]
  },
  {
    name: 'java-study',
    root: 'D:/dreamit-web/java-study',
    seoDir: 'src/components',
    pages: [
      {
        file: 'src/pages/Home.tsx',
        title: 'Java Study | 자바 학습 플랫폼',
        desc: 'Java, Servlet, Spring 등 자바 풀스택 개발 학습 플랫폼',
        importAfter: "import { useBadge } from '../contexts/BadgeContext'",
        insertBefore: '<main>',
        importPath: '../components/SEOHead',
      },
    ]
  },
  {
    name: 'competency',
    root: 'D:/dreamit-web/competency',
    seoDir: 'src/components',
    pages: [
      // competency already has usePageTitle, just add SEOHead component for meta desc
      {
        file: 'src/pages/public/Home.tsx',
        title: 'MyCoreCompetency | 4차 산업혁명 8대 핵심역량 검사',
        desc: '4차 산업혁명 시대 8대 핵심역량(창의력, 비판적사고, 의사소통 등) 자가 진단 플랫폼',
        importAfter: "import usePageTitle from '../../utils/usePageTitle';",
        insertBefore: "usePageTitle('');",
        importPath: '../../components/SEOHead',
        insertType: 'hook', // insert before the hook call, not JSX
      },
    ]
  },
];

for (const proj of projects) {
  console.log(`\n=== ${proj.name} ===`);

  // 1. Create SEOHead component
  const seoPath = path.join(proj.root, proj.seoDir, 'SEOHead.tsx');
  if (!fs.existsSync(seoPath)) {
    // Ensure directory exists
    const dir = path.dirname(seoPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(seoPath, seoHeadCode, 'utf8');
    console.log(`  Created: ${proj.seoDir}/SEOHead.tsx`);
  } else {
    console.log(`  Already exists: ${proj.seoDir}/SEOHead.tsx`);
  }

  // 2. Add SEOHead to key pages
  for (const page of proj.pages) {
    const pagePath = path.join(proj.root, page.file);
    if (!fs.existsSync(pagePath)) {
      console.log(`  SKIP (not found): ${page.file}`);
      continue;
    }

    let content = fs.readFileSync(pagePath, 'utf8');

    // Check if already has SEOHead
    if (content.includes('SEOHead')) {
      console.log(`  Already has SEOHead: ${page.file}`);
      continue;
    }

    // Add import
    if (page.importAfter && content.includes(page.importAfter)) {
      content = content.replace(
        page.importAfter,
        `${page.importAfter}\nimport SEOHead from '${page.importPath}';`
      );
    } else {
      // Add at top after last import
      const lastImport = content.lastIndexOf('import ');
      const lineEnd = content.indexOf('\n', lastImport);
      content = content.slice(0, lineEnd + 1) +
        `import SEOHead from '${page.importPath}';\n` +
        content.slice(lineEnd + 1);
    }

    // Add SEOHead component usage
    const seoTag = `<SEOHead title="${page.title}" description="${page.desc}" />`;

    if (page.insertType === 'hook') {
      // Insert as JSX - need to find the return statement
      const returnIdx = content.indexOf('return (');
      if (returnIdx !== -1) {
        // Find the opening tag after return (
        const afterReturn = content.indexOf('\n', returnIdx);
        content = content.slice(0, afterReturn + 1) +
          `      <>\n      ${seoTag}\n` +
          content.slice(afterReturn + 1);
        // Find the closing of the return and wrap with fragment
        // Actually, let's just insert before the first JSX element
      }
      // Simpler: just add after return ( on new line
      content = content.replace(
        'return (',
        `return (\n      <>\n      ${seoTag}`
      );
      // Need to close the fragment - find the last ); of the return
      // This is complex, let me use a different approach
      // Actually, skip the complex wrapping. Just add the SEOHead before the first div/main/section
      // Revert and use simpler approach
      content = fs.readFileSync(pagePath, 'utf8');

      // Add import
      if (page.importAfter && content.includes(page.importAfter)) {
        content = content.replace(
          page.importAfter,
          `${page.importAfter}\nimport SEOHead from '${page.importPath}';`
        );
      }

      // For hook-style pages, add useEffect-based call in the component body
      // Actually, since competency uses usePageTitle already for title,
      // let's just add SEOHead in the JSX return
      // Find return ( and add SEOHead after the first opening tag
      content = content.replace(
        /return\s*\(\s*\n(\s*)<(\w+)/,
        (match, indent, tag) => {
          return `return (\n${indent}<>\n${indent}${seoTag}\n${indent}<${tag}`;
        }
      );

      // Close the fragment before the final );
      // Find the closing of the component return
      const lastCloseParen = content.lastIndexOf('  );');
      if (lastCloseParen !== -1) {
        content = content.slice(0, lastCloseParen) + '  </>\n  );\n' + content.slice(lastCloseParen + 5);
      }
    } else {
      // Standard JSX insertion
      if (page.insertBefore && content.includes(page.insertBefore)) {
        content = content.replace(
          page.insertBefore,
          `${seoTag}\n      ${page.insertBefore}`
        );
      }
    }

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`  Added SEOHead to: ${page.file}`);
  }
}

console.log('\nDone!');

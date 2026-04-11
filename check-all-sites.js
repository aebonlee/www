/**
 * 전체 사이트 접근성 + 오류 점검 스크립트
 */
const https = require('https');
const http = require('http');

const sites = [
  'coding.dreamitbiz.com',
  'papers.dreamitbiz.com',
  'uxdesign.dreamitbiz.com',
  'allthat.dreamitbiz.com',
  'self-branding.dreamitbiz.com',
  'marketing.dreamitbiz.com',
  'edu-hub.dreamitbiz.com',
  'koreatech.dreamitbiz.com',
  'java-study.dreamitbiz.com',
  'claude.dreamitbiz.com',
  'fine-tuning.dreamitbiz.com',
  'c-study.dreamitbiz.com',
  'python-study.dreamitbiz.com',
  'openclaw.dreamitbiz.com',
  'ai-media.dreamitbiz.com',
  'algorithm.dreamitbiz.com',
  'reactstudy.dreamitbiz.com',
  'webstudy.dreamitbiz.com',
  'books.dreamitbiz.com',
  'pbirobot.dreamitbiz.com',
  'linux-study.dreamitbiz.com',
  'db-study.dreamitbiz.com',
  'koreait.dreamitbiz.com',
  'presentation.dreamitbiz.com',
  'planning.dreamitbiz.com',
  'html.dreamitbiz.com',
  'ai-agents.dreamitbiz.com',
  'jobpath.dreamitbiz.com',
  'ai-hub.dreamitbiz.com',
  'digitalbiz.dreamitbiz.com',
  'ahp-basic.dreamitbiz.com',
  'ai-prompt.dreamitbiz.com',
  'teaching.dreamitbiz.com',
  'competency.dreamitbiz.com',
  'ai-data.dreamitbiz.com',
  'software.dreamitbiz.com',
  'career.dreamitbiz.com',
  'www.dreamitbiz.com',
  'docs.dreamitbiz.com',
  'reserve.dreamitbiz.com',
  'gemini.dreamitbiz.com',
  'japanese.dreamitbiz.com',
  'korean.dreamitbiz.com',
  'hohai.dreamitbiz.com',
  'autowork.dreamitbiz.com',
  'jdy.dreamitbiz.com',
  'pbi.dreamitbiz.com',
  'sqld.dreamitbiz.com',
  'data-structure.dreamitbiz.com',
  'chatgpt.dreamitbiz.com',
  'english.dreamitbiz.com',
  'genspark.dreamitbiz.com',
  'eip.dreamitbiz.com',
  'aebon.dreamitbiz.com',
  'wonjunjang.dreamitbiz.com',
];

function checkSite(domain) {
  return new Promise((resolve) => {
    const url = `https://${domain}/`;
    const startTime = Date.now();

    const req = https.get(url, { timeout: 15000 }, (res) => {
      const elapsed = Date.now() - startTime;
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const hasTitle = /<title>([^<]*)<\/title>/i.exec(body);
        const title = hasTitle ? hasTitle[1].trim() : '(no title)';
        const has404 = body.includes('404') && body.includes('not found');
        const hasError = body.includes('Error') || body.includes('error');
        const hasLogin = body.includes('login') || body.includes('Login') || body.includes('로그인');
        const hasSignup = body.includes('register') || body.includes('Register') || body.includes('회원가입') || body.includes('signup');
        const hasSupabase = body.includes('supabase');
        const bodySize = body.length;
        const hasContent = bodySize > 500;
        const hasMetaDesc = /<meta[^>]*name="description"[^>]*>/i.test(body);
        const hasOG = /<meta[^>]*property="og:/i.test(body);
        const hasViewport = /<meta[^>]*name="viewport"/i.test(body);
        const hasFavicon = /<link[^>]*rel="icon"/i.test(body) || /<link[^>]*rel="shortcut icon"/i.test(body);

        // Check for common SPA indicators
        const isSPA = body.includes('id="root"') || body.includes('id="app"');
        const hasJS = /<script/i.test(body);

        // Check for console errors in inline scripts
        const scriptErrors = [];
        if (body.includes('process.env') && !body.includes('import.meta.env')) {
          scriptErrors.push('uses process.env (should be import.meta.env for Vite)');
        }

        resolve({
          domain,
          status: res.statusCode,
          redirect: res.headers.location || null,
          elapsed,
          title,
          bodySize,
          hasContent,
          has404,
          hasError: hasError && !hasLogin, // exclude login-related "error"
          hasLogin,
          hasSignup,
          hasSupabase,
          isSPA,
          hasJS,
          hasMetaDesc,
          hasOG,
          hasViewport,
          hasFavicon,
          scriptErrors,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        domain,
        status: 'ERROR',
        error: err.message,
        elapsed: Date.now() - startTime,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        domain,
        status: 'TIMEOUT',
        elapsed: Date.now() - startTime,
      });
    });
  });
}

async function main() {
  console.log(`Checking ${sites.length} sites...\n`);

  // Check 10 at a time
  const results = [];
  for (let i = 0; i < sites.length; i += 10) {
    const batch = sites.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(checkSite));
    results.push(...batchResults);
    console.log(`  Checked ${Math.min(i + 10, sites.length)}/${sites.length}...`);
  }

  // Categorize
  const errors = results.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT');
  const redirects = results.filter(r => r.status >= 300 && r.status < 400);
  const ok = results.filter(r => r.status === 200);
  const other = results.filter(r => typeof r.status === 'number' && r.status !== 200 && (r.status < 300 || r.status >= 400));

  console.log('\n' + '='.repeat(80));
  console.log('SITE CHECK RESULTS');
  console.log('='.repeat(80));

  // Score each site
  const scored = results.map(r => {
    let score = 0;
    let issues = [];
    let strengths = [];

    if (r.status === 200) { score += 20; strengths.push('접근 가능'); }
    else if (r.status === 'ERROR') { score = 0; issues.push(`접속 불가: ${r.error}`); return { ...r, score, issues, strengths }; }
    else if (r.status === 'TIMEOUT') { score = 0; issues.push('응답 시간 초과'); return { ...r, score, issues, strengths }; }
    else { score += 5; issues.push(`HTTP ${r.status}`); }

    if (r.hasContent) { score += 10; } else { issues.push('콘텐츠 부족'); }
    if (r.isSPA) { score += 5; strengths.push('SPA'); }
    if (r.hasJS) { score += 5; }
    if (r.hasLogin) { score += 10; strengths.push('로그인 기능'); }
    if (r.hasSignup) { score += 5; strengths.push('회원가입'); }
    if (r.hasMetaDesc) { score += 10; strengths.push('SEO meta'); } else { issues.push('meta description 없음'); }
    if (r.hasOG) { score += 10; strengths.push('OG 태그'); } else { issues.push('OG 태그 없음'); }
    if (r.hasViewport) { score += 5; strengths.push('반응형'); } else { issues.push('viewport 미설정'); }
    if (r.hasFavicon) { score += 5; strengths.push('파비콘'); } else { issues.push('파비콘 없음'); }
    if (r.elapsed < 2000) { score += 5; strengths.push(`빠른 응답(${r.elapsed}ms)`); }
    else if (r.elapsed < 5000) { score += 2; }
    else { issues.push(`느린 응답(${r.elapsed}ms)`); }

    if (r.has404) { score -= 10; issues.push('404 페이지 감지'); }
    if (r.hasError) { score -= 5; issues.push('에러 텍스트 감지'); }
    if (r.scriptErrors && r.scriptErrors.length > 0) {
      score -= 5;
      issues.push(...r.scriptErrors);
    }

    // title quality
    if (r.title && r.title !== '(no title)' && r.title.length > 5) {
      score += 5;
    } else {
      issues.push('타이틀 미흡');
    }

    return { ...r, score: Math.max(0, Math.min(100, score)), issues, strengths };
  });

  // Sort by score desc
  scored.sort((a, b) => b.score - a.score);

  // Print results
  console.log('\n[점수순 전체 사이트 평가]');
  console.log('-'.repeat(80));

  let gradeA = 0, gradeB = 0, gradeC = 0, gradeD = 0, gradeF = 0;

  scored.forEach((s, i) => {
    let grade = '';
    if (s.score >= 80) { grade = 'A'; gradeA++; }
    else if (s.score >= 60) { grade = 'B'; gradeB++; }
    else if (s.score >= 40) { grade = 'C'; gradeC++; }
    else if (s.score >= 20) { grade = 'D'; gradeD++; }
    else { grade = 'F'; gradeF++; }

    console.log(`\n${i+1}. [${grade}] ${s.domain} — ${s.score}점`);
    if (s.title) console.log(`   제목: ${s.title}`);
    if (s.status !== 200 && s.status !== 'ERROR' && s.status !== 'TIMEOUT') console.log(`   HTTP: ${s.status}`);
    if (s.strengths && s.strengths.length) console.log(`   장점: ${s.strengths.join(', ')}`);
    if (s.issues && s.issues.length) console.log(`   개선: ${s.issues.join(', ')}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('전체 요약');
  console.log('='.repeat(80));
  console.log(`총 사이트: ${sites.length}`);
  console.log(`접근 가능: ${ok.length} | 리다이렉트: ${redirects.length} | 오류: ${errors.length + other.length}`);
  console.log(`\n등급 분포: A(80+): ${gradeA} | B(60-79): ${gradeB} | C(40-59): ${gradeC} | D(20-39): ${gradeD} | F(0-19): ${gradeF}`);
  console.log(`평균 점수: ${(scored.reduce((s, r) => s + r.score, 0) / scored.length).toFixed(1)}점`);

  // Print issues summary
  const allIssues = {};
  scored.forEach(s => {
    (s.issues || []).forEach(issue => {
      if (!allIssues[issue]) allIssues[issue] = [];
      allIssues[issue].push(s.domain);
    });
  });

  console.log('\n[공통 이슈 TOP]');
  Object.entries(allIssues)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 15)
    .forEach(([issue, domains]) => {
      console.log(`  ${issue} (${domains.length}개): ${domains.slice(0, 5).join(', ')}${domains.length > 5 ? '...' : ''}`);
    });
}

main().catch(console.error);

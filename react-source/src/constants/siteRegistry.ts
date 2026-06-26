/**
 * siteRegistry.ts — 전체 하위 사이트 단일 소스(SSOT)
 * www 대시보드의 모든 사이트 목록·현황이 이 레지스트리에서 파생됨.
 * 새 사이트 추가 시 여기 한 곳만 수정하면 SITE_OPTIONS·사이트 현황 등에 자동 반영.
 */
export interface SiteEntry {
  name: string;
  /** 사이트 분류 — SITE_CATEGORIES의 label 중 하나 (대시보드·사이트현황 그룹/분포에 사용) */
  category: string;
  domain: string;
  url: string;
  color: string;
  hasPayment: boolean;
  /** 결제 사이트의 Supabase 주문 테이블 (매출 집계용) */
  ordersTable?: string;
  /** getAllOrdersAll의 site 태그 키 (테이블명과 별개) */
  ordersSite?: string;
}

export const SITES: SiteEntry[] = [
  { name: 'edu-hub', category: 'Hub 사이트', domain: 'edu-hub.dreamitbiz.com', url: 'https://edu-hub.dreamitbiz.com', color: 'purple', hasPayment: true, ordersTable: 'eh_orders', ordersSite: 'edu-hub' },
  { name: 'ai-hub', category: 'Hub 사이트', domain: 'ai-hub.dreamitbiz.com', url: 'https://ai-hub.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'biz-hub', category: 'Hub 사이트', domain: 'biz-hub.dreamitbiz.com', url: 'https://biz-hub.dreamitbiz.com', color: 'blue', hasPayment: false, ordersTable: 'biz_orders', ordersSite: 'biz-hub' },
  { name: 'cs-hub', category: 'Hub 사이트', domain: 'cs-hub.dreamitbiz.com', url: 'https://cs-hub.dreamitbiz.com', color: 'purple', hasPayment: true, ordersTable: 'csh_orders', ordersSite: 'cs-hub' },
  { name: 'basic-hub', category: 'Hub 사이트', domain: 'basic-hub.dreamitbiz.com', url: 'https://basic-hub.dreamitbiz.com', color: 'yellow', hasPayment: true, ordersTable: 'bsh_orders', ordersSite: 'basic-hub' },
  { name: 'exam-hub', category: 'Hub 사이트', domain: 'exam-hub.dreamitbiz.com', url: 'https://exam-hub.dreamitbiz.com', color: 'red', hasPayment: true, ordersTable: 'exh_orders', ordersSite: 'exam-hub' },
  { name: 'career-hub', category: 'Hub 사이트', domain: 'career-hub.dreamitbiz.com', url: 'https://career-hub.dreamitbiz.com', color: 'green', hasPayment: true, ordersTable: 'crh_orders', ordersSite: 'career-hub' },
  { name: 'thesis-hub', category: 'Hub 사이트', domain: 'thesis-hub.dreamitbiz.com', url: 'https://thesis-hub.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'coding-hub', category: 'Hub 사이트', domain: 'coding-hub.dreamitbiz.com', url: 'https://coding-hub.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'coding', category: '프로그래밍 교육', domain: 'coding.dreamitbiz.com', url: 'https://coding.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'c-study', category: '프로그래밍 교육', domain: 'c-study.dreamitbiz.com', url: 'https://c-study.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'python-study', category: '프로그래밍 교육', domain: 'python-study.dreamitbiz.com', url: 'https://python-study.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'java-study', category: '프로그래밍 교육', domain: 'java-study.dreamitbiz.com', url: 'https://java-study.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'reactstudy', category: '프로그래밍 교육', domain: 'reactstudy.dreamitbiz.com', url: 'https://reactstudy.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'html', category: '프로그래밍 교육', domain: 'html.dreamitbiz.com', url: 'https://html.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'algorithm', category: 'IT/CS 교육', domain: 'algorithm.dreamitbiz.com', url: 'https://algorithm.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'data-structure', category: 'IT/CS 교육', domain: 'data-structure.dreamitbiz.com', url: 'https://data-structure.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'linux-study', category: 'IT/CS 교육', domain: 'linux-study.dreamitbiz.com', url: 'https://linux-study.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'db-study', category: 'IT/CS 교육', domain: 'db-study.dreamitbiz.com', url: 'https://db-study.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'software', category: 'IT/CS 교육', domain: 'software.dreamitbiz.com', url: 'https://software.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'webstudy', category: 'IT/CS 교육', domain: 'webstudy.dreamitbiz.com', url: 'https://webstudy.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'koreatech', category: 'IT/CS 교육', domain: 'koreatech.dreamitbiz.com', url: 'https://koreatech.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'aisw', category: 'IT/CS 교육', domain: 'aisw.dreamitbiz.com', url: 'https://aisw.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'ai-prompt', category: 'AI 교육', domain: 'ai-prompt.dreamitbiz.com', url: 'https://ai-prompt.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'ai-data', category: 'AI 교육', domain: 'ai-data.dreamitbiz.com', url: 'https://ai-data.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'ai-media', category: 'AI 교육', domain: 'ai-media.dreamitbiz.com', url: 'https://ai-media.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'claude', category: 'AI 교육', domain: 'claude.dreamitbiz.com', url: 'https://claude.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'chatgpt', category: 'AI 교육', domain: 'chatgpt.dreamitbiz.com', url: 'https://chatgpt.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'gemini', category: 'AI 교육', domain: 'gemini.dreamitbiz.com', url: 'https://gemini.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'genspark', category: 'AI 교육', domain: 'genspark.dreamitbiz.com', url: 'https://genspark.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'copilot', category: 'AI 교육', domain: 'copilot.dreamitbiz.com', url: 'https://copilot.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'digitalbiz', category: '비즈니스/LMS', domain: 'digitalbiz.dreamitbiz.com', url: 'https://digitalbiz.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'marketing', category: '비즈니스/LMS', domain: 'marketing.dreamitbiz.com', url: 'https://marketing.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'uxdesign', category: '비즈니스/LMS', domain: 'uxdesign.dreamitbiz.com', url: 'https://uxdesign.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'self-branding', category: '비즈니스/LMS', domain: 'self-branding.dreamitbiz.com', url: 'https://self-branding.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'english', category: '어학', domain: 'english.dreamitbiz.com', url: 'https://english.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'japanese', category: '어학', domain: 'japanese.dreamitbiz.com', url: 'https://japanese.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'korean', category: '어학', domain: 'korean.dreamitbiz.com', url: 'https://korean.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'eip', category: '자격증', domain: 'eip.dreamitbiz.com', url: 'https://eip.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'sqld', category: '자격증', domain: 'sqld.dreamitbiz.com', url: 'https://sqld.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'ai-agents', category: 'AI 도구', domain: 'ai-agents.dreamitbiz.com', url: 'https://ai-agents.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'autowork', category: 'AI 도구', domain: 'autowork.dreamitbiz.com', url: 'https://autowork.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'fine-tuning', category: 'AI 도구', domain: 'fine-tuning.dreamitbiz.com', url: 'https://fine-tuning.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'vibe', category: 'AI 도구', domain: 'vibe.dreamitbiz.com', url: 'https://vibe.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'competency', category: '핵심 플랫폼', domain: 'competency.dreamitbiz.com', url: 'https://competency.dreamitbiz.com', color: 'purple', hasPayment: true },
  { name: 'career', category: '핵심 플랫폼', domain: 'career.dreamitbiz.com', url: 'https://career.dreamitbiz.com', color: 'green', hasPayment: true },
  { name: 'allthat', category: '핵심 플랫폼', domain: 'allthat.dreamitbiz.com', url: 'https://allthat.dreamitbiz.com', color: 'green', hasPayment: true, ordersTable: 'at_orders', ordersSite: 'allthat' },
  { name: 'papers', category: '핵심 플랫폼', domain: 'papers.dreamitbiz.com', url: 'https://papers.dreamitbiz.com', color: 'purple', hasPayment: true, ordersTable: 'pp_orders', ordersSite: 'papers' },
  { name: 'ahp_basic', category: '핵심 플랫폼', domain: 'ahp-basic.dreamitbiz.com', url: 'https://ahp-basic.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'teaching', category: '핵심 플랫폼', domain: 'teaching.dreamitbiz.com', url: 'https://teaching.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'planning', category: '핵심 플랫폼', domain: 'planning.dreamitbiz.com', url: 'https://planning.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'books', category: '출판/문서', domain: 'books.dreamitbiz.com', url: 'https://books.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'docs', category: '출판/문서', domain: 'docs.dreamitbiz.com', url: 'https://docs.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'reserve', category: '출판/문서', domain: 'reserve.dreamitbiz.com', url: 'https://reserve.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'openclaw', category: '출판/문서', domain: 'openclaw.dreamitbiz.com', url: 'https://openclaw.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'presentation', category: '출판/문서', domain: 'presentation.dreamitbiz.com', url: 'https://presentation.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'aebon', category: '개인/포트폴리오', domain: 'aebon.dreamitbiz.com', url: 'https://aebon.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'jdy', category: '개인/포트폴리오', domain: 'jdy.dreamitbiz.com', url: 'https://jdy.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'wonjunjang', category: '개인/포트폴리오', domain: 'wonjunjang.dreamitbiz.com', url: 'https://wonjunjang.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'hohai', category: '개인/포트폴리오', domain: 'hohai.dreamitbiz.com', url: 'https://hohai.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'pbirobot', category: '로봇/IoT/BI', domain: 'pbirobot.dreamitbiz.com', url: 'https://pbirobot.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'pbi', category: '로봇/IoT/BI', domain: 'pbi.dreamitbiz.com', url: 'https://pbi.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'koreait', category: '로봇/IoT/BI', domain: 'koreait.dreamitbiz.com', url: 'https://koreait.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'jobpath', category: '취업/경력', domain: 'jobpath.dreamitbiz.com', url: 'https://jobpath.dreamitbiz.com', color: 'red', hasPayment: true, ordersTable: 'forjob_orders', ordersSite: 'jobpath' },
  { name: 'jobexam', category: '취업/경력', domain: 'jobexam.dreamitbiz.com', url: 'https://jobexam.dreamitbiz.com', color: 'green', hasPayment: true, ordersTable: 'jobexam_orders', ordersSite: 'jobexam' },
  { name: 'www', category: '취업/경력', domain: 'www.dreamitbiz.com', url: 'https://www.dreamitbiz.com', color: 'yellow', hasPayment: true, ordersTable: 'orders', ordersSite: 'www' },
  { name: 'instructor', category: '강사', domain: 'instructor.dreamitbiz.com', url: 'https://instructor.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'survey', category: '연구/학술', domain: 'survey.dreamitbiz.com', url: 'https://survey.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'esg', category: '연구/학술', domain: 'esg.dreamitbiz.com', url: 'https://esg.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'accounting', category: '연구/학술', domain: 'accounting.dreamitbiz.com', url: 'https://accounting.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'aws', category: '클라우드/DevOps', domain: 'aws.dreamitbiz.com', url: 'https://aws.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'study', category: '학습법/안전', domain: 'study.dreamitbiz.com', url: 'https://study.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'safety', category: '학습법/안전', domain: 'safety.dreamitbiz.com', url: 'https://safety.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'statistics', category: '학습법/안전', domain: 'statistics.dreamitbiz.com', url: 'https://statistics.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'ai-free', category: '2026 신규·회사·교보재', domain: 'ai-free.dreamitbiz.com', url: 'https://ai-free.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'ai-literacy', category: '2026 신규·회사·교보재', domain: 'ai-literacy.dreamitbiz.com', url: 'https://ai-literacy.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'aice', category: '2026 신규·회사·교보재', domain: 'aice.dreamitbiz.com', url: 'https://aice.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'ax-study', category: '2026 신규·회사·교보재', domain: 'ax-study.dreamitbiz.com', url: 'https://ax-study.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'ax', category: '2026 신규·회사·교보재', domain: 'ax.dreamitbiz.com', url: 'https://ax.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'basic-ai', category: '2026 신규·회사·교보재', domain: 'basic-ai.dreamitbiz.com', url: 'https://basic-ai.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'cnu', category: '대학·기업 납품', domain: 'cnu.dreamitbiz.com', url: 'https://cnu.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'codex', category: '2026 신규·회사·교보재', domain: 'codex.dreamitbiz.com', url: 'https://codex.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'contents', category: '대학·기업 납품', domain: 'contents.dreamitbiz.com', url: 'https://contents.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'dasco', category: '대학·기업 납품', domain: 'dasco.dreamitbiz.com', url: 'https://dasco.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'data', category: '대학·기업 납품', domain: 'data.dreamitbiz.com', url: 'https://data.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'full-stack', category: '2026 신규·회사·교보재', domain: 'full-stack.dreamitbiz.com', url: 'https://full-stack.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'halla', category: '대학·기업 납품', domain: 'halla.dreamitbiz.com', url: 'https://halla.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'harness-study', category: '2026 신규·회사·교보재', domain: 'harness-study.dreamitbiz.com', url: 'https://harness-study.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'hrm', category: '2026 신규·회사·교보재', domain: 'hrm.dreamitbiz.com', url: 'https://hrm.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'hwp', category: '2026 신규·회사·교보재', domain: 'hwp.dreamitbiz.com', url: 'https://hwp.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'kdn2026', category: '대학·기업 납품', domain: 'kdn2026.dreamitbiz.com', url: 'https://kdn2026.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'knc', category: '대학·기업 납품', domain: 'knc.dreamitbiz.com', url: 'https://knc.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'komipo', category: '대학·기업 납품', domain: 'komipo.dreamitbiz.com', url: 'https://komipo.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'manus', category: '2026 신규·회사·교보재', domain: 'manus.dreamitbiz.com', url: 'https://manus.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'notebooklm', category: '2026 신규·회사·교보재', domain: 'notebooklm.dreamitbiz.com', url: 'https://notebooklm.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'ppt-maker', category: '2026 신규·회사·교보재', domain: 'ppt-maker.dreamitbiz.com', url: 'https://ppt-maker.dreamitbiz.com', color: 'red', hasPayment: true },
  { name: 'ppt', category: '2026 신규·회사·교보재', domain: 'ppt.dreamitbiz.com', url: 'https://ppt.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'project', category: '2026 신규·회사·교보재', domain: 'project.dreamitbiz.com', url: 'https://project.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'research', category: '2026 신규·회사·교보재', domain: 'research.dreamitbiz.com', url: 'https://research.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'rest', category: '2026 신규·회사·교보재', domain: 'rest.dreamitbiz.com', url: 'https://rest.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'rest01', category: '2026 신규·회사·교보재', domain: 'rest01.dreamitbiz.com', url: 'https://rest01.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'rest02', category: '2026 신규·회사·교보재', domain: 'rest02.dreamitbiz.com', url: 'https://rest02.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'rest03', category: '2026 신규·회사·교보재', domain: 'rest03.dreamitbiz.com', url: 'https://rest03.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'rest04', category: '2026 신규·회사·교보재', domain: 'rest04.dreamitbiz.com', url: 'https://rest04.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'rest05', category: '2026 신규·회사·교보재', domain: 'rest05.dreamitbiz.com', url: 'https://rest05.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'rest06', category: '2026 신규·회사·교보재', domain: 'rest06.dreamitbiz.com', url: 'https://rest06.dreamitbiz.com', color: 'yellow', hasPayment: true },
  { name: 'rest07', category: '2026 신규·회사·교보재', domain: 'rest07.dreamitbiz.com', url: 'https://rest07.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'sangmin', category: '2026 신규·회사·교보재', domain: 'sangmin.dreamitbiz.com', url: 'https://sangmin.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'seminar', category: '2026 신규·회사·교보재', domain: 'seminar.dreamitbiz.com', url: 'https://seminar.dreamitbiz.com', color: 'red', hasPayment: true },
  { name: 'seoultech', category: '대학·기업 납품', domain: 'seoultech.dreamitbiz.com', url: 'https://seoultech.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'site', category: '2026 신규·회사·교보재', domain: 'site.dreamitbiz.com', url: 'https://site.dreamitbiz.com', color: 'blue', hasPayment: false },
  { name: 'skala', category: '대학·기업 납품', domain: 'skala.dreamitbiz.com', url: 'https://skala.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'snu', category: '대학·기업 납품', domain: 'snu.dreamitbiz.com', url: 'https://snu.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'solar', category: '2026 신규·회사·교보재', domain: 'solar.dreamitbiz.com', url: 'https://solar.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'startup', category: '2026 신규·회사·교보재', domain: 'startup.dreamitbiz.com', url: 'https://startup.dreamitbiz.com', color: 'yellow', hasPayment: true },
  { name: 'syu', category: '대학·기업 납품', domain: 'syu.dreamitbiz.com', url: 'https://syu.dreamitbiz.com', color: 'red', hasPayment: false },
  { name: 'templete03', category: '2026 신규·회사·교보재', domain: 'templete03.dreamitbiz.com', url: 'https://templete03.dreamitbiz.com', color: 'yellow', hasPayment: false },
  { name: 'university', category: '대학·기업 납품', domain: 'university.dreamitbiz.com', url: 'https://university.dreamitbiz.com', color: 'green', hasPayment: false },
  { name: 'vibe-coding', category: '2026 신규·회사·교보재', domain: 'vibe-coding.dreamitbiz.com', url: 'https://vibe-coding.dreamitbiz.com', color: 'purple', hasPayment: false },
  { name: 'web', category: '2026 신규·회사·교보재', domain: 'web.dreamitbiz.com', url: 'https://web.dreamitbiz.com', color: 'yellow', hasPayment: false },
];

export const SITE_BY_NAME: Record<string, SiteEntry> = Object.fromEntries(SITES.map(s => [s.name, s]));
export const SITE_BY_DOMAIN: Record<string, SiteEntry> = Object.fromEntries(SITES.map(s => [s.domain, s]));

/** 카테고리 메타 — 라벨·색상·표시 순서. SITES[].category가 여기 label을 참조. */
export interface CategoryMeta {
  label: string;
  color: string;
}
export const SITE_CATEGORIES: CategoryMeta[] = [
  { label: 'Hub 사이트', color: '#6366f1' },
  { label: '프로그래밍 교육', color: '#0ea5e9' },
  { label: 'IT/CS 교육', color: '#10b981' },
  { label: 'AI 교육', color: '#8b5cf6' },
  { label: 'AI 도구', color: '#f43f5e' },
  { label: '비즈니스/LMS', color: '#f59e0b' },
  { label: '어학', color: '#06b6d4' },
  { label: '자격증', color: '#84cc16' },
  { label: '핵심 플랫폼', color: '#ec4899' },
  { label: '출판/문서', color: '#64748b' },
  { label: '취업/경력', color: '#f97316' },
  { label: '개인/포트폴리오', color: '#a78bfa' },
  { label: '로봇/IoT/BI', color: '#2dd4bf' },
  { label: '강사', color: '#fb923c' },
  { label: '연구/학술', color: '#4ade80' },
  { label: '클라우드/DevOps', color: '#facc15' },
  { label: '학습법/안전', color: '#34d399' },
  { label: '대학·기업 납품', color: '#6366f1' },
  { label: '2026 신규·회사·교보재', color: '#f59e0b' },
];

export const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  SITE_CATEGORIES.map(c => [c.label, c.color])
);

/** 카테고리별 사이트 수 — 표시 순서대로(빈 카테고리 제외). 대시보드 분포·사이트현황 그룹 합계용. */
export function getCategoryCounts(): { label: string; color: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const s of SITES) counts[s.category] = (counts[s.category] || 0) + 1;
  return SITE_CATEGORIES
    .map(c => ({ label: c.label, color: c.color, count: counts[c.label] || 0 }))
    .filter(c => c.count > 0);
}

/** 이름 정규화 — ahp_basic ↔ ahp-basic 등 언더스코어/하이픈 표기 차이 흡수 */
const normName = (name: string): string => name.replace(/_/g, '-');
const SITE_BY_NORM_NAME: Record<string, SiteEntry> = Object.fromEntries(
  SITES.map(s => [normName(s.name), s])
);

/**
 * 사이트 이름으로 레지스트리 엔트리 조회(표기 차이 허용).
 * 페이지가 domain·url·hasPayment 등 사실 데이터를 직접 하드코딩하지 않고
 * 여기서 파생하도록 만들기 위한 단일 진입점.
 */
export function getSite(name: string): SiteEntry | undefined {
  return SITE_BY_NAME[name] || SITE_BY_NORM_NAME[normName(name)];
}

/**
 * 페이지가 참조하는 사이트 목록이 레지스트리(SSOT)와 일치하는지 개발 모드에서 검사.
 * 새 사이트를 siteRegistry에만 추가하고 페이지 동기화를 빠뜨리면 콘솔 경고로 즉시 드러남.
 */
export function assertSiteCoverage(label: string, names: string[]): void {
  if (!import.meta.env?.DEV) return;
  const reg = new Set(SITES.map(s => normName(s.name)));
  const page = new Set(names.map(normName));
  const missing = [...reg].filter(n => !page.has(n));
  const extra = [...page].filter(n => !reg.has(n));
  if (missing.length)
    console.warn(`[siteRegistry] ${label}: 레지스트리에 있으나 누락(${missing.length}) → ${missing.join(', ')}`);
  if (extra.length)
    console.warn(`[siteRegistry] ${label}: 레지스트리에 없는 항목(${extra.length}) → ${extra.join(', ')}`);
}

/**
 * sites.ts — 사이트 옵션/이름/색상 공유 상수
 */

export const SITE_OPTIONS = [
  // 핵심 사이트
  { value: 'www.dreamitbiz.com', label: 'www', color: 'yellow' },
  { value: 'hohai.dreamitbiz.com', label: 'hohai', color: 'blue' },
  { value: 'books.dreamitbiz.com', label: 'books', color: 'green' },
  { value: 'docs.dreamitbiz.com', label: 'docs', color: 'green' },
  { value: 'papers.dreamitbiz.com', label: 'papers', color: 'purple' },
  { value: 'pbi.dreamitbiz.com', label: 'pbi', color: 'yellow' },
  { value: 'aebon.dreamitbiz.com', label: 'aebon', color: 'blue' },
  // AI Hub & AI 학습 사이트 (11개)
  { value: 'ai-hub.dreamitbiz.com', label: 'ai-hub', color: 'red' },
  { value: 'chatgpt.dreamitbiz.com', label: 'chatgpt', color: 'green' },
  { value: 'gemini.dreamitbiz.com', label: 'gemini', color: 'blue' },
  { value: 'genspark.dreamitbiz.com', label: 'genspark', color: 'purple' },
  { value: 'claude.dreamitbiz.com', label: 'claude', color: 'yellow' },
  { value: 'openclaw.dreamitbiz.com', label: 'openclaw', color: 'green' },
  { value: 'aI-agents.dreamitbiz.com', label: 'aI-agents', color: 'red' },
  { value: 'ai-media.dreamitbiz.com', label: 'ai-media', color: 'purple' },
  { value: 'autowork.dreamitbiz.com', label: 'autowork', color: 'blue' },
  { value: 'fine-tuning.dreamitbiz.com', label: 'fine-tuning', color: 'green' },
  // AI/데이터
  { value: 'ai-prompt.dreamitbiz.com', label: 'ai-prompt', color: 'purple' },
  { value: 'ai-data.dreamitbiz.com', label: 'ai-data', color: 'purple' },
  // 교육 플랫폼
  { value: 'edu-hub.dreamitbiz.com', label: 'edu-hub', color: 'purple' },
  { value: 'allthat.dreamitbiz.com', label: 'allthat', color: 'green' },
  { value: 'koreatech.dreamitbiz.com', label: 'koreatech', color: 'purple' },
  { value: 'koreait.dreamitbiz.com', label: 'koreait', color: 'blue' },
  { value: 'competency.dreamitbiz.com', label: 'competency', color: 'purple' },
  { value: 'teaching.dreamitbiz.com', label: 'teaching', color: 'green' },
  // 프로그래밍 교육
  { value: 'coding.dreamitbiz.com', label: 'coding', color: 'blue' },
  { value: 'html.dreamitbiz.com', label: 'html', color: 'blue' },
  { value: 'python-study.dreamitbiz.com', label: 'python-study', color: 'blue' },
  { value: 'java-study.dreamitbiz.com', label: 'java-study', color: 'red' },
  { value: 'c-study.dreamitbiz.com', label: 'c-study', color: 'blue' },
  { value: 'linux-study.dreamitbiz.com', label: 'linux-study', color: 'yellow' },
  { value: 'software.dreamitbiz.com', label: 'software', color: 'green' },
  // IT/자격증
  { value: 'eip.dreamitbiz.com', label: 'eip', color: 'red' },
  { value: 'sqld.dreamitbiz.com', label: 'sqld', color: 'purple' },
  { value: 'ahp-basic.dreamitbiz.com', label: 'ahp-basic', color: 'red' },
  { value: 'jobpath.dreamitbiz.com', label: 'jobpath', color: 'red' },
  { value: 'planning.dreamitbiz.com', label: 'planning', color: 'green' },
  // 비즈니스/마케팅
  { value: 'marketing.dreamitbiz.com', label: 'marketing', color: 'yellow' },
  { value: 'digitalbiz.dreamitbiz.com', label: 'digitalbiz', color: 'green' },
  { value: 'self-branding.dreamitbiz.com', label: 'self-branding', color: 'yellow' },
  { value: 'uxdesign.dreamitbiz.com', label: 'uxdesign', color: 'purple' },
  { value: 'career.dreamitbiz.com', label: 'career', color: 'green' },
  // 어학
  { value: 'english.dreamitbiz.com', label: 'english', color: 'blue' },
  { value: 'japanese.dreamitbiz.com', label: 'japanese', color: 'red' },
  { value: 'korean.dreamitbiz.com', label: 'korean', color: 'green' },
  // 기타
  { value: 'reserve.dreamitbiz.com', label: 'reserve', color: 'red' },
  { value: 'algorithm.dreamitbiz.com', label: 'algorithm', color: 'blue' },
  { value: 'webstudy.dreamitbiz.com', label: 'webstudy', color: 'green' },
  { value: 'reactstudy.dreamitbiz.com', label: 'reactstudy', color: 'blue' },
];

const SITE_COLOR_MAP: Record<string, string> = {
  www: 'yellow', hohai: 'blue', books: 'green', docs: 'green',
  papers: 'purple', pbi: 'yellow', aebon: 'blue',
  'ai-hub': 'red', chatgpt: 'green', gemini: 'blue', genspark: 'purple',
  claude: 'yellow', openclaw: 'green', 'aI-agents': 'red',
  'ai-media': 'purple', autowork: 'blue', 'fine-tuning': 'green',
  'ai-prompt': 'purple', 'ai-data': 'purple',
  'edu-hub': 'purple', allthat: 'green', koreatech: 'purple',
  koreait: 'blue', competency: 'purple', teaching: 'green',
  coding: 'blue', html: 'blue', 'python-study': 'blue',
  'java-study': 'red', 'c-study': 'blue', 'linux-study': 'yellow',
  software: 'green', eip: 'red', sqld: 'purple', 'ahp-basic': 'red',
  jobpath: 'red', planning: 'green',
  marketing: 'yellow', digitalbiz: 'green', 'self-branding': 'yellow',
  uxdesign: 'purple', career: 'green',
  english: 'blue', japanese: 'red', korean: 'green',
  reserve: 'red', algorithm: 'blue', webstudy: 'green',
  reactstudy: 'blue', localhost: 'gray',
};

/** signup_domain에서 사이트 이름 추출 — 예: hohai.dreamitbiz.com → hohai */
export function getSiteName(domain: string | null | undefined): string {
  if (!domain) return '-';
  const d = domain.toLowerCase();
  if (d.endsWith('.dreamitbiz.com')) {
    const sub = d.replace('.dreamitbiz.com', '');
    return sub || 'www';
  }
  if (d === 'dreamitbiz.com' || d === 'www.dreamitbiz.com') return 'www';
  if (d.includes('localhost') || d.includes('127.0.0.1')) return 'localhost';
  return d;
}

/** 사이트별 뱃지 색상 */
export function getSiteColor(siteName: string): string {
  return SITE_COLOR_MAP[siteName] || 'gray';
}

/**
 * HeroBackground — 슬라이드 우측 정보형 SVG 일러스트(주제별 개별 씬).
 * 공통 프레임(블롭·링·스파크)과 AI 코어는 통일 스타일로 재사용하되,
 * 각 슬라이드는 주제에 맞는 서로 다른 장면으로 구성한다.
 *   0 종합=서비스 허브 / 1 웹=브라우저+코드 / 2 컨설팅=성장 그래프
 *   3 교육=모니터+학사모 / 4 출판=문서→책
 * HeroCarousel이 텍스트와 같은 2단 그리드에 배치하기 위해 export.
 */

type Props = { slideIndex: number; isActive: boolean };

// 공통 배경 프레임(블롭 + 동심원 링)
const Frame = () => (
  <>
    <ellipse className="hero-blob" cx="270" cy="235" rx="220" ry="205" />
    <circle className="hero-ring hero-ring-1" cx="270" cy="235" r="150" />
    <circle className="hero-ring hero-ring-2" cx="270" cy="235" r="188" />
  </>
);

// 공통 스파크(작은 점 반짝임)
const Accents = () => (
  <>
    <circle className="hero-spark s1" cx="408" cy="118" r="4.5" />
    <circle className="hero-spark s2" cx="126" cy="150" r="3.5" />
    <circle className="hero-spark s3" cx="402" cy="332" r="3.5" />
  </>
);

// AI 코어(위치 자유) — 궤도 + 코어 + 궤도점 + 'AI' 라벨
const AiCore = ({ cx, cy, r = 26 }: { cx: number; cy: number; r?: number }) => {
  const x = +cx, y = +cy, rr = +r;   // 문자열 prop 방어(+ 연산 문자열 연결 방지)
  return (
    <g className="hero-ai">
      <circle className="ai-orbit" cx={x} cy={y} r={rr + 13} />
      <circle className="ai-core" cx={x} cy={y} r={rr} />
      <circle className="ai-orbit-dot" cx={x} cy={y - (rr + 13)} r="4.5" />
      <circle className="ai-orbit-dot s2" cx={x + (rr + 13)} cy={y} r="3.5" />
      <text className="ai-label" x={x} y={y + rr * 0.28} textAnchor="middle" fontSize={rr * 0.66}>AI</text>
    </g>
  );
};

export const HERO_ILLUSTRATIONS = [
  // ── 0 종합 IT: 서비스 허브 (유지) ─────────────────────────────
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="0">
      <Frame />
      <g className="hero-link">
        <line x1="270" y1="235" x2="121" y2="119" />
        <line x1="270" y1="235" x2="423" y2="119" />
        <line x1="270" y1="235" x2="121" y2="353" />
        <line x1="270" y1="235" x2="423" y2="353" />
      </g>
      <g className="hero-node"><rect x="58" y="96" width="126" height="46" rx="13" /><text className="node-label" x="121" y="124" textAnchor="middle">웹개발</text></g>
      <g className="hero-node"><rect x="360" y="96" width="126" height="46" rx="13" /><text className="node-label" x="423" y="124" textAnchor="middle">컨설팅</text></g>
      <g className="hero-node"><rect x="58" y="330" width="126" height="46" rx="13" /><text className="node-label" x="121" y="358" textAnchor="middle">교육</text></g>
      <g className="hero-node"><rect x="360" y="330" width="126" height="46" rx="13" /><text className="node-label" x="423" y="358" textAnchor="middle">출판</text></g>
      <g className="hero-hub hero-card-in"><rect x="200" y="205" width="140" height="56" rx="16" /><text className="hub-label" x="270" y="240" textAnchor="middle">DreamIT</text></g>
      <Accents />
    </svg>
  ),

  // ── 1 웹개발: 브라우저 창 + 코드 </> + 반응형 목업 ─────────────
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="1">
      <Frame />
      {/* 데스크톱 브라우저 창 */}
      <g className="hero-card hero-card-out">
        <rect x="70" y="128" width="322" height="236" rx="18" />
        <rect className="card-head-out" x="70" y="128" width="322" height="42" rx="18" />
        <circle cx="94" cy="149" r="4.5" fill="#fff" /><circle cx="112" cy="149" r="4.5" fill="#fff" /><circle cx="130" cy="149" r="4.5" fill="#fff" />
        <rect x="158" y="141" width="210" height="16" rx="8" fill="rgba(255,255,255,0.28)" />
        {/* 코드 </> */}
        <path d="M150 250 l-28 26 28 26" fill="none" stroke="#0046C8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M300 250 l28 26 -28 26" fill="none" stroke="#0046C8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="205" y1="308" x2="245" y2="244" stroke="#93C5FD" strokeWidth="5.5" strokeLinecap="round" />
        <rect className="card-line-out" x="110" y="330" width="150" height="10" rx="5" />
        <rect className="card-line-out dim" x="110" y="348" width="104" height="10" rx="5" />
      </g>
      {/* 반응형 모바일 목업 */}
      <g className="hero-card hero-card-in">
        <rect x="352" y="238" width="92" height="152" rx="15" />
        <rect className="card-head" x="352" y="238" width="92" height="24" rx="15" />
        <rect className="card-line" x="368" y="292" width="60" height="8" rx="4" />
        <rect className="card-line" x="368" y="310" width="46" height="8" rx="4" />
        <rect className="card-line" x="368" y="328" width="60" height="8" rx="4" />
      </g>
      <AiCore cx="432" cy="104" r="24" />
      <Accents />
    </svg>
  ),

  // ── 2 컨설팅: 성장 그래프(막대 + 꺾은선) 강조 ──────────────────
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="2">
      <Frame />
      <g className="hero-card hero-card-out">
        <rect x="78" y="120" width="326" height="250" rx="18" />
        <rect className="card-head-out" x="78" y="120" width="326" height="40" rx="18" />
        <rect x="100" y="134" width="80" height="12" rx="6" fill="rgba(255,255,255,0.4)" />
        {/* 축 */}
        <line x1="118" y1="188" x2="118" y2="336" stroke="#CBD5E1" strokeWidth="2" />
        <line x1="118" y1="336" x2="378" y2="336" stroke="#CBD5E1" strokeWidth="2" />
        {/* 상승 막대 (style로 fill — CSS의 .hero-card rect{fill:#fff} 우선 방지) */}
        <rect x="142" y="296" width="30" height="40" rx="4" style={{ fill: '#BFDBFE' }} />
        <rect x="190" y="268" width="30" height="68" rx="4" style={{ fill: '#93C5FD' }} />
        <rect x="238" y="236" width="30" height="100" rx="4" style={{ fill: '#60A5FA' }} />
        <rect x="286" y="204" width="30" height="132" rx="4" style={{ fill: '#3B82F6' }} />
        <rect x="334" y="180" width="30" height="156" rx="4" style={{ fill: '#2563EB' }} />
        {/* 꺾은선 오버레이 */}
        <path d="M157 286 L205 258 L253 226 L301 194 L349 170" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="157" cy="286" r="4" fill="#fff" /><circle cx="253" cy="226" r="4" fill="#fff" /><circle cx="349" cy="170" r="4.5" fill="#fff" />
        {/* 상승 화살표 */}
        <path d="M342 162 h18 v18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* +% 뱃지 */}
      <g className="hero-hub hero-card-in"><rect x="392" y="196" width="86" height="42" rx="12" /><text className="hub-label" x="435" y="223" textAnchor="middle" style={{ fontSize: 17 }}>+58%</text></g>
      <AiCore cx="432" cy="108" r="24" />
      <Accents />
    </svg>
  ),

  // ── 3 교육: 모니터 + 학사모 ────────────────────────────────────
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="3">
      <Frame />
      {/* 모니터 */}
      <g className="hero-card hero-card-out">
        <rect x="112" y="168" width="300" height="196" rx="16" />
        <rect className="card-head-out" x="112" y="168" width="300" height="16" rx="8" />
        {/* 재생 버튼 */}
        <circle cx="262" cy="268" r="38" fill="rgba(147,197,253,0.28)" stroke="#93C5FD" strokeWidth="2.5" />
        <path d="M251 250 l26 18 -26 18 z" fill="#fff" />
        <rect className="card-line-out" x="180" y="330" width="164" height="9" rx="4.5" />
      </g>
      {/* 스탠드 */}
      <rect x="250" y="364" width="24" height="22" rx="2" fill="#fff" />
      <rect x="214" y="386" width="96" height="11" rx="5.5" fill="#fff" />
      {/* 학사모(세련) */}
      <g>
        <path d="M262 84 l74 27 -74 27 -74 -27 z" fill="#0046C8" stroke="#93C5FD" strokeWidth="2" strokeLinejoin="round" />
        <path d="M214 126 v26 c0 13 96 13 96 0 v-26" fill="#002E8A" stroke="#93C5FD" strokeWidth="1.5" />
        <path d="M336 111 v40" fill="none" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="336" cy="156" r="6" fill="#93C5FD" />
      </g>
      <AiCore cx="438" cy="214" r="24" />
      <Accents />
    </svg>
  ),

  // ── 4 출판: 문서 → 책(전자출판) ────────────────────────────────
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="4">
      <Frame />
      {/* 원고 문서(좌) */}
      <g className="hero-card hero-card-in">
        <rect x="66" y="176" width="140" height="176" rx="14" />
        <rect className="card-head" x="66" y="176" width="140" height="28" rx="14" />
        <rect className="card-line" x="84" y="228" width="102" height="9" rx="4.5" />
        <rect className="card-line" x="84" y="250" width="86" height="9" rx="4.5" />
        <rect className="card-line" x="84" y="272" width="104" height="9" rx="4.5" />
        <rect className="card-line" x="84" y="294" width="74" height="9" rx="4.5" />
        <rect className="card-line" x="84" y="316" width="94" height="9" rx="4.5" />
      </g>
      {/* 흐름 */}
      <path className="hero-flow" d="M214 264 H244" />
      <path className="hero-flow-arrow" d="M238 257 L248 264 L238 271" />
      {/* 책(우) */}
      <g className="hero-card hero-card-out">
        <rect x="330" y="182" width="150" height="196" rx="14" />
        <rect className="card-head-out" x="330" y="182" width="150" height="32" rx="14" />
        <rect x="360" y="238" width="90" height="112" rx="6" style={{ fill: '#93C5FD' }} />
        <line x1="384" y1="238" x2="384" y2="350" stroke="#0046C8" strokeWidth="2.5" opacity="0.5" />
        <rect className="card-line-out dim" x="396" y="258" width="40" height="8" rx="4" />
        <rect className="card-line-out dim" x="396" y="276" width="32" height="8" rx="4" />
        <rect className="card-line-out dim" x="396" y="294" width="40" height="8" rx="4" />
      </g>
      <AiCore cx="272" cy="120" r="24" />
      <Accents />
    </svg>
  ),
];

// 배경 레이어(carousel-slide 안)는 글로우만 담당
const HeroBackground = ({ slideIndex }: Props) => (
  <div className="hero-bg-effect" aria-hidden="true">
    <div className={`hero-glow hero-glow--${slideIndex}`} />
  </div>
);

export default HeroBackground;

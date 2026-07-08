/**
 * HeroBackground — 슬라이드 우측 정보형 SVG 일러스트.
 * university 히어로 스타일(솔리드 흰 카드 + AI 코어 + 블롭·링·스파크·플로우)을
 * 파란 테마로 이식. 슬라이드마다 "입력 → AI → 결과" 스토리를 주제별로 표현.
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

// 공통 스파크 + 떠다니는 미니 아이콘
const Accents = () => (
  <>
    <circle className="hero-spark s1" cx="410" cy="120" r="4.5" />
    <circle className="hero-spark s2" cx="120" cy="150" r="3.5" />
    <circle className="hero-spark s3" cx="400" cy="330" r="3.5" />
    <g className="hero-float f1">
      <rect x="96" y="88" width="44" height="44" rx="12" />
      <path className="mini-icon" d="M108 104 h20 M108 111 h15 M108 118 h20" />
    </g>
    <g className="hero-float f2">
      <rect x="398" y="372" width="48" height="48" rx="13" />
      <path className="mini-check" d="M410 396 l7 7 13-15" />
    </g>
  </>
);

// AI 처리 코어(중앙 상단)
const AiCore = () => (
  <g className="hero-ai">
    <circle className="ai-orbit" cx="270" cy="128" r="42" />
    <circle className="ai-core" cx="270" cy="128" r="28" />
    <g className="ai-orbit-spin">
      <circle className="ai-orbit-dot" cx="270" cy="86" r="5" />
      <circle className="ai-orbit-dot" cx="270" cy="170" r="3.5" />
    </g>
    <text className="ai-label" x="270" y="134" textAnchor="middle">AI</text>
  </g>
);

// 좌측 입력 카드(공통 골격) — lines: 라인 개수
const InputCard = () => (
  <g className="hero-card hero-card-in">
    <rect x="58" y="168" width="146" height="182" rx="14" />
    <rect className="card-head" x="58" y="168" width="146" height="30" rx="14" />
    <rect className="card-line" x="78" y="220" width="106" height="9" rx="4.5" />
    <rect className="card-line" x="78" y="242" width="90" height="9" rx="4.5" />
    <rect className="card-line" x="78" y="264" width="108" height="9" rx="4.5" />
    <rect className="card-line" x="78" y="286" width="76" height="9" rx="4.5" />
    <rect className="card-line" x="78" y="308" width="96" height="9" rx="4.5" />
  </g>
);

// 입력 → 출력 흐름 화살표
const Flow = () => (
  <>
    <path className="hero-flow" d="M212 258 H236" />
    <path className="hero-flow-arrow" d="M230 251 L240 258 L230 265" />
    <path className="hero-flow" d="M304 258 H328" />
    <path className="hero-flow-arrow" d="M322 251 L332 258 L322 265" />
  </>
);

export const HERO_ILLUSTRATIONS = [
  // 0 — 종합 IT 솔루션: 중앙 허브 + 4개 서비스 노드
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="0">
      <Frame />
      <g className="hero-link">
        <line x1="270" y1="235" x2="145" y2="118" />
        <line x1="270" y1="235" x2="395" y2="118" />
        <line x1="270" y1="235" x2="145" y2="352" />
        <line x1="270" y1="235" x2="395" y2="352" />
      </g>
      <g className="hero-node n1"><rect x="82" y="96" width="126" height="46" rx="13" /><text className="node-label" x="145" y="124" textAnchor="middle">웹개발</text></g>
      <g className="hero-node n2"><rect x="332" y="96" width="126" height="46" rx="13" /><text className="node-label" x="395" y="124" textAnchor="middle">컨설팅</text></g>
      <g className="hero-node n3"><rect x="82" y="330" width="126" height="46" rx="13" /><text className="node-label" x="145" y="358" textAnchor="middle">교육</text></g>
      <g className="hero-node n4"><rect x="332" y="330" width="126" height="46" rx="13" /><text className="node-label" x="395" y="358" textAnchor="middle">출판</text></g>
      <g className="hero-hub hero-card-in"><rect x="200" y="205" width="140" height="56" rx="16" /><text className="hub-label" x="270" y="240" textAnchor="middle">DreamIT</text></g>
      <Accents />
    </svg>
  ),

  // 1 — 웹개발·호스팅·디자인: 와이어프레임 → AI → 런칭된 사이트
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="1">
      <Frame />
      <InputCard />
      <Flow />
      <AiCore />
      <g className="hero-card hero-card-out">
        <rect x="336" y="182" width="150" height="196" rx="14" />
        <rect className="card-head-out" x="336" y="182" width="150" height="32" rx="14" />
        <circle cx="352" cy="196" r="2.6" fill="#fff" /><circle cx="362" cy="196" r="2.6" fill="#fff" /><circle cx="372" cy="196" r="2.6" fill="#fff" />
        <rect className="card-line-out" x="356" y="236" width="110" height="9" rx="4.5" />
        <rect className="card-line-out" x="356" y="258" width="86" height="9" rx="4.5" />
        <rect className="card-line-out dim" x="356" y="292" width="130" height="46" rx="8" />
      </g>
      <Accents />
    </svg>
  ),

  // 2 — 연구개발·컨설팅: 데이터 → AI → 성장 막대차트
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="2">
      <Frame />
      <InputCard />
      <Flow />
      <AiCore />
      <g className="hero-card hero-card-out">
        <rect x="336" y="182" width="150" height="196" rx="14" />
        <rect className="card-head-out" x="336" y="182" width="150" height="32" rx="14" />
        {/* 상승 막대차트 */}
        <rect className="card-line-out" x="360" y="320" width="18" height="34" rx="3" />
        <rect className="card-line-out" x="388" y="300" width="18" height="54" rx="3" />
        <rect className="card-line-out" x="416" y="276" width="18" height="78" rx="3" />
        <rect className="card-line-out" x="444" y="248" width="18" height="106" rx="3" />
        <path className="hero-flow-arrow" d="M356 316 L400 292 L432 268 L470 240" style={{ strokeDasharray: 'none' }} />
        <path className="hero-flow-arrow" d="M456 236 h16 v16" />
      </g>
      <Accents />
    </svg>
  ),

  // 3 — 교육: 교재 → AI → 수료증(체크)
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="3">
      <Frame />
      <InputCard />
      <Flow />
      <AiCore />
      <g className="hero-card hero-card-out">
        <rect x="336" y="182" width="150" height="196" rx="14" />
        <rect className="card-head-out" x="336" y="182" width="150" height="32" rx="14" />
        <g><circle cx="362" cy="244" r="9" fill="#93C5FD" /><path d="M358 244 l3 3 5 -6" fill="none" stroke="#0046C8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>
        <rect className="card-line-out" x="380" y="239" width="90" height="9" rx="4.5" />
        <g><circle cx="362" cy="278" r="9" fill="#93C5FD" /><path d="M358 278 l3 3 5 -6" fill="none" stroke="#0046C8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>
        <rect className="card-line-out" x="380" y="273" width="76" height="9" rx="4.5" />
        <g><circle cx="362" cy="312" r="9" fill="#93C5FD" /><path d="M358 312 l3 3 5 -6" fill="none" stroke="#0046C8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g>
        <rect className="card-line-out" x="380" y="307" width="88" height="9" rx="4.5" />
        <rect className="card-line-out dim" x="362" y="340" width="106" height="8" rx="4" />
      </g>
      <Accents />
    </svg>
  ),

  // 4 — 출판: 원고 → AI → 책(전자출판)
  (
    <svg viewBox="0 0 540 470" className="hero-svg" key="4">
      <Frame />
      <InputCard />
      <Flow />
      <AiCore />
      <g className="hero-card hero-card-out">
        <rect x="336" y="182" width="150" height="196" rx="14" />
        <rect className="card-head-out" x="336" y="182" width="150" height="32" rx="14" />
        {/* 책 표지 + 페이지 */}
        <rect x="372" y="232" width="78" height="104" rx="6" fill="#93C5FD" />
        <line x1="392" y1="232" x2="392" y2="336" stroke="#0046C8" strokeWidth="2" opacity="0.5" />
        <rect className="card-line-out dim" x="404" y="250" width="34" height="7" rx="3.5" />
        <rect className="card-line-out dim" x="404" y="266" width="28" height="7" rx="3.5" />
        <rect className="card-line-out dim" x="404" y="282" width="34" height="7" rx="3.5" />
      </g>
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

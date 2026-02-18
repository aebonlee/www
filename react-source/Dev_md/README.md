# DreamIT Biz - React SPA

**마지막 업데이트**: 2026-02-18 20:35 KST

---

## 프로젝트 개요

DreamIT Biz(드림아이티비즈)의 공식 기업 웹사이트. React 19 기반 SPA로 구축되었으며, IT서비스, 교육, 출판 3개 핵심 사업 영역을 각각 독립 메뉴로 제공합니다.

### 기술 스택
- **Frontend**: React 19.2.0, React Router DOM 7.13.0
- **Build**: Vite 7.3.1
- **Styling**: CSS Variables + Custom CSS (다크모드 지원)
- **i18n**: Custom Context API (한국어/영어)
- **Deploy**: HashRouter 기반 정적 배포

---

## 디렉토리 구조

```
D:/www/react-source/
├── src/
│   ├── App.jsx                          # 메인 라우터 (16개 라우트)
│   ├── main.jsx                         # 엔트리 포인트
│   ├── index.css                        # 마스터 스타일시트
│   │
│   ├── pages/                           # 페이지 컴포넌트 (15개)
│   │   ├── Home.jsx                     # 홈 랜딩
│   │   ├── Services.jsx                 # IT서비스 목록 (4개)
│   │   ├── ServiceDetail.jsx            # IT서비스 상세
│   │   ├── Education.jsx                # 교육 랜딩
│   │   ├── EducationCustom.jsx          # 맞춤 강의 상세
│   │   ├── Classroom.jsx                # 온라인 강의실
│   │   ├── Publishing.jsx               # 출판 랜딩
│   │   ├── PublishingEbook.jsx          # 전자출판
│   │   ├── PublishingPeriodical.jsx     # 간행물
│   │   ├── PublishingBook.jsx           # 도서 출판
│   │   ├── Portfolio.jsx                # 포트폴리오
│   │   ├── About.jsx                    # 회사소개
│   │   ├── Blog.jsx                     # 블로그
│   │   ├── Board.jsx                    # 게시판
│   │   └── Contact.jsx                  # 연락처
│   │
│   ├── components/layout/
│   │   ├── Navbar.jsx                   # 네비게이션 (8개 메뉴)
│   │   └── Footer.jsx                   # 푸터
│   │
│   ├── components/
│   │   ├── CTA.jsx                      # Call-to-Action 섹션
│   │   ├── Particles.jsx                # 파티클 애니메이션
│   │   └── ScrollIndicator.jsx          # 스크롤 인디케이터
│   │
│   ├── contexts/
│   │   ├── ThemeContext.jsx             # 다크/라이트 테마
│   │   └── LanguageContext.jsx          # 한/영 번역
│   │
│   ├── hooks/
│   │   ├── useAOS.js                    # 스크롤 애니메이션
│   │   └── useCountUp.js               # 숫자 카운트업
│   │
│   ├── data/
│   │   ├── serviceDetails.js            # IT서비스 데이터 (4개)
│   │   ├── educationDetails.js          # 교육 데이터
│   │   └── publishingDetails.js         # 출판 데이터
│   │
│   ├── utils/
│   │   └── translations.js              # i18n 번역 (ko/en)
│   │
│   └── styles/
│       ├── base.css                     # 기본 변수 및 스타일
│       ├── navbar.css                   # 네비게이션
│       ├── hero.css                     # 히어로 섹션
│       ├── services.css                 # 서비스 그리드
│       ├── education.css                # 교육/출판/게시판
│       ├── portfolio.css                # 포트폴리오
│       ├── about.css                    # 회사소개
│       ├── contact.css                  # 연락처
│       ├── blog.css                     # 블로그
│       ├── footer.css                   # 푸터
│       ├── cta.css                      # CTA
│       ├── animations.css               # AOS 애니메이션
│       ├── dark-mode.css                # 다크모드
│       └── responsive.css               # 반응형 (4 브레이크포인트)
│
├── Dev_md/                              # 개발 문서
│   ├── README.md                        # 이 파일
│   ├── CLAUDE.md                        # AI 개발 가이드
│   └── Plan_2026-02-18.md              # 메뉴 재구조화 계획서
│
├── public/assets/images/                # 정적 자산
├── package.json
├── vite.config.js
└── index.html
```

---

## 메뉴 구조

```
홈 | IT서비스▼ | 교육▼ | 출판▼ | 포트폴리오▼ | 커뮤니티▼ | 회사소개▼ | 연락처
     ├─ 웹개발     ├─ 맞춤강의   ├─ 전자출판  ├─ 세종대     ├─ 블로그     ├─ 회사개요
     ├─ 웹호스팅   └─ 온라인강의실 ├─ 간행물   ├─ 진주교대   └─ 게시판     ├─ 비전
     ├─ 디자인                     └─ 책        └─ 프로젝트                  └─ 연혁
     └─ 컨설팅
```

---

## 라우트 맵

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | 홈 랜딩페이지 |
| `/services` | Services | IT서비스 목록 (4개) |
| `/services/:serviceType` | ServiceDetail | IT서비스 상세 |
| `/education` | Education | 교육 랜딩 |
| `/education/custom` | EducationCustom | 맞춤 강의 상세 |
| `/education/classroom` | Classroom | 온라인 강의실 |
| `/publishing` | Publishing | 출판 랜딩 |
| `/publishing/ebook` | PublishingEbook | 전자출판 |
| `/publishing/periodical` | PublishingPeriodical | 간행물 |
| `/publishing/book` | PublishingBook | 도서 출판 |
| `/portfolio` | Portfolio | 포트폴리오 |
| `/about` | About | 회사소개 |
| `/community/blog` | Blog | 블로그 |
| `/community/board` | Board | 게시판 |
| `/blog` | → /community/blog | 레거시 리다이렉트 |
| `/contact` | Contact | 연락처 |

---

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 반응형 브레이크포인트

| 범위 | 설명 |
|------|------|
| 1101px+ | 데스크탑 (전체 메뉴 표시) |
| 768px ~ 1100px | 태블릿 (모바일 메뉴 전환, 2열 그리드) |
| 481px ~ 767px | 모바일 (1열 그리드) |
| ~480px | 소형 모바일 |

---

## 주요 기능

- 16개 라우트, 모든 페이지 lazy loading
- 한국어/영어 전환
- 다크/라이트 테마 전환
- 반응형 디자인 (4단계 브레이크포인트)
- 스크롤 애니메이션 (AOS)
- 레거시 URL 리다이렉트 지원

---

## 변경 이력

| 날짜 | 작업 | 담당 |
|------|------|------|
| 2026-02-18 | 서비스 메뉴 재구조화 및 신규 8개 페이지 추가 | Claude Opus 4.6 |
| - | Phase 1 완전 복원 완료 | - |

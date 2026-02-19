# DreamIT Biz - React SPA

**마지막 업데이트**: 2026-02-20
**버전**: v2.0 (강의계획서 게시판 추가)

---

## 프로젝트 개요

DreamIT Biz(드림아이티비즈)의 공식 기업 웹사이트. React 19 기반 SPA로 구축되었으며, IT서비스, 컨설팅, 교육, 출판, R&D 5개 핵심 사업 영역과 커뮤니티, 스토어를 제공합니다.

### 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | React 19.2.0, React Router DOM 7.13.0 |
| **Build** | Vite 7.3.1 |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Styling** | CSS Variables + Custom CSS (다크모드 + 5색 컬러테마) |
| **i18n** | Custom Context API (한국어/영어) |
| **Auth** | Supabase Auth (이메일 + 소셜 로그인) |
| **Deploy** | HashRouter 기반 정적 배포 → D:/www/ |

---

## 메뉴 구조

```
홈 | IT서비스▼ | R&D | 컨설팅▼ | 교육▼ | 출판▼ | 스토어 | 커뮤니티▼ | 회사소개▼
     ├─ 웹개발         ├─ 기업       ├─ 맞춤강의    ├─ 전자출판         ├─ 블로그    ├─ 회사소개
     ├─ 웹호스팅       ├─ 대학       ├─ 온라인강의실 ├─ 간행물           ├─ 게시판    ├─ 연혁
     ├─ 디자인         └─ 교육기관   └─ 강의계획서   ├─ 도서·교재       └─ 갤러리    ├─ 대표소개
     └─ 포트폴리오                                   └─ 강의안·실습자료              └─ 연락처
```

---

## 디렉토리 구조

```
D:/www/react-source/
├── src/
│   ├── App.jsx                          # 메인 라우터 (42개 라우트)
│   ├── main.jsx                         # 엔트리 포인트
│   ├── index.css                        # 마스터 스타일시트
│   │
│   ├── pages/ (42개)
│   │   ├── Home.jsx                     # 홈 랜딩 (히어로 캐러셀 5슬라이드)
│   │   ├── Services.jsx                 # IT서비스 목록
│   │   ├── ServiceDetail.jsx            # IT서비스 상세
│   │   ├── RnD.jsx                      # 연구개발
│   │   ├── Consulting.jsx               # 컨설팅 랜딩
│   │   ├── ConsultingBusiness.jsx       # 기업 컨설팅
│   │   ├── ConsultingUniversity.jsx     # 대학 컨설팅
│   │   ├── ConsultingInstitution.jsx    # 교육기관 컨설팅
│   │   ├── Education.jsx                # 교육 랜딩
│   │   ├── EducationCustom.jsx          # 맞춤 강의
│   │   ├── Classroom.jsx                # 온라인 강의실
│   │   ├── Syllabus.jsx                 # 강의계획서 목록 (NEW)
│   │   ├── SyllabusWrite.jsx            # 강의계획서 작성/수정 (NEW)
│   │   ├── SyllabusDetail.jsx           # 강의계획서 상세 (NEW)
│   │   ├── Publishing.jsx               # 출판 랜딩
│   │   ├── PublishingEbook.jsx          # 전자출판
│   │   ├── PublishingPeriodical.jsx     # 간행물
│   │   ├── PublishingBook.jsx           # 도서 출판
│   │   ├── PublishingMaterial.jsx        # 강의안 및 실습자료
│   │   ├── Portfolio.jsx                # 포트폴리오
│   │   ├── About.jsx                    # 회사소개
│   │   ├── CeoProfile.jsx              # 대표 소개
│   │   ├── History.jsx                  # 연혁
│   │   ├── Blog.jsx                     # 블로그 목록
│   │   ├── BlogDetail.jsx              # 블로그 상세
│   │   ├── BlogWrite.jsx               # 블로그 작성/수정
│   │   ├── Board.jsx                    # 게시판 목록
│   │   ├── BoardDetail.jsx             # 게시판 상세
│   │   ├── BoardWrite.jsx              # 게시판 작성/수정
│   │   ├── Gallery.jsx                  # 갤러리
│   │   ├── GalleryWrite.jsx            # 갤러리 작성/수정
│   │   ├── Shop.jsx                     # 스토어
│   │   ├── ProductWrite.jsx            # 상품 등록/수정
│   │   ├── Cart.jsx                     # 장바구니
│   │   ├── Checkout.jsx                # 결제
│   │   ├── OrderConfirmation.jsx       # 주문 완료
│   │   ├── Contact.jsx                  # 연락처
│   │   ├── Login.jsx                    # 로그인
│   │   ├── Register.jsx                # 회원가입
│   │   ├── ForgotPassword.jsx          # 비밀번호 재설정
│   │   ├── MyPage.jsx                   # 마이페이지
│   │   └── OrderHistory.jsx            # 주문 이력
│   │
│   ├── components/ (12개)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx               # 네비게이션 (9개 메뉴 + 드롭다운)
│   │   │   └── Footer.jsx              # 푸터
│   │   ├── AuthGuard.jsx               # 인증 가드
│   │   ├── AdminGuard.jsx              # 관리자 가드
│   │   ├── SEOHead.jsx                 # SEO 메타태그
│   │   ├── Pagination.jsx              # 페이지네이션
│   │   ├── ImageUpload.jsx             # 이미지 업로드
│   │   ├── CTA.jsx                     # Call-to-Action
│   │   ├── HeroCarousel.jsx            # 히어로 캐러셀
│   │   ├── HeroBackground.jsx          # 히어로 배경
│   │   ├── Particles.jsx               # 파티클 애니메이션
│   │   └── ScrollIndicator.jsx         # 스크롤 인디케이터
│   │
│   ├── contexts/
│   │   ├── ThemeContext.jsx             # 다크/라이트/오토 + 5색 컬러테마
│   │   ├── LanguageContext.jsx          # 한/영 번역
│   │   ├── AuthContext.jsx             # 인증 상태
│   │   ├── CartContext.jsx             # 장바구니
│   │   └── ToastContext.jsx            # 토스트 알림
│   │
│   ├── hooks/
│   │   ├── useAOS.js                    # 스크롤 애니메이션
│   │   ├── useCountUp.js               # 숫자 카운트업
│   │   └── usePageTracking.js          # GA4 페이지 추적
│   │
│   ├── data/
│   │   ├── serviceDetails.js            # IT서비스 데이터
│   │   ├── educationDetails.js          # 교육 데이터
│   │   ├── consultingDetails.js        # 컨설팅 데이터
│   │   └── publishingDetails.js         # 출판 데이터
│   │
│   └── utils/
│       ├── translations.js              # i18n 번역 (ko/en)
│       ├── supabase.js                 # Supabase 클라이언트
│       ├── boardStorage.js             # Board/Blog/Gallery/Syllabus CRUD
│       ├── productStorage.js           # 상품 CRUD
│       ├── auth.js                     # 인증 헬퍼
│       └── storage.js                  # 스토리지 유틸
│
├── Dev_md/                              # 개발 문서
│   ├── README.md                        # 이 파일
│   ├── dev_log_2026-02-20_syllabus.md  # 강의계획서 개발일지
│   └── ...                             # 기타 개발 로그
│
├── public/
│   ├── sitemap.xml
│   ├── robots.txt
│   └── assets/images/
│
├── dist/                               # 빌드 산출물
├── deploy.cjs                          # 배포 스크립트
├── package.json
├── vite.config.js
└── index.html
```

---

## 라우트 맵 (42개)

### 사업 영역

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | 홈 랜딩 (5슬라이드 캐러셀) |
| `/services` | Services | IT서비스 목록 |
| `/services/:serviceType` | ServiceDetail | IT서비스 상세 |
| `/rnd` | RnD | 연구개발 |
| `/consulting` | Consulting | 컨설팅 랜딩 |
| `/consulting/business` | ConsultingBusiness | 기업 컨설팅 |
| `/consulting/university` | ConsultingUniversity | 대학 컨설팅 |
| `/consulting/institution` | ConsultingInstitution | 교육기관 컨설팅 |
| `/education` | Education | 교육 랜딩 |
| `/education/custom` | EducationCustom | 맞춤 강의 |
| `/education/classroom` | Classroom | 온라인 강의실 |
| `/education/syllabus` | Syllabus | 강의계획서 목록 |
| `/education/syllabus/write` | SyllabusWrite | 강의계획서 작성 (AdminGuard) |
| `/education/syllabus/edit/:id` | SyllabusWrite | 강의계획서 수정 (AdminGuard) |
| `/education/syllabus/:postId` | SyllabusDetail | 강의계획서 상세 |
| `/publishing` | Publishing | 출판 랜딩 |
| `/publishing/ebook` | PublishingEbook | 전자출판 |
| `/publishing/periodical` | PublishingPeriodical | 간행물 |
| `/publishing/book` | PublishingBook | 도서 출판 |
| `/publishing/material` | PublishingMaterial | 강의안 및 실습자료 |
| `/portfolio` | Portfolio | 포트폴리오 |

### 회사소개

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/about` | About | 회사소개 |
| `/about/ceo` | CeoProfile | 대표 소개 |
| `/about/history` | History | 연혁 |
| `/contact` | Contact | 연락처 |

### 커뮤니티

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/community/blog` | Blog | 블로그 목록 |
| `/community/blog/:postId` | BlogDetail | 블로그 상세 |
| `/community/blog/write` | BlogWrite | 블로그 작성 (AdminGuard) |
| `/community/blog/edit/:id` | BlogWrite | 블로그 수정 (AdminGuard) |
| `/community/board` | Board | 게시판 목록 |
| `/community/board/write` | BoardWrite | 게시판 작성 (AuthGuard) |
| `/community/board/edit/:id` | BoardWrite | 게시판 수정 (AuthGuard) |
| `/community/board/:postId` | BoardDetail | 게시판 상세 |
| `/community/gallery` | Gallery | 갤러리 |
| `/community/gallery/write` | GalleryWrite | 갤러리 작성 (AdminGuard) |
| `/community/gallery/edit/:id` | GalleryWrite | 갤러리 수정 (AdminGuard) |

### 스토어

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/shop` | Shop | 스토어 |
| `/shop/product/new` | ProductWrite | 상품 등록 (AdminGuard) |
| `/shop/product/edit/:id` | ProductWrite | 상품 수정 (AdminGuard) |
| `/cart` | Cart | 장바구니 |
| `/checkout` | Checkout | 결제 |
| `/order-confirmation` | OrderConfirmation | 주문 완료 |

### 인증

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/login` | Login | 로그인 |
| `/register` | Register | 회원가입 |
| `/forgot-password` | ForgotPassword | 비밀번호 재설정 |
| `/mypage` | MyPage | 마이페이지 (AuthGuard) |
| `/mypage/orders` | OrderHistory | 주문 이력 (AuthGuard) |

---

## Supabase 테이블

| 테이블 | 용도 | RLS |
|--------|------|-----|
| `board_posts` | 게시판 | SELECT: 공개, CUD: 인증 |
| `blog_posts` | 블로그 | SELECT: 공개, CUD: 인증 |
| `gallery_items` | 갤러리 | SELECT: 공개, CUD: 인증 |
| `syllabi` | 강의계획서 | SELECT: 공개, CUD: 인증 |
| `products` | 스토어 상품 | SELECT: 공개, CUD: 인증 |
| `orders` | 주문 | 인증 사용자 자기 데이터 |
| `order_items` | 주문 항목 | 인증 사용자 자기 데이터 |

---

## 주요 기능

- **42개 라우트**, 모든 페이지 lazy loading (코드 스플리팅)
- **한국어/영어** 실시간 전환
- **다크/라이트/오토** 테마 + **5색 컬러테마** (블루, 레드, 그린, 퍼플, 오렌지)
- **반응형 디자인** (4단계: 데스크탑/태블릿/모바일/소형모바일)
- **Supabase Auth** 인증 (이메일 + 소셜)
- **관리자 시스템** (AdminGuard — 이메일 기반 관리자 구분)
- **게시판 CRUD** (게시판, 블로그, 갤러리, 강의계획서)
- **스토어** (상품, 장바구니, 결제, 주문 이력)
- **강의계획서** (7개 카테고리, 운영/미운영 상태, 운영횟수)
- **SEO** (SEOHead, sitemap.xml, robots.txt, OG 태그)
- **GA4** 페이지 추적
- 스크롤 애니메이션 (AOS), 히어로 캐러셀

---

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build        # = npx vite build

# 배포 (dist → D:/www/)
node deploy.cjs

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

## 변경 이력

| 날짜 | 작업 | 담당 |
|------|------|------|
| 2026-02-20 | 강의계획서(Syllabus) 게시판 v1.0 구현 — 7개 카테고리 | Claude Opus 4.6 |
| 2026-02-19 | 커뮤니티 시스템 (블로그/게시판/갤러리 CRUD), 컬러테마 5색 | Claude Opus 4.6 |
| 2026-02-18 | 서비스 메뉴 재구조화, 컨설팅/출판 확장, 스토어/인증 시스템 | Claude Opus 4.6 |
| 2026-02-18 | Phase 1 완전 복원 완료 | - |

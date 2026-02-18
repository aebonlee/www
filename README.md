# DreamIT Biz

드림아이티비즈(DreamIT Biz) 공식 웹사이트 - React SPA

[![Live Site](https://img.shields.io/badge/Live-www.dreamitbiz.com-blue)](https://www.dreamitbiz.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-aebonlee.github.io%2Fwww-brightgreen)](https://aebonlee.github.io/www)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)

## 🚀 프로젝트 소개

드림아이티비즈는 IT 정보통신 분야의 전문 기업으로서, 고객의 비즈니스 성공을 위한 최적의 솔루션을 제공합니다.

**2024년 2월 React SPA(Single Page Application)로 전면 리뉴얼** 완료! 🎉

## 📋 서비스

- **웹개발**: 반응형 웹사이트부터 복잡한 웹 애플리케이션까지
- **웹호스팅**: 안정적이고 빠른 웹호스팅 서비스
- **디자인**: UI/UX 디자인, 브랜드 아이덴티티
- **기업컨설팅**: IT 인프라 구축 및 디지털 전환 컨설팅
- **기업 맞춤 강의**: 맞춤형 IT 교육 프로그램
- **출판사업**: IT 관련 전문 서적 출판 및 교육 콘텐츠 제작

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **React Router DOM** - 클라이언트 사이드 라우팅
- **Context API** - 전역 상태 관리 (테마, 다국어)
- **Vite** - 빌드 도구 및 개발 서버
- **CSS3** - 반응형 디자인 및 애니메이션

### Deployment
- **GitHub Pages** - 정적 사이트 호스팅
- **Custom Domain** - www.dreamitbiz.com

## 📁 프로젝트 구조

```
webapp/                         # 배포 디렉토리
├── index.html                  # React 앱 진입점
├── assets/
│   ├── index-[hash].js        # 번들된 React 앱
│   ├── index-[hash].css       # 번들된 스타일
│   ├── images/                # 이미지 리소스
│   │   └── portfolio/         # 포트폴리오 이미지
│   ├── css/                   # 원본 CSS (백업)
│   └── js/                    # 원본 JS (백업)
├── backup/                    # 기존 HTML 버전 백업
├── CNAME                      # 커스텀 도메인 설정
└── README.md                  # 이 파일

webapp-react/                   # 개발 소스 디렉토리
├── src/
│   ├── App.jsx                # 루트 컴포넌트
│   ├── main.jsx               # 앱 진입점
│   ├── index.css              # 글로벌 스타일
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx     # 네비게이션 바
│   │       └── Footer.jsx     # 푸터
│   ├── pages/
│   │   ├── Home.jsx           # 메인 페이지
│   │   ├── Services.jsx       # 서비스 페이지
│   │   ├── Portfolio.jsx      # 포트폴리오 페이지
│   │   ├── About.jsx          # 회사소개 페이지
│   │   ├── Blog.jsx           # 블로그 페이지
│   │   └── Contact.jsx        # 연락처 페이지
│   ├── contexts/
│   │   ├── ThemeContext.jsx   # 테마 상태 관리
│   │   └── LanguageContext.jsx # 다국어 상태 관리
│   └── utils/
│       └── translations.js    # 다국어 번역 데이터
├── public/
│   └── assets/                # 정적 리소스
├── package.json
├── vite.config.js             # Vite 설정
└── index.html                 # HTML 템플릿
```

## ✨ 주요 기능

### 사용자 기능
- ✅ **SPA (Single Page Application)** - 빠른 페이지 전환
- ✅ **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원
- ✅ **다크/라이트 모드** - 사용자 선호도에 따른 테마 전환
- ✅ **다국어 지원** - 한국어/영어 전환 (KR/EN)
- ✅ **통일된 네비게이션** - 모든 페이지 일관된 메뉴
- ✅ **부드러운 애니메이션** - 스크롤 및 페이지 전환 효과
- ✅ **인터랙티브 파티클 배경** - Hero 섹션 시각 효과
- ✅ **모바일 최적화** - 햄버거 메뉴 및 터치 제스처 지원

### 개발자 기능
- ✅ **컴포넌트 기반 아키텍처** - 재사용 가능한 컴포넌트
- ✅ **Context API** - 전역 상태 관리
- ✅ **React Router** - 선언적 라우팅
- ✅ **Vite 빌드** - 빠른 빌드 및 HMR
- ✅ **코드 스플리팅** - 최적화된 번들 크기
- ✅ **SEO 친화적** - 메타 태그 및 시맨틱 HTML

## 🎯 페이지 구성

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | Home | 메인 페이지 (Hero, 서비스 소개, 포트폴리오 미리보기, 고객 후기) |
| `/services` | Services | 서비스 목록 (6개 서비스 카드) |
| `/services/:type` | Services | 서비스 상세 페이지 (향후 구현) |
| `/portfolio` | Portfolio | 포트폴리오 (세종대, 진주교대, 기타 프로젝트) |
| `/portfolio#sejong` | Portfolio | 세종대학교 미래교육원 프로젝트 |
| `/portfolio#chinju` | Portfolio | 진주교육대학교 100주년 프로젝트 |
| `/about` | About | 회사소개 (회사 개요, 비전, 연혁) |
| `/blog` | Blog | 블로그 (IT 트렌드, 기술 소식) |
| `/contact` | Contact | 연락처 (문의 폼, 연락처 정보) |

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 20.x 이상
- npm 10.x 이상

### 설치

```bash
# 프로젝트 클론
git clone https://github.com/aebonlee/www.git
cd www

# 개발 디렉토리로 이동
cd ../webapp-react

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 배포

```bash
# 빌드
npm run build

# 빌드 결과를 webapp 디렉토리로 복사
cp -r dist/* ../webapp/

# Git 커밋 및 푸시
cd ../webapp
git add .
git commit -m "Update: 사이트 업데이트"
git push origin main
```

GitHub Pages가 자동으로 배포합니다 (~1-2분 소요).

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Blue**: `#0066CC` - 브랜드 메인 컬러
- **Background White**: `#FFFFFF` - 밝은 배경
- **Light Gray**: `#F7F9FC` - 섹션 구분
- **Text Primary**: `#1A1A1A` - 본문 텍스트
- **Text Secondary**: `#666666` - 보조 텍스트

### 타이포그래피
- **Font Family**: Noto Sans KR (Google Fonts)
- **Hero Title**: 56px / 700 weight
- **Section Title**: 40px / 700 weight
- **Body Text**: 16px / 400 weight

### 레이아웃
- **Container Max Width**: 1200px
- **Grid**: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Spacing**: 8px 기반 시스템

## 📊 포트폴리오 프로젝트

### 세종대학교 미래교육원
- **URL**: https://cec.sejong.ac.kr
- **기술**: HTML5, CSS3, JavaScript, 반응형 디자인
- **서비스**: 웹개발, UI/UX 디자인, 웹호스팅

### 진주교육대학교 100주년 기념 사이트
- **URL**: http://cue100th.com
- **기술**: HTML5, CSS3, JavaScript, Gnuboard
- **서비스**: 웹개발, UI/UX 디자인, 반응형 퍼블리싱

## 🔄 버전 히스토리

### v2.0.0 (2024-02-18) - React 리팩토링
- ✨ Vite + React 18로 전체 사이트 재구축
- ✨ SPA(Single Page Application) 전환
- ✨ 컴포넌트 기반 아키텍처 적용
- ✨ Context API를 통한 상태 관리
- ✨ 통일된 네비게이션 및 푸터
- ✨ 다국어 지원 (한국어/영어)
- ✨ 다크모드 지원
- 🐛 메뉴 불일치 문제 해결
- ⚡ 성능 최적화 (코드 스플리팅, 번들 최적화)

### v1.0.0 (2020-2024) - HTML 버전
- 초기 HTML/CSS/JavaScript 기반 사이트
- 반응형 디자인 구현
- 6개 서비스 페이지
- 포트폴리오 및 블로그 섹션

## 👨‍💻 개발자

- **대표**: 이애본
- **Email**: aebon@dreamitbiz.com
- **전화**: 010-3700-0629
- **카카오톡**: aebon
- **주소**: 경기도 수원시 팔달구 매산로 45, 419호

## 📄 회사 정보

- **사업자등록번호**: 601-45-20154
- **통신판매신고**: 제2024-수원팔달-0584호
- **영업시간**: 평일 09:00 ~ 18:00

## 🔗 링크

- **Website**: https://www.dreamitbiz.com
- **GitHub**: https://github.com/aebonlee/www
- **GitHub Pages**: https://aebonlee.github.io/www

## 📝 라이선스

© 2020-2024 DreamIT Biz. All rights reserved.

---

**Built with** ❤️ **using React + Vite**

**Last Updated**: 2024-02-18

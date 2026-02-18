# 📁 DreamIT Biz - 프로젝트 구조 및 관리 가이드

## 📅 생성 일시
- **작성일**: 2026-02-18 09:40 KST
- **최종 커밋**: eb99260
- **GitHub 저장소**: https://github.com/aebonlee/www

---

## 🏗️ 전체 프로젝트 구조

```
webapp/                          # GitHub Pages 배포용 루트 디렉터리
│
├── 📄 index.html                # 메인 HTML (SPA 진입점)
├── 📄 404.html                  # SPA 라우팅 폴백
├── 📄 CNAME                     # 커스텀 도메인 설정
├── 📄 .nojekyll                 # Jekyll 비활성화
├── 📄 vite.svg                  # 파비콘
│
├── 📂 assets/                   # 빌드된 정적 자산
│   ├── index-*.js               # React 애플리케이션 번들
│   ├── index-*.css              # 스타일시트 번들
│   ├── css/                     # 추가 CSS 파일
│   ├── js/                      # 추가 JS 파일
│   └── images/                  # 이미지 파일
│
├── 📂 webapp-react-full/        # 🆕 React 개발 프로젝트 전체 소스
│   ├── 📂 src/                  # React 소스 코드
│   │   ├── 📂 pages/            # 페이지 컴포넌트
│   │   │   ├── Home.jsx         # 홈 페이지
│   │   │   ├── Services.jsx     # 서비스 페이지
│   │   │   ├── Portfolio.jsx    # 포트폴리오 페이지
│   │   │   ├── About.jsx        # 소개 페이지
│   │   │   ├── Blog.jsx         # 블로그 페이지
│   │   │   └── Contact.jsx      # 연락처 페이지
│   │   │
│   │   ├── 📂 components/       # 재사용 가능한 컴포넌트
│   │   │   └── 📂 layout/
│   │   │       ├── Navbar.jsx   # 네비게이션 바
│   │   │       └── Footer.jsx   # 푸터
│   │   │
│   │   ├── 📂 contexts/         # React Context API
│   │   │   ├── ThemeContext.jsx     # 다크/라이트 모드
│   │   │   └── LanguageContext.jsx  # 한국어/영어 전환
│   │   │
│   │   ├── 📂 utils/            # 유틸리티 함수
│   │   │   └── translations.js  # 다국어 번역
│   │   │
│   │   ├── 📂 styles/           # CSS 모듈
│   │   │   └── base.css         # 기본 스타일 변수
│   │   │
│   │   ├── 📄 App.jsx           # React 메인 앱
│   │   ├── 📄 main.jsx          # React 진입점
│   │   └── 📄 index.css         # 글로벌 스타일
│   │
│   ├── 📂 public/               # 정적 에셋
│   │   ├── 404.html             # SPA 폴백
│   │   ├── vite.svg             # 파비콘
│   │   └── 📂 assets/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   │
│   ├── 📂 dist/                 # Vite 빌드 결과물
│   │   ├── index.html
│   │   ├── 404.html
│   │   └── assets/
│   │
│   ├── 📄 package.json          # NPM 의존성 관리
│   ├── 📄 package-lock.json     # 의존성 잠금 파일
│   ├── 📄 vite.config.js        # Vite 설정
│   ├── 📄 eslint.config.js      # ESLint 설정
│   ├── 📄 .gitignore            # Git 무시 파일
│   ├── 📄 index.html            # Vite 개발 서버용 HTML
│   ├── 📄 README.md             # 프로젝트 설명
│   ├── 📄 DEPLOYMENT_CHECKLIST.md  # 배포 체크리스트
│   └── 📄 test.html             # 테스트 HTML
│
├── 📂 react-source/             # React 소스 백업 (기존)
│   ├── src/
│   ├── public/
│   └── index.html
│
├── 📂 backup/                   # 이전 버전 백업
│
└── 📄 문서 파일들
    ├── README.md                # 메인 README
    ├── DEPLOYMENT_STATUS.md     # 배포 상태
    ├── DEPLOYMENT_VERIFICATION.md  # 배포 검증
    ├── DEBUGGING_REPORT.md      # 디버깅 보고서
    ├── FIX_REPORT.md            # 수정 보고서
    ├── FINAL_STATUS_REPORT.md  # 최종 상태 보고서
    ├── CSS_REFACTOR_REPORT.md  # CSS 리팩토링 보고서
    ├── FINAL_DEPLOYMENT_REPORT.md  # 최종 배포 보고서
    └── FILE_MANIFEST.md         # 파일 목록
```

---

## 🔄 개발 워크플로우

### 1️⃣ 로컬 개발 (webapp-react 폴더에서)
```bash
cd /home/user/webapp-react
npm install              # 의존성 설치
npm run dev              # 개발 서버 실행 (포트 5173)
npm run build            # 프로덕션 빌드
npm run preview          # 빌드 미리보기 (포트 4173)
```

### 2️⃣ 빌드 및 배포
```bash
# 1. React 프로젝트 빌드
cd /home/user/webapp-react
npm run build

# 2. 빌드 결과물을 webapp으로 복사
cp -f dist/index.html /home/user/webapp/index.html
cp -f dist/404.html /home/user/webapp/404.html
cp -rf dist/assets/* /home/user/webapp/assets/

# 3. React 소스도 동기화 (선택사항)
cp -r src /home/user/webapp/webapp-react-full/
cp -r public /home/user/webapp/webapp-react-full/
cp -r dist /home/user/webapp/webapp-react-full/

# 4. Git 커밋 및 푸시
cd /home/user/webapp
git add -A
git commit -m "업데이트 메시지"
git push origin main
```

### 3️⃣ GitHub Pages 배포
- GitHub에 푸시하면 자동으로 배포됨
- 배포 URL: https://www.dreamitbiz.com
- GitHub Pages: https://aebonlee.github.io/www

---

## 📦 프로젝트 관리 전략

### 🎯 디렉터리 역할

1. **`/home/user/webapp-react`** (로컬 개발용)
   - 실제 개발 작업 수행
   - `npm install`로 의존성 설치
   - Git 저장소 없음 (GitHub에 업로드할 필요 없음)
   - node_modules 폴더 포함 (약 125개 패키지)

2. **`/home/user/webapp/webapp-react-full`** (GitHub 보관용)
   - 전체 프로젝트 소스 백업
   - node_modules 제외 (`.gitignore`에 명시)
   - 버전 관리 및 팀 협업용
   - 다른 환경에서 `npm install`로 복원 가능

3. **`/home/user/webapp/assets`** (배포용)
   - 빌드된 최종 결과물
   - 실제 사용자에게 전달되는 파일들
   - JavaScript 번들, CSS 번들, 이미지

4. **`/home/user/webapp/react-source`** (이전 백업)
   - 기존 방식의 소스 백업
   - 참고용으로 유지

---

## 🌐 배포된 사이트 구조

### 페이지 목록
1. **홈**: `/` - 메인 랜딩 페이지
2. **서비스**: `/services` - 제공 서비스 소개
3. **포트폴리오**: `/portfolio` - 프로젝트 사례
4. **소개**: `/about` - 회사 소개
5. **블로그**: `/blog` - 블로그 (준비 중)
6. **연락처**: `/contact` - 문의 양식

### 주요 기능
- ✅ **React SPA**: 단일 페이지 애플리케이션
- ✅ **React Router**: 클라이언트 사이드 라우팅
- ✅ **다크/라이트 모드**: 테마 전환
- ✅ **다국어 지원**: 한국어/영어 전환
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱
- ✅ **GitHub Pages 최적화**: SPA 라우팅 지원

---

## 🔧 기술 스택

### 프론트엔드
- **React** 18.x - UI 라이브러리
- **React Router** 6.x - 라우팅
- **Vite** 6.x - 빌드 도구
- **CSS3** - 스타일링 (CSS Modules)

### 개발 도구
- **ESLint** - 코드 품질 검사
- **npm** - 패키지 관리
- **Git** - 버전 관리

### 배포
- **GitHub Pages** - 정적 사이트 호스팅
- **Cloudflare DNS** - 도메인 연결
- **Custom Domain**: www.dreamitbiz.com

---

## 📊 성능 지표

### 빌드 성능
- **빌드 시간**: ~2.4초
- **모듈 수**: 52개
- **JavaScript 번들**: 264.95 KB → 81.30 KB (gzip)
- **CSS 번들**: 12.97 KB → 3.22 KB (gzip)
- **HTML**: 2.11 KB → 1.05 KB (gzip)

### 페이지 로드
- **초기 로드**: ~8초 (GitHub Pages 캐싱)
- **후속 네비게이션**: <1초 (클라이언트 라우팅)
- **콘솔 에러**: 0개

---

## 🚀 향후 프로젝트 추가 가이드

### 새 프로젝트 추가 시
1. `/home/user` 내에 새 프로젝트 폴더 생성
2. 개발 완료 후 빌드
3. `/home/user/webapp/` 하위에 프로젝트별 폴더 생성
4. 빌드 결과물 복사
5. Git 커밋 및 푸시

### 예시: 새 프로젝트 "ecommerce"
```bash
# 1. 개발
mkdir /home/user/ecommerce-react
cd /home/user/ecommerce-react
npm init vite@latest
npm install
npm run dev

# 2. 빌드
npm run build

# 3. GitHub에 추가
mkdir /home/user/webapp/ecommerce-project
cp -r dist/* /home/user/webapp/ecommerce-project/
cp -r src /home/user/webapp/ecommerce-project/

# 4. 커밋
cd /home/user/webapp
git add -A
git commit -m "feat: 이커머스 프로젝트 추가"
git push origin main
```

---

## 📋 파일 관리 규칙

### ✅ GitHub에 포함
- 소스 코드 (`src/`, `public/`)
- 설정 파일 (`package.json`, `vite.config.js`)
- 빌드 결과물 (`dist/`, `assets/`)
- 문서 파일 (`.md` 파일들)

### ❌ GitHub에서 제외 (.gitignore)
- `node_modules/` - NPM 패키지 (매우 큼)
- `.env` - 환경 변수 (보안)
- `.DS_Store` - macOS 시스템 파일
- `dist/` 내 임시 파일

---

## 🔗 중요 링크

### 프로젝트
- **라이브 사이트**: https://www.dreamitbiz.com
- **GitHub Pages**: https://aebonlee.github.io/www
- **GitHub 저장소**: https://github.com/aebonlee/www
- **저장소 브랜치**: `main`

### 문서
- **메인 README**: https://github.com/aebonlee/www/blob/main/README.md
- **배포 가이드**: https://github.com/aebonlee/www/blob/main/DEPLOYMENT_STATUS.md
- **디버깅 보고서**: https://github.com/aebonlee/www/blob/main/DEBUGGING_REPORT.md

---

## 📝 버전 관리

### 최근 커밋
```
eb99260 - feat: webapp-react 전체 프로젝트 소스 추가
c5f9b07 - docs: CSS 리팩토링 보고서 추가
3eccadd - refactor: CSS 모듈화 및 최적화
66e5adc - docs: 최종 수정 완료 보고서 추가
209393e - fix: BrowserRouter로 변경 및 GitHub Pages SPA 지원 추가
```

### 총 커밋 수: 18개
### 총 파일 수: 약 100개 (node_modules 제외)

---

## ⚠️ 주의사항

1. **node_modules 관리**
   - 로컬 개발용으로만 사용
   - GitHub에 업로드하지 않음
   - 다른 환경에서 `npm install`로 재설치

2. **빌드 파일 동기화**
   - webapp-react에서 빌드
   - webapp으로 복사 필요
   - 자동화 스크립트 고려 가능

3. **Git 커밋 메시지**
   - Conventional Commits 형식 사용
   - `feat:`, `fix:`, `docs:`, `refactor:` 등

4. **브라우저 캐시**
   - 배포 후 강력 새로고침 (Ctrl+Shift+R)
   - 시크릿 모드로 테스트

---

## 🎉 완료된 작업

✅ React 프로젝트 전체 구조 GitHub에 업로드  
✅ 소스 코드 및 빌드 결과물 모두 포함  
✅ node_modules 제외 (`.gitignore` 적용)  
✅ 프로젝트 구조 문서화  
✅ 향후 프로젝트 관리 가이드 작성  
✅ 버전 관리 시스템 정리  

---

**작성자**: GenSpark AI Developer  
**최종 업데이트**: 2026-02-18 09:40 KST  
**커밋 해시**: eb99260

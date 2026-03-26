# 개선 로드맵 & 액션 플랜

> 작성일: 2026-03-25

---

## 전체 로드맵 개요

```
Phase 1 (즉시)          Phase 2 (단기)         Phase 3 (중기)          Phase 4 (장기)
보안 & 긴급 수정        기술 부채 해소          품질 향상               아키텍처 고도화
──────────────        ──────────────        ──────────────         ──────────────
- npm audit           - CRA → Vite 전환     - TypeScript 전환       - 모노레포 전환
- API 키 점검          - Vite 버전 통일       - Vitest 테스트 도입     - 공통 컴포넌트 라이브러리
- .env gitignore      - 배포 스크립트 통일     - CI/CD 파이프라인      - 디자인 시스템
- 메타데이터 보완       - AHP 백업 정리        - SEO/접근성 개선        - 성능 모니터링
```

---

## Phase 1: 보안 & 긴급 수정 (즉시 실행)

### 1-1. npm 보안 취약점 점검 및 수정

**대상**: 전체 39개 프로젝트

```bash
# 각 프로젝트 폴더에서 실행
npm audit
npm audit fix

# 고위험 취약점만 확인
npm audit --audit-level=high
```

**체크리스트**:
- [ ] ahp_basic - npm audit
- [ ] competency - npm audit
- [ ] pbirobot - npm audit
- [ ] books - npm audit
- [ ] edu-hub - npm audit (결제 포함)
- [ ] allthat - npm audit (결제 포함)
- [ ] papers - npm audit (결제 포함)
- [ ] templete-ref - npm audit (결제 포함)
- [ ] (나머지 31개 프로젝트)

---

### 1-2. API 키 & 환경 변수 보안 점검

**대상**: Supabase 사용 프로젝트 28개 + 결제 프로젝트 5개

**확인 사항**:
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가
- [ ] Supabase `anon key`만 클라이언트에 노출되는가 (service_role key 노출 금지)
- [ ] PortOne 결제 키가 클라이언트 코드에 하드코딩되어 있지 않은가
- [ ] GitHub 리포지토리 히스토리에 키가 커밋된 적 없는가

---

### 1-3. package.json 메타데이터 보완

**대상**: description/homepage 누락 프로젝트

각 프로젝트의 package.json에 추가할 정보:

| 프로젝트 | description | homepage |
|---------|-------------|----------|
| ahp_basic | AHP 의사결정 분석 도구 | https://ahp-basic.dreamitbiz.com |
| competency | 4차 산업혁명 8대 핵심역량 검사 | https://competency.dreamitbiz.com |
| pbirobot | PBI 로봇 플랫폼 | https://pbirobot.dreamitbiz.com |
| books | DreamIT 출판 서브사이트 | https://books.dreamitbiz.com |
| edu-hub | 교육 허브 플랫폼 | https://edu-hub.dreamitbiz.com |
| hohai | Hohai 서비스 | https://hohai.dreamitbiz.com |
| coding | 코딩 학습 플랫폼 | https://coding.dreamitbiz.com |
| c-study | C언어 학습 사이트 | https://c-study.dreamitbiz.com |
| python-study | 파이썬 학습 사이트 | https://python-study.dreamitbiz.com |
| java-study | 자바 학습 사이트 | https://java-study.dreamitbiz.com |
| koreatech | 컴퓨팅 사고력 교육 | https://koreatech.dreamitbiz.com |
| algorithm | 알고리즘 학습 사이트 | https://algorithm.dreamitbiz.com |
| data-structure | 자료구조 학습 사이트 | https://data-structure.dreamitbiz.com |
| linux-study | 리눅스 학습 사이트 | https://linux-study.dreamitbiz.com |
| db-study | 데이터베이스 학습 사이트 | https://db-study.dreamitbiz.com |
| software | 소프트웨어 설계 학습 | https://software.dreamitbiz.com |
| ai-prompt | AI 프롬프트 학습 | https://ai-prompt.dreamitbiz.com |
| ai-data | AI 데이터 학습 | https://ai-data.dreamitbiz.com |
| reactStudy | React 학습 사이트 | https://reactstudy.dreamitbiz.com |
| webstudy | 웹 백엔드 학습 | https://webstudy.dreamitbiz.com |
| career | 상담공간 - 커리어 상담 플랫폼 | https://career.dreamitbiz.com |
| digitalbiz | 디지털 비즈니스 전략 | https://digitalbiz.dreamitbiz.com |
| marketing | 마케팅 학습 | https://marketing.dreamitbiz.com |
| uxdesign | UX/CXD 디자인 | https://uxdesign.dreamitbiz.com |
| self-branding | 셀프 브랜딩 | https://self-branding.dreamitbiz.com |
| koreait | Korea IT 대시보드 | https://koreait.dreamitbiz.com |
| english | 영어 학습 사이트 | https://english.dreamitbiz.com |
| japanese | 일본어 학습 사이트 | https://japanese.dreamitbiz.com |
| allthat | 올댓 ESG | https://allthat.dreamitbiz.com |
| papers | 페이퍼스 | https://papers.dreamitbiz.com |
| reserve | 예약 시스템 | https://reserve.dreamitbiz.com |
| docs | 문서 시스템 | https://docs.dreamitbiz.com |
| aebon | 포트폴리오 사이트 | https://aebon.dreamitbiz.com |

---

## Phase 2: 기술 부채 해소 (단기)

### 2-1. CRA → Vite 마이그레이션

**대상**: ahp, ahp_app (백업이므로 ahp_basic이 최종본. 향후 참조용)

**이유**:
- CRA(react-scripts)는 2024년 이후 유지보수 중단
- Vite 대비 빌드 속도 5~10배 느림
- 보안 취약점 (webpack-dev-server, nth-check 등)

**참고**: ahp_basic이 이미 Vite 5로 전환되어 있으므로, ahp/ahp_app은 개발 이력 보관 목적으로만 유지.

---

### 2-2. Vite 버전 통일

**권장 버전**: Vite 8.x (최신 안정 버전)

| 현재 버전 | 대상 프로젝트 | 마이그레이션 |
|-----------|-------------|-------------|
| Vite 5.x | ahp_basic | `npm install vite@latest @vitejs/plugin-react@latest` |
| Vite 6.x | hohai, koreait, docs, aebon | 동일 |
| Vite 7.3 | 20개+ 프로젝트 | 동일 |
| Vite 8.0 | career, coding, english, japanese | 이미 최신 |

---

### 2-3. 배포 스크립트 통일

**누락 프로젝트에 추가할 스크립트**:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

**대상** (deploy 스크립트 없는 운영 사이트):
- linux-study, career, koreatech, coding, english, japanese
- digitalbiz, marketing, allthat, papers, reserve, docs
- edu-hub, competency (GitHub Actions 또는 gh-pages 중 선택)

---

### 2-4. GitHub 리포지토리 정리

**AHP 관련 중복 리포지토리** (GitHub에 7개+):
- `ahp_app` - 메인 개발 이력
- `ahp-basic` - **최종본** (유지)
- `ahp_app_backup250919` - 백업
- `ahp_app251025` - 백업
- `ahp_app_1006_backuup` - 백업
- `ahp_app_0930_backuup` - 백업
- `ahp-platform` - 이전 버전
- `ahp-django-service` - Django 백엔드

**권장 조치**:
- `ahp-basic`과 `ahp-django-service`만 유지
- 나머지는 Archive 처리 (삭제하지 않고 읽기 전용으로)

---

## Phase 3: 품질 향상 (중기)

### 3-1. ESLint 전체 적용

**표준 ESLint 설정** (모든 프로젝트에 적용):

```bash
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh
```

---

### 3-2. TypeScript 점진적 전환

**우선 전환 대상** (결제/인증 기능 포함):
1. edu-hub (결제)
2. allthat (결제)
3. papers (결제)
4. career (상담 플랫폼)
5. koreait (대시보드)

**전환 순서**:
1. `tsconfig.json` 추가 + `.jsx` → `.tsx` 확장자 변경
2. `any` 타입으로 빠르게 전환
3. 점진적으로 `any` → 적절한 타입으로 대체

---

### 3-3. Vitest 테스트 프레임워크 도입

**우선 대상** (비즈니스 로직이 있는 핵심 서비스):

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**최소 테스트 범위**:
- 결제 로직 (PortOne 연동)
- Supabase 인증 흐름
- 핵심 비즈니스 로직 (AHP 계산, 역량 검사 등)

---

### 3-4. CI/CD 파이프라인 표준화

**GitHub Actions 표준 워크플로우**:

```yaml
# .github/workflows/deploy.yml (각 프로젝트에 적용)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: {subdomain}.dreamitbiz.com
```

---

### 3-5. SEO & 접근성 개선

**모든 사이트에 적용할 사항**:
1. `<meta>` 태그: title, description, keywords
2. Open Graph 태그: og:title, og:description, og:image
3. `robots.txt` 추가
4. `sitemap.xml` 생성 (정적 사이트인 경우)
5. `favicon.ico` 및 `apple-touch-icon` 확인
6. CNAME 파일 확인 (GitHub Pages 커스텀 도메인)

---

## Phase 4: 아키텍처 고도화 (장기)

### 4-1. 모노레포 전환 검토

**이유**: 39개 프로젝트의 공통 코드(Supabase 설정, 인증 로직, UI 컴포넌트) 중복 제거

**도구 후보**:
- Turborepo (Vercel)
- Nx (Nrwl)
- pnpm workspaces

**구조 예시**:
```
dreamit-web/
├── packages/
│   ├── shared-ui/          # 공통 UI 컴포넌트
│   ├── shared-auth/        # Supabase 인증 모듈
│   ├── shared-payment/     # PortOne 결제 모듈
│   └── shared-config/      # ESLint, Vite, TS 설정
├── apps/
│   ├── coding/
│   ├── c-study/
│   ├── competency/
│   └── ... (각 사이트)
├── turbo.json
└── package.json
```

### 4-2. 공통 컴포넌트 라이브러리

**추출 후보 컴포넌트**:
- 헤더/네비게이션 (dreamitbiz 브랜딩)
- 푸터
- 로그인/회원가입 폼 (Supabase Auth)
- 결제 버튼/모달 (PortOne)
- 코드 에디터 (PrismJS wrapper)
- PDF 내보내기 버튼
- 반응형 레이아웃 래퍼

### 4-3. 디자인 시스템

**표준화 대상**:
- 색상 팔레트 (dreamitbiz 브랜드 색상)
- 타이포그래피
- 간격/사이즈 토큰
- 컴포넌트 디자인 가이드

### 4-4. 성능 모니터링

**도입 검토**:
- Lighthouse CI (자동 성능 측정)
- Web Vitals 모니터링
- Supabase 쿼리 성능 모니터링
- 에러 트래킹 (Sentry 등)

---

## 작업 우선순위 요약

| 우선순위 | 작업 | 난이도 | 영향도 | 예상 시간 |
|---------|------|--------|--------|-----------|
| **P0** | npm audit 전체 실행 | 낮음 | 높음 | 2-3시간 |
| **P0** | API 키/환경변수 점검 | 낮음 | 높음 | 1-2시간 |
| **P1** | package.json 메타데이터 보완 | 낮음 | 중간 | 1시간 |
| **P1** | 배포 스크립트 통일 | 낮음 | 중간 | 2시간 |
| **P2** | Vite 버전 통일 | 중간 | 중간 | 3-4시간 |
| **P2** | ESLint 전체 적용 | 중간 | 중간 | 3-4시간 |
| **P3** | GitHub 리포 정리 (Archive) | 낮음 | 낮음 | 1시간 |
| **P3** | TypeScript 점진적 전환 | 높음 | 높음 | 프로젝트당 2-4시간 |
| **P3** | 테스트 코드 작성 | 높음 | 높음 | 프로젝트당 4-8시간 |
| **P4** | CI/CD 파이프라인 | 중간 | 중간 | 프로젝트당 30분 |
| **P4** | SEO/접근성 개선 | 중간 | 중간 | 프로젝트당 1시간 |
| **P5** | 모노레포 전환 | 높음 | 높음 | 대규모 작업 |

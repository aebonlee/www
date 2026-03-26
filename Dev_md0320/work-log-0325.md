# 작업 로그 - 2026-03-25

> Phase 1 (P0 + P1) 실행 결과

---

## P0-1: npm audit 전체 보안 점검 - 완료

### 전체 결과 요약 (39개 프로젝트)

| 등급 | 프로젝트 | 취약점 상세 | 조치 결과 |
|------|---------|------------|----------|
| CRITICAL | coding | 1건 | `npm audit fix` 완료 - **해결** |
| CRITICAL | linux-study | 1건 (jsPDF) | `npm audit fix` 완료 - **해결** |
| HIGH | ahp | 23건 | 백업 프로젝트 - 미수정 (ahp_basic이 최종본) |
| HIGH | ahp_app | 13건 | 백업 프로젝트 - 미수정 (ahp_basic이 최종본) |
| HIGH | ahp_basic | 7건 → 5건 잔여 | `npm audit fix` 실행 - **부분 해결** (xlsx, jsdom 수동 수정 필요) |
| HIGH | competency | 2건 | `npm audit fix` 완료 - **해결** |
| HIGH | reactStudy | 1건 | `npm audit fix` 완료 - **해결** |
| HIGH | webstudy | 1건 | `npm audit fix` 완료 - **해결** |
| HIGH | career | 1건 | `npm audit fix` 완료 - **해결** |
| HIGH | koreait | 1건 | `npm audit fix` 완료 - **해결** |
| HIGH | pbirobot | 1건 | `npm audit fix` 실행 - **부분 해결** (next@16 수동 업그레이드 필요) |
| HIGH | hohai | 1건 | `npm audit fix` 완료 - **해결** |
| HIGH | books | 1건 | `npm audit fix` 실행 - **부분 해결** (next@16 수동 업그레이드 필요) |
| HIGH | pbi | 1건 | `npm audit fix` 실행 - **부분 해결** (next@16 수동 업그레이드 필요) |
| 안전 | 24개 프로젝트 | 0건 | 조치 불필요 |

### 수동 수정 필요 잔여 항목

| 프로젝트 | 잔여 취약점 | 필요 조치 |
|---------|-----------|----------|
| ahp_basic | xlsx (Prototype Pollution) | `xlsx` → `exceljs` 패키지 교체 고려 |
| ahp_basic | tar (path traversal) | jsdom 업그레이드 (breaking change) |
| ahp_basic | vite/esbuild | Vite 8.x 업그레이드 |
| pbirobot, books, pbi | next (moderate) | `next@16.2.1+` 수동 업그레이드 |

---

## P0-2: API 키 / .env 보안 점검 - 완료

### .gitignore 점검 결과

| 상태 | 프로젝트 수 | 조치 |
|------|-----------|------|
| .env 포함됨 | 36개 | 정상 |
| **.env 미포함** | **3개** (reactStudy, webstudy, jdy) | **.gitignore에 .env 추가 완료** |

### 하드코딩된 키/비밀번호 발견

| 등급 | 프로젝트 | 발견 내용 | 상태 |
|------|---------|----------|------|
| CRITICAL | database_test | `admin.js`에 관리자 비밀번호 `admin123` 평문 노출 | 알림 (시험용 프로젝트 - 사용자 판단 필요) |
| HIGH | ahp / ahp_app | `secureStorage.ts`에 암호화 키 하드코딩 | 백업 프로젝트 - ahp_basic 확인 필요 |
| HIGH | ahp / ahp_app | 테스트 스크립트에 DB 비밀번호 하드코딩 | 백업 프로젝트 - 비밀번호 변경 권장 |
| 안전 | 나머지 34개 | 하드코딩된 실제 키 없음 | 정상 |

---

## P1-1: package.json 메타데이터 보완 - 완료

### 작업 결과

- **수정 완료**: 32개 프로젝트에 `description` + `homepage` 추가
- **기존 보유**: jdy (description 있음), java-study (homepage 있음), career (description 있음)
- **미대상**: ahp, ahp_app, pbi, database_test (백업/특수 프로젝트)

### 추가된 homepage 목록

| 프로젝트 | homepage |
|---------|----------|
| ahp_basic | https://ahp-basic.dreamitbiz.com |
| competency | https://competency.dreamitbiz.com |
| pbirobot | https://pbirobot.dreamitbiz.com |
| books | https://books.dreamitbiz.com |
| edu-hub | https://edu-hub.dreamitbiz.com |
| hohai | https://hohai.dreamitbiz.com |
| coding | https://coding.dreamitbiz.com |
| c-study | https://c-study.dreamitbiz.com |
| python-study | https://python-study.dreamitbiz.com |
| java-study | https://java-study.dreamitbiz.com |
| koreatech | https://koreatech.dreamitbiz.com |
| algorithm | https://algorithm.dreamitbiz.com |
| data-structure | https://data-structure.dreamitbiz.com |
| linux-study | https://linux-study.dreamitbiz.com |
| db-study | https://db-study.dreamitbiz.com |
| software | https://software.dreamitbiz.com |
| ai-prompt | https://ai-prompt.dreamitbiz.com |
| ai-data | https://ai-data.dreamitbiz.com |
| reactStudy | https://reactstudy.dreamitbiz.com |
| webstudy | https://webstudy.dreamitbiz.com |
| career | https://career.dreamitbiz.com |
| digitalbiz | https://digitalbiz.dreamitbiz.com |
| marketing | https://marketing.dreamitbiz.com |
| uxdesign | https://uxdesign.dreamitbiz.com |
| self-branding | https://self-branding.dreamitbiz.com |
| koreait | https://koreait.dreamitbiz.com |
| english | https://english.dreamitbiz.com |
| japanese | https://japanese.dreamitbiz.com |
| allthat | https://allthat.dreamitbiz.com |
| papers | https://papers.dreamitbiz.com |
| reserve | https://reserve.dreamitbiz.com |
| docs | https://docs.dreamitbiz.com |
| aebon | https://aebon.dreamitbiz.com |

---

## P1-2: 배포 스크립트 누락 프로젝트 보완 - 완료

### 작업 결과

15개 프로젝트에 `predeploy` + `deploy` 스크립트 및 `gh-pages` devDependency 추가:

| # | 프로젝트 | 추가 스크립트 | gh-pages 추가 |
|---|---------|-------------|:---:|
| 1 | linux-study | predeploy + deploy | O |
| 2 | career | predeploy + deploy | O |
| 3 | koreatech | predeploy + deploy | O |
| 4 | coding | predeploy + deploy | O |
| 5 | english | predeploy + deploy | O |
| 6 | japanese | predeploy + deploy | O |
| 7 | digitalbiz | predeploy + deploy | O |
| 8 | marketing | predeploy + deploy | O |
| 9 | allthat | predeploy + deploy | O |
| 10 | papers | predeploy + deploy | O |
| 11 | reserve | predeploy + deploy | O |
| 12 | docs | predeploy + deploy | O |
| 13 | edu-hub | predeploy + deploy | O |
| 14 | db-study | predeploy + deploy | O |
| 15 | koreait | predeploy + deploy | O |

### 배포 스크립트 전체 현황 (수정 후)

| 상태 | 수량 | 프로젝트 |
|------|------|---------|
| **deploy 스크립트 보유** | **31개** | 대부분의 운영 사이트 |
| **Next.js (별도 배포)** | 3개 | pbirobot, pbi, books |
| **백업/특수** | 5개 | ahp, ahp_app, database_test, templete-ref, jdy |

---

## 추가 작업 - 2026-03-26

### edu-hub 사이트 링크 수정 - 완료

**변경 파일**: `edu-hub/src/config/site.js`

| # | 작업 내용 | 변경 상세 |
|---|----------|----------|
| 1 | **한국어 학습 카드 추가** | `실용 한국어` 항목 신규 추가 → `https://korean.dreamitbiz.com/` |
| 2 | **정보처리기사 링크 활성화** | URL `#` (준비 중) → `https://eip.dreamitbiz.com/` |

#### 한국어 학습 카드 상세

| 항목 | 값 |
|------|-----|
| id | `korean` |
| 이름 | 실용 한국어 / Practical Korean |
| URL | https://korean.dreamitbiz.com/ |
| 카테고리 | `liberal-arts` (어학 분야 - 영어/일본어/중국어 다음 위치) |
| 색상 | `#2563EB` (블루) |
| 난이도 | beginner |
| 커리큘럼 | 기초 문법, 회화 패턴, 비즈니스 한국어, 독해/작문, TOPIK 대비 |
| 대상 | 외국인 및 다문화 학습자 |

#### 정보처리기사 링크 수정

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| URL | `#` (Coming Soon 표시) | `https://eip.dreamitbiz.com/` (활성 링크) |

### edu-hub 네비게이션 메뉴 수정 - 완료

**변경 파일**: `edu-hub/src/config/site.js`, `edu-hub/src/utils/translations.js`

| # | 작업 내용 | 변경 상세 |
|---|----------|----------|
| 1 | **교양분야 드롭다운 메뉴** | `실용 한국어` 메뉴 항목 추가 (중국어 다음 위치) |
| 2 | **번역 키 추가** | `korean: '실용 한국어'` / `korean: 'Practical Korean'` |

### edu-hub 어학 features 통일 - 완료

**변경 파일**: `edu-hub/src/config/site.js`

어학 4개 사이트 features[0] 일괄 변경:

| 언어 | 변경 전 | 변경 후 |
|------|---------|---------|
| 영어 | 원어민 음성 제공 | API 기반 TTS 음성 서비스 |
| 일본어 | 원어민 음성 제공 | API 기반 TTS 음성 서비스 |
| 중국어 | 원어민 음성 제공 | API 기반 TTS 음성 서비스 |
| 한국어 | (신규) | API 기반 TTS 음성 서비스 |

영문 featuresEn도 동일하게 `Native speaker audio` → `API-based TTS voice service` 변경.

### 커밋 이력 (2026-03-26)

| # | 커밋 해시 | 메시지 |
|---|----------|--------|
| 1 | `e795dd9` | feat: 한국어 학습 카드 추가 및 정보처리기사 링크 활성화 |
| 2 | `f56d44a` | fix: 한국어 학습 features 수정 - 원어민 음성 → API 기반 TTS 서비스 |
| 3 | `e5078e7` | feat: 네비게이션 메뉴에 실용 한국어 항목 추가 |
| 4 | `ea9fb27` | fix: 영어·중국어 features도 API 기반 TTS 음성 서비스로 수정 |
| 5 | `4127ce6` | fix: 일본어 features도 API 기반 TTS 음성 서비스로 통일 |
| 6 | `a66e110` | fix: career 푸터 고객지원 정보 dreamitbiz 표준으로 통일 |

### career 푸터 고객지원 수정 - 완료

**변경 파일**: `career/src/components/layout/Footer.jsx`

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 이메일 | support@sangdam.space | aebon@dreamitbiz.com |
| 전화 | 02-1234-5678 | 010-3700-0629 |
| 카카오톡 | (없음) | 카카오톡: aebon |
| 저작권 | &copy; 2025 Career Navigator | &copy; 2020-현재연도 DreamIT Biz |

### 프로젝트 재평가 보고서 작성 - 완료

**변경 파일**: `Dev_md0320/individual-evaluations.md`

| 항목 | 상세 |
|------|------|
| 평가일 | 2026-03-26 (재평가) |
| 평가 대상 | 34개 활성 프로젝트 전체 |
| 주요 변동 | edu-hub 3.5→4/5 승급 (콘텐츠 확장, 테스트 인프라, 배포 스크립트) |
| Phase 1 반영 | 보안 수정, 메타데이터, 배포 스크립트 전체 반영 |
| ESLint 현황 | english/japanese/reactStudy/webstudy ESLint 추가 확인 |

### 신규 3개 프로젝트 발견 및 평가 추가 - 완료

기존 평가에서 누락된 신규 프로젝트 3개를 발견하여 평가 보고서에 추가:

| # | 프로젝트 | 도메인 | 등급 | 기술 스택 |
|---|---------|--------|:----:|----------|
| 1 | **korean** | korean.dreamitbiz.com | 4/5 (B) | React 19+Vite 8+ESLint, AI챗봇, TTS, 2300+단어 |
| 2 | **eip** | eip.dreamitbiz.com | 4.5/5 (A) | React 19+Vite 8+Tailwind 4+Monaco, CBT시험, 코딩실습 |
| 3 | **teaching** | teaching.dreamitbiz.com | 4/5 (B) | React 19+Vite 6, 멀티AI 도구 5종, 5형식 내보내기 |

**변경 파일**:
- `Dev_md0320/individual-evaluations.md` - 34→37개 프로젝트로 확장
- `Dev_md0320/site-architecture.md` - teaching 도메인 추가
- `Dev_md0320/work-log-0325.md` - 작업 이력 추가

### eip 미커밋 변경사항 커밋 & 배포 - 완료

**eip 프로젝트 미커밋 내역** (3,820줄+ 추가):
- 회차 선택 기능 (RoundSelect, PracticalRoundSelect)
- 실기시험 모의고사 (PracticalMockTest, PracticalTestResult)
- 합격 예측 (PassPrediction)
- 필기시험 문제 대폭 확충 (기사/산기/기능사 총 3,500줄+)
- 마이페이지/실기데이터/필기데이터 확장
- Supabase 회원 도메인 추적 추가

---

## 다음 단계 (Phase 2)

| 우선순위 | 작업 | 상태 |
|---------|------|------|
| P2-1 | Vite 버전 통일 (5.x/6.x → 8.x) | 미착수 |
| P2-2 | ESLint 전체 적용 | 미착수 |
| P2-3 | Next.js 16 수동 업그레이드 (pbirobot, books, pbi) | 미착수 |
| P2-4 | ahp_basic xlsx/jsdom 취약점 수동 수정 | 미착수 |
| P2-5 | GitHub 리포지토리 정리 (AHP 백업 Archive) | 미착수 |

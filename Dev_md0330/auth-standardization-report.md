# 로그인/회원가입 표준화 수정 보고서

**작성일**: 2026-03-30
**작업 범위**: 하위 그룹 6개 프로젝트 → edu-hub 수준 표준화

---

## 1. 수정 배경

31개 Supabase 인증 프로젝트 중 14개는 edu-hub 패턴(상위 그룹)을 따르고 있으나, 6개 프로젝트(하위 그룹)는 다음과 같은 문제가 있었음:

- ForgotPassword 기능 부재
- 비밀번호 검증이 6자 최소 길이만 적용
- Login/Register가 합쳐져 있거나 이메일 로그인 자체가 없음

## 2. 표준 패턴 (edu-hub 기반)

| 항목 | 표준 |
|------|------|
| 파일 구조 | Login.jsx / Register.jsx / ForgotPassword.jsx (각각 별도 페이지) |
| 로그인 | OAuth(Google/Kakao) + 이메일 멀티스텝 |
| 회원가입 | displayName + email + password + passwordConfirm |
| 비밀번호 검증 | `/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/` (8자 이상, 영문+숫자) |
| 비밀번호 찾기 | resetPasswordForEmail → 성공 화면 |
| OAuth 에러 감지 | URL 파라미터 error/error_description 파싱 |

## 3. 프로젝트별 수정 내역

### 3.1 coding (coding.dreamitbiz.com)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 수정 | Register 단계 제거, 별도 페이지 Link로 변경, 비밀번호 찾기 링크 추가 |
| `src/pages/Register.jsx` | 신규 생성 | 별도 회원가입 페이지, PW 8자+영숫자 검증, 성공 시 체크마크 화면 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 입력 → 재설정 링크 발송 → 성공 화면 |
| `src/contexts/AuthContext.jsx` | 수정 | resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /register, /forgot-password 라우트 추가 |

**커밋**: `514ceb9` — 5 files changed, 203 insertions(+), 129 deletions(-)

### 3.2 linux-study (linux-study.dreamitbiz.com)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 수정 | Register 단계 제거, 별도 페이지 Link로 변경, 비밀번호 찾기 링크 추가 |
| `src/pages/Register.jsx` | 신규 생성 | 별도 회원가입 페이지, PW 8자+영숫자 검증 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 재설정 페이지 |
| `src/contexts/AuthContext.jsx` | 수정 | resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /register, /forgot-password 라우트 추가 |

**커밋**: `f654c79` — 5 files changed, 203 insertions(+), 129 deletions(-)

### 3.3 ai-prompt (ai-prompt.dreamitbiz.com)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 수정 | 이메일 로그인 단계에 비밀번호 찾기 링크 추가 |
| `src/pages/Register.jsx` | 수정 | PW 검증 강화 (6자 → 8자+영숫자), placeholder 변경 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 재설정 페이지 (AI Prompt 브랜드) |
| `src/contexts/AuthContext.jsx` | 수정 | resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /forgot-password 라우트 추가 |

**커밋**: `b69399a` — 5 files changed, 99 insertions(+), 3 deletions(-)

### 3.4 ai-data (ai-data.dreamitbiz.com)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 수정 | 비밀번호 찾기 링크 추가 |
| `src/pages/Register.jsx` | 수정 | PW 검증 강화 (6자 → 8자+영숫자), placeholder 변경 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 재설정 페이지 (AI Data 브랜드) |
| `src/contexts/AuthContext.jsx` | 수정 | resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /forgot-password 라우트 추가 |

**커밋**: `4d96610` — 5 files changed, 98 insertions(+), 4 deletions(-)

### 3.5 software (software.dreamitbiz.com)

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 수정 | 비밀번호 찾기 링크 추가 |
| `src/pages/Register.jsx` | 수정 | PW 검증 강화 (6자 → 8자+영숫자), placeholder 변경 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 재설정 페이지 (SW Design 브랜드) |
| `src/contexts/AuthContext.jsx` | 수정 | resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /forgot-password 라우트 추가 |

**커밋**: `03fbd3e` — 5 files changed, 95 insertions(+), 2 deletions(-)

### 3.6 python-study (python-study.dreamitbiz.com)

**가장 큰 변경** — OAuth 전용에서 이메일 인증 전면 추가

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/pages/Login.jsx` | 전면 재작성 | OAuth + 이메일 멀티스텝 로그인, 비밀번호 찾기 링크 |
| `src/pages/Register.jsx` | 신규 생성 | 이메일 회원가입, PW 8자+영숫자 검증, 성공 화면 |
| `src/pages/ForgotPassword.jsx` | 신규 생성 | 이메일 재설정 페이지 (PyMaster 브랜드) |
| `src/contexts/AuthContext.jsx` | 수정 | signInWithEmail, signUpWithEmail, resetPassword 함수 추가 |
| `src/App.jsx` | 수정 | /register, /forgot-password 라우트 추가 |
| `src/styles/auth.css` | 수정 | 이메일 인증 폼 스타일 + 다크모드 지원 추가 |

**커밋**: `416414c` — 6 files changed, 427 insertions(+), 30 deletions(-)

## 4. 빌드 검증

| 프로젝트 | 빌드 결과 | 소요 시간 |
|---------|----------|----------|
| coding | 성공 (Vite 8.0) | 1.46s |
| linux-study | 성공 (Vite 7.3) | 5.89s |
| ai-prompt | 성공 (Vite 7.3) | 4.00s |
| ai-data | 성공 (Vite 7.3) | 4.16s |
| software | 성공 (Vite 7.3) | 4.26s |
| python-study | 성공 (Vite 7.3) | 5.52s |

## 5. 배포

모든 6개 프로젝트 GitHub Pages (gh-pages)로 배포 완료.

## 6. 수정 전/후 비교

### Before (하위 그룹)
- ForgotPassword 기능 없음
- 비밀번호 6자 최소만 검증
- coding/linux-study: Login+Register 합침
- python-study: OAuth 전용 (이메일 로그인 불가)

### After (edu-hub 수준)
- 모든 프로젝트에 /forgot-password 페이지 존재
- 비밀번호 8자+영문+숫자 검증 (`/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/`)
- Login/Register 별도 페이지로 분리
- python-study: 이메일 인증 전면 추가
- 모든 Login 페이지에 "비밀번호를 잊으셨나요?" 링크 존재

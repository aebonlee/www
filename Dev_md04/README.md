# DreamIT Biz 개발 문서 (2026-04-04 ~ 04-05)

> 작성일: 2026-04-05
> 프로젝트: dreamitbiz.com 전체 웹 생태계
> GitHub: https://github.com/aebonlee
> 문서 위치: `D:\dreamit-web\www\Dev_md04\`

---

## 문서 목차

| # | 파일명 | 내용 |
|---|--------|------|
| 1 | [01_전체_프로젝트_현황_0404.md](./01_전체_프로젝트_현황_0404.md) | 전체 프로젝트 현황 (2026-04-04) |
| 2 | [02_프로젝트_개별평가_0404.md](./02_프로젝트_개별평가_0404.md) | 프로젝트 개별 평가 (2026-04-04) |
| 3 | [07_Supabase_접두어_마이그레이션.md](./07_Supabase_접두어_마이그레이션.md) | Supabase 테이블 접두어 마이그레이션 (14개 프로젝트) |
| 4 | [08_OG이미지_파비콘_작업내역.md](./08_OG이미지_파비콘_작업내역.md) | OG 이미지 통일 (49개) + 파비콘 생성 (7개) |
| 5 | [09_인증시스템_점검_수정.md](./09_인증시스템_점검_수정.md) | 인증 시스템 전체 점검 및 수정 (9개 프로젝트) |
| 6 | [project-changelog.md](./project-changelog.md) | 프로젝트별 변경 이력 (2026-03-30 ~ 04-05) |
| 7 | [deployment-status.md](./deployment-status.md) | 전체 프로젝트 배포 현황 |
| 8 | [typescript-migration-report.md](./typescript-migration-report.md) | TypeScript 마이그레이션 보고서 |
| 9 | [genspark-supabase-setup.sql](./genspark-supabase-setup.sql) | Genspark Supabase 테이블 설정 SQL |
| 10 | [10_장원준_개인홍보웹_개발.md](./10_장원준_개인홍보웹_개발.md) | 장원준 개인 홍보 웹사이트 개발 (wonjunjang.dreamitbiz.com) |
| 11 | [11_forjob_필기_기출_및_실기빈출.md](./11_forjob_필기_기출_및_실기빈출.md) | ForJob 필기 3,900문항 PDF 추출 + 실기 빈출 177문항 + 버그 수정 |
| 12 | [12_forjob_디스플레이_설정.md](./12_forjob_디스플레이_설정.md) | ForJob 필기시험 2열 보기 + 크기 조절 + 여백 개선 |

---

## 2026-04-05 작업 요약

### 1. 인증 시스템 전체 점검 (36개 프로젝트 감사 → 9개 수정)
- P0: OAuth redirectTo, 테이블명, 프로필 생성 수정
- P1: 메타데이터 통일, AuthContext OAuth 노출, 비밀번호 강화
- P2: visited_sites 도메인 추적

### 2. OG 이미지 생성 + 메타 태그 통일 (49개 프로젝트)
- sharp로 1200×630 PNG 일괄 생성 (5가지 컬러 테마)
- 22개 프로젝트 OG 메타 태그 수정/추가

### 3. 파비콘 생성 (7개 프로젝트)
- SVG + PNG(32/192) + ICO 일괄 생성
- koreait, genspark, chatgpt, english, eip, aebon, html

### 4. 장원준 개인 홍보 웹사이트 개발 (wonjunjang)
- jdy 사이트 디자인 기반으로 취업용 포트폴리오 사이트 제작
- HTML + CSS + JS 정적 사이트, GitHub Pages 배포
- 7개 섹션: Hero, 자기소개, 경력, 강점, 스킬·자격, 활동·수상, 연락하기
- 다크/라이트 모드, 한/영 전환, 반응형 디자인

### 5. ForJob 필기 기출 추출 + 실기 빈출 구현
- 교사용 PDF 39개에서 필기 기출 3,900문항 자동 추출 (2010~2022)
- 해설집 PDF 8개에서 721개 해설 병합
- 실기 5개년 빈출 기출 177문항 데이터 + 전용 페이지 (`/silgi/frequent`)
- 필기시험 시간 오류(150분→100분), 레이아웃 버그, 푸터 고정 수정

### 6. ForJob 필기시험 디스플레이 설정
- 데스크탑 2열 보기 (좌우 2문항 동시 표시, 2개씩 페이지 이동)
- 크기 조절 3단계 (작게/보통/크게 — 폰트, 패딩, 간격 비례 조정)
- 좌우 여백 개선 (padding 40px → 56px)
- 설정 localStorage 저장 (세션 간 유지)

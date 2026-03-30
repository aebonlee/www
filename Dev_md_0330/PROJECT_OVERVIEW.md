# DreamIT Biz 프로젝트 전체 현황

**작성일**: 2026-03-30

## 인프라 현황

| 항목 | 내용 |
|------|------|
| 전체 프로젝트 수 | 45개 |
| 배포 프로젝트 수 | 40개 |
| 호스팅 | GitHub Pages (gh-pages) |
| 도메인 패턴 | *.dreamitbiz.com |
| 백엔드 | Supabase (31+ 프로젝트) |
| 결제 | PortOne (5개 프로젝트) |
| GitHub 계정 | aebonlee |

## 기술 스택

### Vite + React 프로젝트 (38개)
- React 19 + Vite 7~8
- Tailwind CSS 4
- React Router v7
- 배포: `npx gh-pages -d dist`

### Next.js 프로젝트 (2개)
- pbirobot, books
- Next.js 16
- 배포: `npx gh-pages -d out`

### 예외
- koreait: React 18 / Vite 6 / Tailwind 3 (업그레이드 필요)

## 결제 연동 프로젝트 (PortOne)
1. competency
2. edu-hub
3. career
4. allthat
5. papers

## 미배포 프로젝트
- database_test — 개발 테스트용
- ahp_app — CNAME 없음
- ahp — CNAME 없음
- jdy — CNAME 없음
- pbi — 불확실

## 주요 사이트 분류

### 교육 플랫폼
- edu-hub: 통합 교육 허브
- teaching: AI 활용 교수법
- coding: 코딩 교육
- koreait: 코리아IT아카데미

### AI/기술
- ai-media: 생성형 AI 미디어
- ai-prompt: AI 프롬프트 엔지니어링
- ai-data: AI 데이터 분석
- autowork: 업무 자동화

### 프로그래밍 학습
- python-study: 파이썬
- c-study: C 프로그래밍
- java-study: 자바
- reactStudy: React
- webstudy: 웹 백엔드
- data-structure: 자료구조
- algorithm: 알고리즘

### IT 인프라/자격증
- linux-study: 리눅스
- db-study: 데이터베이스
- software: 소프트웨어 설계
- eip: 정보처리기사
- koreatech: 한국공학

### 비즈니스/마케팅
- career: 커리어 네비게이터
- competency: 핵심역량
- marketing: 마케팅
- self-branding: 셀프 브랜딩
- uxdesign: 고객경험디자인
- digitalbiz: 디지털 비즈니스
- allthat: ESG 경영

### 어학
- english: 영어
- japanese: 일본어
- korean: 한국어
- presentation: 프레젠테이션

### 유틸리티/기타
- openclaw: 법률 AI
- papers: 논문/자료
- reserve: 예약 시스템
- docs: 문서 라이브러리
- templete-ref: 템플릿 레퍼런스
- aebon: 개인 포트폴리오
- ahp_basic: AHP 분석
- hohai: 호해
- books: 도서
- pbirobot: PBI 로봇

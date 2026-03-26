# 사이트 아키텍처 & 도메인 구조도

> 작성일: 2026-03-25

---

## 1. 도메인 구조

```
dreamitbiz.com (부모 도메인)
│
├── www.dreamitbiz.com .................. 메인 포털 (부모 사이트)
│
├─── 핵심 서비스 ─────────────────────────
│   ├── ahp-basic.dreamitbiz.com ....... AHP 의사결정 분석 도구 (최종본)
│   ├── competency.dreamitbiz.com ...... 4차 산업혁명 8대 핵심역량 검사
│   ├── books.dreamitbiz.com ........... DreamIT 출판 서브사이트
│   ├── pbirobot.dreamitbiz.com ........ PBI 로봇 플랫폼
│   ├── edu-hub.dreamitbiz.com ......... 교육 허브 (결제 포함)
│   └── hohai.dreamitbiz.com ........... Hohai 서비스
│
├─── 교육/학습 콘텐츠 사이트 ──────────────
│   ├── coding.dreamitbiz.com .......... 코딩 학습 (코드에디터 + PDF)
│   ├── c-study.dreamitbiz.com ......... C언어 학습 (JSCPP 실행기)
│   ├── python-study.dreamitbiz.com .... 파이썬 학습 (코드에디터)
│   ├── java-study.dreamitbiz.com ...... 자바 학습 (코드에디터)
│   ├── koreatech.dreamitbiz.com ....... 컴퓨팅 사고력 (코드에디터)
│   ├── algorithm.dreamitbiz.com ....... 알고리즘 학습
│   ├── data-structure.dreamitbiz.com .. 자료구조 학습
│   ├── linux-study.dreamitbiz.com ..... 리눅스 학습 (PDF 내보내기)
│   ├── db-study.dreamitbiz.com ........ 데이터베이스 학습
│   ├── software.dreamitbiz.com ........ 소프트웨어 설계
│   ├── ai-prompt.dreamitbiz.com ....... AI 프롬프트 학습
│   ├── ai-data.dreamitbiz.com ......... AI 데이터 학습
│   ├── reactStudy.dreamitbiz.com ...... React 학습
│   └── webstudy.dreamitbiz.com ........ 웹 백엔드 학습
│
├─── 비즈니스/전문 사이트 ──────────────
│   ├── career.dreamitbiz.com .......... 상담공간 - 커리어 상담 플랫폼
│   ├── digitalbiz.dreamitbiz.com ...... 디지털 비즈니스 전략
│   ├── marketing.dreamitbiz.com ....... 마케팅
│   ├── uxdesign.dreamitbiz.com ........ UX/CXD 디자인
│   ├── self-branding.dreamitbiz.com ... 셀프 브랜딩
│   ├── koreait.dreamitbiz.com ......... Korea IT 대시보드
│   ├── jdy.dreamitbiz.com ............ 정동엽 박사 미래직업연구소
│   └── teaching.dreamitbiz.com ....... AI 교수학습 도구 (신규 2026-03-26)
│
├─── 언어 학습 사이트 ──────────────────
│   ├── english.dreamitbiz.com ......... 영어 학습
│   ├── japanese.dreamitbiz.com ........ 일본어 학습
│   └── korean.dreamitbiz.com .......... 한국어 학습 (신규 2026-03-26)
│
├─── 자격증 학습 사이트 ──────────────────
│   └── eip.dreamitbiz.com ............. 정보처리기사 (링크 활성화 2026-03-26)
│
├─── 서브사이트 (templete-ref 기반) ────
│   ├── allthat.dreamitbiz.com ......... 올댓 ESG (별개 사이트)
│   ├── papers.dreamitbiz.com .......... 페이퍼스 (별개 사이트)
│   ├── reserve.dreamitbiz.com ......... 예약 시스템
│   └── docs.dreamitbiz.com ............ 문서 시스템
│
├─── 개발 참조/백업 ──────────────────────
│   ├── templete-ref ................... 서브사이트 공통 템플릿 원본
│   ├── ahp / ahp_app ................. AHP 개발 이력 (백업)
│   ├── pbi ........................... pbirobot 관련 (백업/개발용)
│   ├── database_test .................. DB 시험용 서버
│   └── aebon .......................... 포트폴리오 사이트
│
└─── 특수 ────────────────────────────────
    └── database_test .................. Node.js+Express 독립 서버 (PostgreSQL)
```

---

## 2. 기술 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     클라이언트 (브라우저)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  React SPA   │  │  Next.js SSR  │  │  바닐라 JS     │  │
│  │  (35개 사이트) │  │  (2개 사이트)   │  │  (1개 - jdy)   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────────┘  │
│         │                │                              │
│  ┌──────┴──────┐  ┌──────┴───────┐                      │
│  │  Vite 빌드   │  │  Next.js 빌드 │                      │
│  │  (5.x~8.x)  │  │  (v16)       │                      │
│  └──────┬──────┘  └──────┬───────┘                      │
│         │                │                              │
├─────────┴────────────────┴──────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              GitHub Pages (정적 호스팅)              │   │
│  │              *.dreamitbiz.com DNS                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Supabase (BaaS)                      │   │
│  │  ┌──────────┐ ┌───────────┐ ┌─────────────────┐  │   │
│  │  │ Auth     │ │ Database  │ │ Storage         │  │   │
│  │  │ (인증)    │ │ (PostgreSQL)│ │ (파일 저장)      │  │   │
│  │  └──────────┘ └───────────┘ └─────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌────────────────────────────┐   │
│  │ PortOne V1 결제   │  │ Django 백엔드 (AHP 전용)     │   │
│  │ (4개 사이트)       │  │ ahp-django-service          │   │
│  └──────────────────┘  │ (Render.com 배포)            │   │
│                        └────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 배포 파이프라인

```
로컬 개발 (D:\dreamit-web\{project})
    │
    ├── npm run build (Vite / Next.js)
    │
    ├── npm run deploy (gh-pages -d dist/build)
    │       │
    │       └── GitHub Pages 자동 배포
    │               │
    │               └── CNAME: {subdomain}.dreamitbiz.com
    │
    └── git push origin main
            │
            └── GitHub Repository (aebonlee/{project})
```

---

## 4. 데이터 흐름

```
사용자 → *.dreamitbiz.com → GitHub Pages (정적 파일)
                                    │
                                    ├── Supabase API 호출
                                    │   ├── 인증 (Auth)
                                    │   ├── 데이터 CRUD (Database)
                                    │   └── 파일 업로드 (Storage)
                                    │
                                    ├── PortOne 결제 (competency, allthat, papers, templete-ref, edu-hub)
                                    │
                                    └── Django API (AHP 전용)
                                        └── ahp-django-backend.onrender.com
```

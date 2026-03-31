# 전체 웹 프로젝트 TypeScript 마이그레이션 보고서

**작성일**: 2026-04-01
**작업자**: Claude Opus 4.6

---

## 1. 개요

DreamIT 전체 45개 웹 프로젝트 중 JavaScript(JSX/JS)로 작성된 38개 프로젝트를 strict TypeScript(TSX/TS)로 완전 마이그레이션하는 대규모 작업입니다.

### 작업 전 현황

| 항목 | 상태 |
|------|------|
| TypeScript 프로젝트 | 3개 (hohai, books, pbirobot) |
| JavaScript 프로젝트 | 38개 |
| strict 타입 체크 | 없음 |
| tsconfig.json | 3개만 보유 |

### 목표

- 모든 프로젝트에 `strict: true` TypeScript 적용
- `.jsx` → `.tsx`, `.js` → `.ts` 파일 확장자 변경
- 모든 함수/변수에 명시적 타입 어노테이션
- `any` 타입 사용 금지
- `tsc --noEmit` 에러 0개 통과
- `tsc -b && vite build` 빌드 성공

---

## 2. 마이그레이션 단계 (프로젝트별 8단계)

### Step 1: TypeScript 패키지 설치
```bash
npm install -D typescript@~5.7.0 @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### Step 2: tsconfig.json 생성
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
```

### Step 3: `src/vite-env.d.ts` 생성
```typescript
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Step 4: `vite.config.js` → `vite.config.ts` 변환

### Step 5: 파일명 변경 (의존성 순서)
1. `src/utils/*.js` → `*.ts`
2. `src/config/*.js` → `*.ts`
3. `src/hooks/*.js` → `*.ts`
4. `src/contexts/*.jsx` → `*.tsx`
5. `src/components/**/*.jsx` → `*.tsx`
6. `src/pages/**/*.jsx` → `*.tsx`
7. `src/App.jsx` → `App.tsx`, `src/main.jsx` → `main.tsx`
8. `index.html`에서 `src/main.tsx` 참조 변경

### Step 6: 타입 어노테이션 추가
- Props interface, 리턴 타입, useState 제네릭, createContext 타입
- 이벤트 핸들러 타입 (`React.FormEvent`, `React.ChangeEvent<HTMLInputElement>`)
- `(err as Error).message`, `Record<string, unknown>`

### Step 7: 빌드 & 검증
```bash
npx tsc --noEmit    # 0 에러 확인
npx vite build      # dist/ 생성 성공
```

### Step 8: 커밋 → 푸시 → 배포
```bash
git add -A && git commit -m "Migrate to TypeScript with strict mode"
git push origin main
npx gh-pages -d dist
```

---

## 3. 배치별 진행 현황

### Batch 0: competency (부분 마이그레이션 → 완료)
| 프로젝트 | 파일 수 | 상태 |
|----------|---------|------|
| competency | ~62 files | **완료** - contexts/utils 이미 .ts, pages/components .jsx→.tsx 변환 |

**주요 작업**: 52개 pages + 10개 components .jsx→.tsx 변환, PortOne V2 타입 패턴 확립

---

### Batch 1: 가장 단순한 프로젝트 (Supabase 없음)
| 프로젝트 | 파일 수 | 상태 |
|----------|---------|------|
| aebon | ~30 files | **완료** - 라우터/Supabase 없는 단순 프로젝트 |
| reactStudy | ~19 files | **완료** - 라우터만 사용 |
| webstudy | ~15 files | **완료** - 라우터만 사용 |

---

### Batch 2: 소규모 Supabase 프로젝트
| 프로젝트 | 파일 수 | 상태 |
|----------|---------|------|
| docs | ~20 files | **완료** |
| templete-ref | ~18 files | **완료** |
| reserve | ~25 files | **완료** |
| algorithm | ~22 files | **완료** |
| data-structure | ~20 files | **완료** |

---

### Batch 3: 중규모 학습 사이트
| 프로젝트 | 파일 수 | 상태 |
|----------|---------|------|
| db-study | ~25 files | **완료** |
| linux-study | ~30 files | **완료** |
| english | ~28 files | **완료** |
| japanese | ~28 files | **완료** |
| korean | ~28 files | **완료** |

---

### Batch 4: 중규모 콘텐츠 사이트
| 프로젝트 | 변경 파일 수 | 상태 | 비고 |
|----------|-------------|------|------|
| presentation | ~35 files | **완료** | 빌드/배포 완료 |
| digitalbiz | 78 files (619+/336-) | **완료** | 커밋 dea1d9a, 배포 완료 |
| eip | 58 files (450+/210-) | **완료** | 커밋 18cebc9, 배포 완료 |
| self-branding | ~158 files | **완료** | 커밋 fe49ce7, 빌드 성공, 배포 중 |
| teaching | ~167 files | **진행중** | 120개 에러 수정 중 (3개 파일) |

**eip 주요 작업**:
- CodeEditor, PassPrediction에 Props interface 추가
- TestResult[], CodeSubmission[], PracticalQuestion[] 등 state 타입 정의
- certTypes 인덱싱 `as keyof typeof certTypes`
- CSS custom property `as React.CSSProperties` 캐스트

**self-branding 주요 작업**:
- 4개 Context 완전 재작성 (AuthContext, ThemeContext, LanguageContext, ToastContext)
- Navbar, SearchModal, Pagination 등 컴포넌트 타입 추가
- supabase.ts의 `.catch()` → `try/catch` 패턴 변환
- 40+ 페이지 파일의 implicit any/unused vars 수정

**teaching 잔여 작업** (진행중):
- `PromptPractice.tsx`: 90개 에러 (대규모 인터랙티브 페이지)
- `Resources.tsx`: 28개 에러 (인덱스 시그니처 이슈)
- `AIChecklist.tsx`: 2개 에러 (거의 완료)

---

### Batch 5~9: 미진행
| 배치 | 프로젝트 | 상태 |
|------|----------|------|
| Batch 5 | coding, python-study, c-study, java-study | 대기 |
| Batch 6 | ai-prompt, ai-data, ai-media, software, marketing | 대기 |
| Batch 7 | koreatech, openclaw, autowork, uxdesign | 대기 |
| Batch 8 | edu-hub, allthat, papers, career (PortOne) | 대기 |
| Batch 9 | koreait, ahp_basic | 대기 |

---

## 4. 공통 타입 패턴

### AuthContext 타입
```typescript
interface UserProfile { id: string; email?: string; role?: string; visited_sites?: string[]; }
interface AuthContextValue {
  user: User | null; profile: UserProfile | null;
  loading: boolean; isLoggedIn: boolean; isAdmin: boolean;
  signOut: () => Promise<void>; refreshProfile: () => Promise<void>;
  accountBlock: AccountBlock | null; clearAccountBlock: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);
```

### ThemeContext 타입
```typescript
type ThemeMode = 'light' | 'dark' | 'auto';
interface ThemeContextValue {
  theme: string; mode: ThemeMode; toggleTheme: () => void;
  colorTheme: string; setColorTheme: (color: string) => void;
}
```

### Supabase RPC 에러 패턴
```typescript
// Before (JS): supabase.rpc('fn', params).catch(() => {});
// After (TS):
try { await supabase.rpc('fn', params); } catch { /* silent */ }
```

### 이벤트 핸들러 타입
```typescript
const handleSubmit = async (e: React.FormEvent) => { ... }
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
```

---

## 5. 주의사항 & 트러블슈팅

### Windows 환경 이슈
- `NUL`/`nul` 아티팩트 파일 → `.gitignore`에 추가
- CRLF 경고 → 무시 가능 (기능에 영향 없음)
- 서브에이전트에서 bash 특수문자(꺾쇠 `<>`) 이스케이프 필요

### 타입 에러 해결 패턴
| 에러 | 해결법 |
|------|--------|
| `Parameter 'e' implicitly has an 'any' type` | `(e: React.FormEvent)` 추가 |
| `'err' is of type 'unknown'` | `(err as Error).message` |
| `not assignable to parameter of type 'never[]'` | `useState<Type[]>([])` |
| `'user' is possibly 'null'` | `user!.id` 또는 `if (!user) return` |
| `No index signature` | `Record<string, Type>` 또는 `as keyof typeof obj` |
| `.catch()` does not exist | `try { await ... } catch { }` |

### koreait 특수 처리 (Batch 9)
- React 18.3.1 / Vite 6 / Tailwind 3 / react-router-dom v6
- `@types/react@^18` 사용 (19 아님)
- `noUncheckedSideEffectImports` 제거 필요

---

## 6. 진행률 요약

| 구분 | 완료 | 진행중 | 대기 | 합계 |
|------|------|--------|------|------|
| 프로젝트 | 18 | 1 | 19 | 38 |
| 배치 | 4.8/10 | 0.2/10 | 5/10 | 10 |

**완료 프로젝트 (18개)**:
competency, aebon, reactStudy, webstudy, docs, templete-ref, reserve, algorithm, data-structure, db-study, linux-study, english, japanese, korean, presentation, digitalbiz, eip, self-branding

**진행중 (1개)**: teaching (120 에러 → 수정중)

**대기 (19개)**: coding, python-study, c-study, java-study, ai-prompt, ai-data, ai-media, software, marketing, koreatech, openclaw, autowork, uxdesign, edu-hub, allthat, papers, career, koreait, ahp_basic

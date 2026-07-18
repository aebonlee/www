-- ============================================================
-- 보존본: 2026-07-18 대표가 채팅으로 전달·SQL Editor에서 실행한 원본.
-- 실행 시점에 검토 권고 3건(가입 트리거 예외처리, 뷰 security_invoker,
-- 기존 회원 백필)이 있었음 — 실제 적용 여부는 SQL Editor 실행분 기준.
-- ============================================================
-- www 회원 총괄 스키마 (2026-07-18 대표 확정 규칙 반영)
-- 규칙: 회원 DB 통합 운영, 전 사이트 가입 시 기본 정보 입력 + 가입 출처 기록,
--       www에서 출처별 총괄 관리 (전역 CLAUDE.md §3.3)
-- 접두사 규칙(§3.1)에 따라 전부 www_ 접두사 사용
-- 실행 위치: Supabase SQL Editor (프로젝트 hcmgdztsgjvzcyxyayaj)
-- ============================================================

-- 1. 프로필 테이블 (전 사이트 공용 — 회원은 하나이므로 사이트 접두사가 아니라 www_ 소속)
create table if not exists public.www_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  -- 필수 3종: OAuth 가입 시점에는 비어 있을 수 있어 nullable.
  -- 온보딩 화면에서 입력 강제, 완성 여부는 is_complete로 판정.
  name         text,                          -- 정확한 개인 이름 (실명)
  phone        text,                          -- 연락처 (휴대폰)
  email        text,                          -- 이메일 (auth email과 다를 수 있어 별도 보관)
  -- 선택 항목
  org          text,                          -- 소속 기관
  course       text,                          -- 수강 과정
  -- 가입 출처 (핵심 요건)
  signup_site  text,                          -- 가입한 사이트 id (예: 'mju', 'skala', 'www')
  signup_at    timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- 필수 3종 완성 여부 (앱에서 온보딩 강제 판정용)
  is_complete  boolean generated always as (
    name is not null and phone is not null and email is not null
  ) stored
);

comment on table  public.www_profiles is '전 사이트 통합 회원 프로필 — www 총괄 관리';
comment on column public.www_profiles.signup_site is '가입 출처 사이트 id — www 관리 화면 출처별 조회 키';

-- 출처별·완성여부별 조회용 인덱스 (www 관리 화면)
create index if not exists www_profiles_signup_site_idx on public.www_profiles (signup_site);
create index if not exists www_profiles_org_idx         on public.www_profiles (org);
create index if not exists www_profiles_course_idx      on public.www_profiles (course);

-- 2. updated_at 자동 갱신 트리거
create or replace function public.www_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists www_profiles_set_updated_at on public.www_profiles;
create trigger www_profiles_set_updated_at
  before update on public.www_profiles
  for each row execute function public.www_set_updated_at();

-- 3. 가입 시 프로필 행 자동 생성 트리거
--    이메일 가입: signUp({ options: { data: { signup_site: '<사이트id>' } } })로 심은
--    메타데이터를 여기서 읽어 기록.
--    OAuth 가입: 메타데이터가 없으므로 signup_site는 null로 생성 →
--    온보딩 화면에서 localStorage 값으로 채움.
create or replace function public.www_handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.www_profiles (user_id, email, signup_site)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'signup_site', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists www_on_auth_user_created on auth.users;
create trigger www_on_auth_user_created
  after insert on auth.users
  for each row execute function public.www_handle_new_user();

-- 4. RLS
alter table public.www_profiles enable row level security;

-- 본인 행 조회
drop policy if exists www_profiles_select_own on public.www_profiles;
create policy www_profiles_select_own
  on public.www_profiles for select
  using (auth.uid() = user_id);

-- 본인 행 수정 (온보딩 입력 포함)
drop policy if exists www_profiles_update_own on public.www_profiles;
create policy www_profiles_update_own
  on public.www_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 관리자 전체 조회 (www 총괄 화면용)
-- 관리자 목록 테이블: 대표 계정 등록 후 사용
create table if not exists public.www_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note    text
);
alter table public.www_admins enable row level security;

-- www_admins 자체는 관리자만 조회 (재귀 방지를 위해 security definer 함수 사용)
create or replace function public.www_is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.www_admins where user_id = auth.uid());
$$;

drop policy if exists www_admins_select_admin on public.www_admins;
create policy www_admins_select_admin
  on public.www_admins for select
  using (public.www_is_admin());

drop policy if exists www_profiles_select_admin on public.www_profiles;
create policy www_profiles_select_admin
  on public.www_profiles for select
  using (public.www_is_admin());

drop policy if exists www_profiles_update_admin on public.www_profiles;
create policy www_profiles_update_admin
  on public.www_profiles for update
  using (public.www_is_admin())
  with check (public.www_is_admin());

-- 5. www 관리 화면용 출처별 집계 뷰
create or replace view public.www_signup_stats as
  select
    coalesce(signup_site, '(미기록)') as signup_site,
    count(*)                          as total,
    count(*) filter (where is_complete)     as complete,
    count(*) filter (where not is_complete) as incomplete,
    min(signup_at)                    as first_signup,
    max(signup_at)                    as last_signup
  from public.www_profiles
  group by coalesce(signup_site, '(미기록)');

-- ============================================================
-- 실행 후 수동 1건: 대표 계정을 관리자로 등록
-- insert into public.www_admins (user_id, note)
-- values ('<대표 auth user_id>', '대표 계정');
-- (user_id는 Supabase Dashboard > Authentication > Users에서 확인)
-- ============================================================

-- ============================================================
-- [검토 권고 3건 — 2026-07-18 리뷰, 적용 여부 미확인 시 참고]
-- ① www_handle_new_user 예외처리: 트리거 예외가 전 사이트 가입을 막지 않게
--    insert를 begin…exception when others then raise warning…end로 감싸기
--    (2026-06-19 전 사이트 가입 마비 사고 재발 방지 — 전역 CLAUDE.md 메모리 참조)
-- ② www_signup_stats 뷰는 definer 실행이라 RLS 우회 노출 —
--    create or replace view … with (security_invoker = on) 권장
-- ③ 기존 회원 백필 (트리거는 신규 가입만 발동):
--    insert into public.www_profiles (user_id, email, signup_at)
--    select id, email, created_at from auth.users
--    on conflict (user_id) do nothing;
-- ============================================================

-- [실행 이력] 2026-07-18 SQL Editor에서 전체 실행 완료.
-- www_admins 등록 완료 2건: aebon@kakao.com(카카오), aebon@kyonggi.ac.kr(구글)
--   (이메일 기반 insert ... select 방식 사용, §3.3 대표 계정 2종 규칙 참조)

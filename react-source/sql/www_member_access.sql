-- ============================================================
-- www 접근 3등급 체계 — 회원 판정 함수 + RLS/Storage 정책 템플릿
-- (2026-07-18 대표 확정, 전역 CLAUDE.md §3.3)
--
-- 3등급: 공개 / 회원(로그인 + www_profiles.is_complete) / 관리자(www_admins)
-- 회원 콘텐츠는 화면(MemberGate) + DB(RLS) + Storage(private) 3겹 잠금.
-- 로그인만으로 회원 간주 금지 — 프로필 미완성자는 www 총괄에서 식별 불가.
--
-- 실행 위치: Supabase SQL Editor (프로젝트 hcmgdztsgjvzcyxyayaj) — 대표가 직접 실행.
-- 1번(함수)만 실제 실행 대상이고, 2·3번은 사이트별 적용 시 접두어_를
-- 사이트 접두사로 바꿔 쓰는 템플릿(§3.1 플레이스홀더 표기 규칙).
-- www_profiles 스키마 변경 없음 (확정본 유지).
-- ============================================================

-- 1. 회원 판정 함수 — www_is_admin()과 같은 패턴 (security definer + search_path 고정)
create or replace function public.www_is_member()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.www_profiles
    where user_id = auth.uid()
      and is_complete
  );
$$;

comment on function public.www_is_member() is
  '회원 판정: 로그인 + www_profiles.is_complete=true. 접근 3등급(공개/회원/관리자)의 회원 기준';

-- ============================================================
-- 2. [템플릿] 회원 전용 테이블 RLS 정책 — 접두어_ 를 사이트 접두사로 교체 후 사용
--    조회 = 회원(www_is_member), 등록·수정·삭제 = 관리자(www_is_admin)
-- ============================================================

-- alter table public.접두어_materials enable row level security;
--
-- drop policy if exists 접두어_materials_select_member on public.접두어_materials;
-- create policy 접두어_materials_select_member
--   on public.접두어_materials for select
--   using (public.www_is_member());
--
-- drop policy if exists 접두어_materials_write_admin on public.접두어_materials;
-- create policy 접두어_materials_write_admin
--   on public.접두어_materials for all
--   using (public.www_is_admin())
--   with check (public.www_is_admin());

-- ============================================================
-- 3. [원칙+템플릿] Storage
--    - 회원 자료 = private 버킷(public=false) + www_is_member() 조회 정책
--    - 공개 자료만 public 버킷
--    - 기존 버킷 이동·변경은 하지 않는다(별도 승인 후). 아래는 신규 버킷용 예시.
-- ============================================================

-- private 버킷 생성 (Dashboard > Storage에서 만들어도 동일):
-- insert into storage.buckets (id, name, public)
-- values ('접두어-materials', '접두어-materials', false)
-- on conflict (id) do nothing;
--
-- 회원 조회 정책:
-- drop policy if exists "접두어_materials_read_member" on storage.objects;
-- create policy "접두어_materials_read_member"
--   on storage.objects for select
--   using (bucket_id = '접두어-materials' and public.www_is_member());
--
-- 관리자 업로드·수정·삭제 정책:
-- drop policy if exists "접두어_materials_write_admin" on storage.objects;
-- create policy "접두어_materials_write_admin"
--   on storage.objects for all
--   using (bucket_id = '접두어-materials' and public.www_is_admin())
--   with check (bucket_id = '접두어-materials' and public.www_is_admin());

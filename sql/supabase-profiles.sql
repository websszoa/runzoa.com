-- ============================================
-- 실행 순서: 1. supabase-profiles.sql
--            2. supabase-function.sql
-- ============================================

-- ============================================
-- 프로필 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  signup_provider TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  visit_count INTEGER DEFAULT 0 NOT NULL CHECK (visit_count >= 0),
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  last_visited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 기존 테이블 보완
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_visited_at TIMESTAMPTZ;

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted
  ON public.profiles(is_deleted);
CREATE INDEX IF NOT EXISTS idx_profiles_last_visited_at
  ON public.profiles(last_visited_at);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at
  ON public.profiles(created_at DESC);

-- ============================================
-- 관리자 권한 확인
-- RLS 정책 안에서도 안전하게 사용할 수 있도록 프로필 행 하나만 확인한다.
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
      AND is_deleted = FALSE
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 과거 정책을 포함해 재실행 시 충돌하는 정책 제거
DROP POLICY IF EXISTS "회원 닉네임 전체 조회" ON public.profiles;
DROP POLICY IF EXISTS "본인 프로필 조회" ON public.profiles;
DROP POLICY IF EXISTS "본인 프로필 수정" ON public.profiles;
DROP POLICY IF EXISTS "관리자 전체 프로필 조회" ON public.profiles;

-- 로그인 회원은 본인 프로필만 조회할 수 있다.
-- 탈퇴 여부 확인을 위해 탈퇴된 본인 행도 조회 대상에 포함한다.
CREATE POLICY "본인 프로필 조회"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

-- 관리자 여부 검사는 SECURITY DEFINER 함수에서 수행해 RLS 재귀를 피한다.
CREATE POLICY "관리자 전체 프로필 조회"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 활성 회원은 본인 프로필만 수정할 수 있다.
-- 실제 수정 가능 컬럼은 아래 컬럼 권한에서 한 번 더 제한한다.
CREATE POLICY "본인 프로필 수정"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()) AND is_deleted = FALSE)
WITH CHECK (id = (SELECT auth.uid()) AND is_deleted = FALSE);

-- ============================================
-- 테이블 권한
-- ============================================
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM authenticated;

GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, last_visited_at)
  ON TABLE public.profiles
  TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.profiles
  TO service_role;

-- ============================================
-- 실행 순서: supabase-profiles.sql 실행 후 적용
-- ============================================

-- ============================================
-- updated_at 자동 갱신
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_trg_set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_trg_set_updated_at() FROM anon;
REVOKE ALL ON FUNCTION public.fn_trg_set_updated_at() FROM authenticated;

DROP TRIGGER IF EXISTS trg_profiles_before_update ON public.profiles;
CREATE TRIGGER trg_profiles_before_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_set_updated_at();

-- ============================================
-- 일별 방문 횟수 보호
-- 사용자가 전달한 값은 무시하고 트리거가 하루 한 번만 증가시킨다.
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_record_daily_visit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.is_deleted = FALSE
    AND (
      OLD.last_visited_at IS NULL
      OR OLD.last_visited_at < (
        DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Seoul')
        AT TIME ZONE 'Asia/Seoul'
      )
    )
  THEN
    NEW.visit_count := OLD.visit_count + 1;
    NEW.last_visited_at := NOW();
  ELSE
    NEW.visit_count := OLD.visit_count;
    NEW.last_visited_at := OLD.last_visited_at;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_trg_record_daily_visit() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_trg_record_daily_visit() FROM anon;
REVOKE ALL ON FUNCTION public.fn_trg_record_daily_visit() FROM authenticated;

DROP TRIGGER IF EXISTS trg_profiles_record_daily_visit ON public.profiles;
CREATE TRIGGER trg_profiles_record_daily_visit
BEFORE UPDATE OF last_visited_at ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_record_daily_visit();

-- ============================================
-- 회원가입 시 프로필 자동 생성
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_insert_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  provider_name TEXT;
BEGIN
  provider_name := NEW.raw_app_meta_data->>'provider';

  -- 네이버 Custom OAuth 식별자는 관리자 UI에서 사용하는 값으로 정규화한다.
  IF provider_name = 'custom:naver' THEN
    provider_name := 'naver';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    signup_provider,
    role,
    visit_count,
    is_deleted
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'user_name'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    provider_name,
    'user',
    0,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_trg_insert_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_trg_insert_profile() FROM anon;
REVOKE ALL ON FUNCTION public.fn_trg_insert_profile() FROM authenticated;

DROP TRIGGER IF EXISTS trg_auth_users_after_insert ON auth.users;
CREATE TRIGGER trg_auth_users_after_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_insert_profile();

-- 이전 버전에서 사용하던 보정 RPC는 가입 트리거와 아래 백필로 대체한다.
-- 배포 DB에 남은 함수까지 제거해야 Security Advisor 경고가 사라진다.
DROP FUNCTION IF EXISTS public.ensure_my_profile();

-- 현재 사용하지 않는 이름 중복 확인 RPC와 외부 실행 권한을 제거한다.
DROP FUNCTION IF EXISTS public.is_full_name_available(TEXT);

-- ============================================
-- 본인 계정 탈퇴 여부 확인
-- ============================================
CREATE OR REPLACE FUNCTION public.is_my_account_deleted()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (
      SELECT is_deleted
      FROM public.profiles
      WHERE id = (SELECT auth.uid())
    ),
    FALSE
  );
$$;

REVOKE ALL ON FUNCTION public.is_my_account_deleted() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_my_account_deleted() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_my_account_deleted() TO authenticated;

-- ============================================
-- 일별 방문 기록 요청
-- 실제 횟수와 시간은 위 보호 트리거에서 결정한다.
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_visit_count()
RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY INVOKER
SET search_path = ''
AS $$
  UPDATE public.profiles
  SET last_visited_at = NOW()
  WHERE id = (SELECT auth.uid())
    AND is_deleted = FALSE;
$$;

REVOKE ALL ON FUNCTION public.increment_visit_count() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_visit_count() FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_visit_count() TO authenticated;

-- ============================================
-- 기존 Auth 회원 프로필 백필
-- ============================================
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  signup_provider,
  role,
  visit_count,
  is_deleted
)
SELECT
  users.id,
  users.email,
  COALESCE(
    users.raw_user_meta_data->>'full_name',
    users.raw_user_meta_data->>'name',
    users.raw_user_meta_data->>'user_name'
  ),
  COALESCE(
    users.raw_user_meta_data->>'avatar_url',
    users.raw_user_meta_data->>'picture'
  ),
  CASE
    WHEN users.raw_app_meta_data->>'provider' = 'custom:naver' THEN 'naver'
    ELSE users.raw_app_meta_data->>'provider'
  END,
  'user',
  0,
  FALSE
FROM auth.users AS users
ON CONFLICT (id) DO NOTHING;

-- PostgREST가 변경된 RPC 보안 속성과 제거된 함수를 즉시 반영한다.
NOTIFY pgrst, 'reload schema';

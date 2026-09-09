-- 카카오 로그인 및 캘린더 API 연결 토큰
CREATE TABLE IF NOT EXISTS public.kakao_connections (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.kakao_connections ENABLE ROW LEVEL SECURITY;

-- 토큰 테이블은 서버 전용입니다. 일반 API 사용자의 모든 접근을 명시적으로 차단합니다.
-- service_role은 RLS를 우회하므로 서버의 로그인/토큰 갱신은 유지됩니다.
DROP POLICY IF EXISTS "kakao_connections_deny_client_access"
  ON public.kakao_connections;
CREATE POLICY "kakao_connections_deny_client_access"
  ON public.kakao_connections
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON TABLE public.kakao_connections FROM PUBLIC;
REVOKE ALL ON TABLE public.kakao_connections FROM anon;
REVOKE ALL ON TABLE public.kakao_connections FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.kakao_connections
  TO service_role;

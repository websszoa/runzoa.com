-- 네이버 로그인 및 캘린더 API 연결 토큰
CREATE TABLE IF NOT EXISTS public.naver_connections (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  naver_user_id TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.naver_connections ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.naver_connections FROM PUBLIC;
REVOKE ALL ON TABLE public.naver_connections FROM anon;
REVOKE ALL ON TABLE public.naver_connections FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.naver_connections
  TO service_role;

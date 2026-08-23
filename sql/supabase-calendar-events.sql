-- 외부 캘린더에 추가한 마라톤 일정 내역
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('naver', 'google', 'kakao')),
  marathon_slug TEXT NOT NULL,
  marathon_name TEXT NOT NULL,
  event_start_date DATE NOT NULL,
  event_end_date DATE NOT NULL,
  event_location TEXT,
  external_event_id TEXT,
  provider_calendar_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'created', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider, marathon_slug)
);

-- 기존 테이블에도 안전하게 상태 컬럼을 추가합니다.
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE public.calendar_events
SET status = 'created'
WHERE status IS NULL;

ALTER TABLE public.calendar_events
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'calendar_events_status_check'
      AND conrelid = 'public.calendar_events'::regclass
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_status_check
      CHECK (status IN ('pending', 'created', 'failed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_created
  ON public.calendar_events (user_id, created_at DESC);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calendar_events_select_own" ON public.calendar_events;
CREATE POLICY "calendar_events_select_own"
  ON public.calendar_events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

REVOKE ALL ON TABLE public.calendar_events FROM PUBLIC;
REVOKE ALL ON TABLE public.calendar_events FROM anon;
GRANT SELECT ON TABLE public.calendar_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.calendar_events TO service_role;

NOTIFY pgrst, 'reload schema';

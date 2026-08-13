-- ============================================
-- 실행 순서: profiles → function → newsletter
-- ============================================

CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL CHECK (char_length(BTRIM(email)) BETWEEN 5 AND 320),
  age TEXT CHECK (
    age IN ('10대', '20대', '30대', '40대', '50대', '60대 이상')
  ),
  acquisition_source TEXT CHECK (
    acquisition_source IN (
      '검색',
      '인스타그램·SNS',
      '러닝 크루·지인 추천',
      '커뮤니티·카페',
      '대회 또는 행사',
      '기타'
    )
  ),
  content_preference TEXT CHECK (
    content_preference IS NULL
    OR char_length(BTRIM(content_preference)) BETWEEN 1 AND 500
  ),
  subscription_source TEXT NOT NULL DEFAULT '뉴스레터 페이지' CHECK (
    subscription_source IN (
      '메인 구독 배너',
      '뉴스레터 페이지',
      '대회 상세페이지',
      '관리자 등록'
    )
  ),
  agree_privacy BOOLEAN NOT NULL DEFAULT FALSE CHECK (agree_privacy = TRUE),
  agree_ads BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT '구독중' CHECK (
    status IN ('구독중', '구독취소')
  ),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (status = '구독중' AND unsubscribed_at IS NULL)
    OR (status = '구독취소' AND unsubscribed_at IS NOT NULL)
  )
);

-- 기존 테이블에도 새 설문 항목을 추가한다.
ALTER TABLE public.newsletters
  ADD COLUMN IF NOT EXISTS content_preference TEXT;

ALTER TABLE public.newsletters
  DROP CONSTRAINT IF EXISTS newsletters_acquisition_source_check;

-- 이전 선택지를 새 선택지에 맞춰 보존한다.
UPDATE public.newsletters
SET acquisition_source = CASE acquisition_source
  WHEN '검색엔진' THEN '검색'
  WHEN 'SNS' THEN '인스타그램·SNS'
  WHEN '지인 추천' THEN '러닝 크루·지인 추천'
  WHEN '대회 현장' THEN '대회 또는 행사'
  ELSE acquisition_source
END
WHERE acquisition_source IN ('검색엔진', 'SNS', '지인 추천', '대회 현장');

ALTER TABLE public.newsletters
  ADD CONSTRAINT newsletters_acquisition_source_check CHECK (
    acquisition_source IS NULL OR acquisition_source IN (
      '검색',
      '인스타그램·SNS',
      '러닝 크루·지인 추천',
      '커뮤니티·카페',
      '대회 또는 행사',
      '기타'
    )
  );

ALTER TABLE public.newsletters
  DROP CONSTRAINT IF EXISTS newsletters_content_preference_check;
ALTER TABLE public.newsletters
  ADD CONSTRAINT newsletters_content_preference_check CHECK (
    content_preference IS NULL
    OR char_length(BTRIM(content_preference)) BETWEEN 1 AND 500
  );

-- 공백과 대소문자가 다른 동일 이메일도 중복되지 않는다.
CREATE UNIQUE INDEX IF NOT EXISTS uq_newsletters_normalized_email
  ON public.newsletters(LOWER(BTRIM(email)));
CREATE INDEX IF NOT EXISTS idx_newsletters_status
  ON public.newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at
  ON public.newsletters(created_at DESC);

DROP TRIGGER IF EXISTS trg_newsletters_before_update ON public.newsletters;
CREATE TRIGGER trg_newsletters_before_update
BEFORE UPDATE ON public.newsletters
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_set_updated_at();

ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "뉴스레터 구독 등록" ON public.newsletters;
DROP POLICY IF EXISTS "관리자 뉴스레터 조회" ON public.newsletters;
DROP POLICY IF EXISTS "관리자 뉴스레터 수정" ON public.newsletters;
DROP POLICY IF EXISTS "관리자 뉴스레터 삭제" ON public.newsletters;

CREATE POLICY "관리자 뉴스레터 조회"
ON public.newsletters
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "관리자 뉴스레터 수정"
ON public.newsletters
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "관리자 뉴스레터 삭제"
ON public.newsletters
FOR DELETE
TO authenticated
USING (public.is_admin());

REVOKE ALL ON TABLE public.newsletters FROM anon;
REVOKE ALL ON TABLE public.newsletters FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.newsletters TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.newsletters TO service_role;

-- 이전 인자 구성의 RPC가 오버로드로 남지 않도록 제거한다.
DROP FUNCTION IF EXISTS public.subscribe_newsletter(TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN);

-- 신규 구독과 재구독을 하나의 안전한 RPC로 처리한다.
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  subscriber_email TEXT,
  subscriber_age TEXT DEFAULT NULL,
  subscriber_acquisition_source TEXT DEFAULT NULL,
  subscriber_content_preference TEXT DEFAULT NULL,
  subscriber_subscription_source TEXT DEFAULT '뉴스레터 페이지',
  privacy_agreed BOOLEAN DEFAULT FALSE,
  ads_agreed BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  subscriber_id UUID;
  normalized_email TEXT := LOWER(BTRIM(subscriber_email));
BEGIN
  IF privacy_agreed IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_consent_required';
  END IF;

  IF normalized_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF subscriber_age IS NULL
    OR subscriber_age NOT IN ('10대', '20대', '30대', '40대', '50대', '60대 이상')
  THEN
    RAISE EXCEPTION 'invalid_age';
  END IF;

  IF subscriber_acquisition_source IS NULL
    OR subscriber_acquisition_source NOT IN (
      '검색',
      '인스타그램·SNS',
      '러닝 크루·지인 추천',
      '커뮤니티·카페',
      '대회 또는 행사',
      '기타'
    )
  THEN
    RAISE EXCEPTION 'invalid_acquisition_source';
  END IF;

  IF subscriber_content_preference IS NOT NULL
    AND char_length(BTRIM(subscriber_content_preference)) NOT BETWEEN 1 AND 500
  THEN
    RAISE EXCEPTION 'invalid_content_preference';
  END IF;

  IF subscriber_subscription_source NOT IN (
    '메인 구독 배너',
    '뉴스레터 페이지',
    '대회 상세페이지',
    '관리자 등록'
  ) THEN
    RAISE EXCEPTION 'invalid_subscription_source';
  END IF;

  INSERT INTO public.newsletters (
    email,
    age,
    acquisition_source,
    content_preference,
    subscription_source,
    agree_privacy,
    agree_ads,
    status,
    unsubscribed_at
  )
  VALUES (
    normalized_email,
    subscriber_age,
    subscriber_acquisition_source,
    NULLIF(BTRIM(subscriber_content_preference), ''),
    subscriber_subscription_source,
    TRUE,
    ads_agreed,
    '구독중',
    NULL
  )
  ON CONFLICT (LOWER(BTRIM(email))) DO UPDATE
  SET
    age = EXCLUDED.age,
    acquisition_source = EXCLUDED.acquisition_source,
    content_preference = EXCLUDED.content_preference,
    subscription_source = EXCLUDED.subscription_source,
    agree_privacy = TRUE,
    agree_ads = EXCLUDED.agree_ads,
    status = '구독중',
    unsubscribed_at = NULL
  RETURNING id INTO subscriber_id;

  RETURN subscriber_id;
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_newsletter(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN)
  TO anon, authenticated;

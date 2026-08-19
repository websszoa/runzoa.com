-- ============================================
-- 실행 순서: profiles → function → contact
-- ============================================

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (char_length(BTRIM(name)) BETWEEN 1 AND 50),
  user_email TEXT NOT NULL CHECK (char_length(BTRIM(user_email)) BETWEEN 5 AND 320),
  type TEXT NOT NULL CHECK (
    type IN ('등록문의', '문의사항', '불편신고', '수정요청')
  ),
  title TEXT NOT NULL CHECK (char_length(BTRIM(title)) BETWEEN 1 AND 100),
  related_url TEXT CHECK (
    related_url IS NULL
    OR char_length(related_url) <= 2048
  ),
  content TEXT NOT NULL CHECK (char_length(BTRIM(content)) BETWEEN 10 AND 5000),
  agree_privacy BOOLEAN NOT NULL DEFAULT FALSE CHECK (agree_privacy = TRUE),
  status TEXT NOT NULL DEFAULT '대기중' CHECK (
    status IN ('대기중', '처리중', '처리완료')
  ),
  reply TEXT CHECK (reply IS NULL OR char_length(reply) <= 5000),
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (reply IS NULL AND replied_at IS NULL)
    OR (reply IS NOT NULL AND replied_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id
  ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_email
  ON public.contacts(LOWER(user_email));
CREATE INDEX IF NOT EXISTS idx_contacts_status
  ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_type
  ON public.contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at
  ON public.contacts(created_at DESC);

DROP TRIGGER IF EXISTS trg_contacts_before_update ON public.contacts;
CREATE TRIGGER trg_contacts_before_update
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_set_updated_at();

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "회원 본인 문의 조회" ON public.contacts;
DROP POLICY IF EXISTS "회원 문의 등록" ON public.contacts;
DROP POLICY IF EXISTS "관리자 전체 문의 조회" ON public.contacts;
DROP POLICY IF EXISTS "관리자 문의 수정" ON public.contacts;
DROP POLICY IF EXISTS "관리자 문의 삭제" ON public.contacts;

CREATE POLICY "회원 본인 문의 조회"
ON public.contacts
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR LOWER(user_email) = LOWER((SELECT auth.jwt() ->> 'email'))
);

CREATE POLICY "관리자 전체 문의 조회"
ON public.contacts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "관리자 문의 수정"
ON public.contacts
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "관리자 문의 삭제"
ON public.contacts
FOR DELETE
TO authenticated
USING (public.is_admin());

REVOKE ALL ON TABLE public.contacts FROM anon;
REVOKE ALL ON TABLE public.contacts FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.contacts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contacts TO service_role;

-- 문의 입력은 이 RPC로만 허용한다. 상태·답변·시간은 사용자가 지정할 수 없다.
CREATE OR REPLACE FUNCTION public.submit_contact(
  contact_name TEXT,
  contact_email TEXT,
  contact_type TEXT,
  contact_title TEXT,
  contact_content TEXT,
  contact_related_url TEXT DEFAULT NULL,
  privacy_agreed BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_id UUID;
  normalized_email TEXT := LOWER(BTRIM(contact_email));
  normalized_url TEXT := NULLIF(BTRIM(contact_related_url), '');
BEGIN
  IF privacy_agreed IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_consent_required';
  END IF;

  IF contact_type NOT IN ('등록문의', '문의사항', '불편신고', '수정요청') THEN
    RAISE EXCEPTION 'invalid_contact_type';
  END IF;

  IF normalized_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF normalized_url IS NOT NULL
    AND normalized_url !~* '^https?://'
  THEN
    RAISE EXCEPTION 'invalid_related_url';
  END IF;

  INSERT INTO public.contacts (
    user_id,
    name,
    user_email,
    type,
    title,
    related_url,
    content,
    agree_privacy
  )
  VALUES (
    (SELECT auth.uid()),
    BTRIM(contact_name),
    normalized_email,
    contact_type,
    BTRIM(contact_title),
    normalized_url,
    BTRIM(contact_content),
    TRUE
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN)
  TO anon, authenticated;

-- PostgREST가 새 RPC를 즉시 인식하도록 스키마 캐시를 갱신한다.
NOTIFY pgrst, 'reload schema';

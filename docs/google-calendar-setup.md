# 구글 캘린더 설정

구글 탭 → 구글 로그인/다시 연결 → 캘린더 권한 동의 → 구글 탭으로 복귀 → 대회별 추가 버튼 → 기본 캘린더에 종일 일정 저장.
구글 OAuth는 기존 Supabase 로그인을 사용하므로 선택한 구글 계정의 런조아 세션으로 전환됩니다. 현재 계정에 다른 구글 계정을 연결하는 기능은 아닙니다.

## 배포 전 설정

1. Supabase SQL Editor에서 `sql/supabase-google-connections.sql` 실행. 기존 `sql/supabase-calendar-events.sql`도 적용되어 있어야 합니다. 연결 토큰은 service_role만 접근 가능합니다.
2. 기존 Supabase Google 로그인에 사용하는 Google Cloud 프로젝트에서 Google Calendar API를 활성화합니다.
3. Google OAuth 동의 화면에 `https://www.googleapis.com/auth/calendar.events.owned` 권한을 추가합니다. 테스트 모드에서는 테스트 사용자를 등록하고, 공개 운영 전 필요한 OAuth 검증을 완료합니다.
4. 서버 환경변수 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`에 Supabase Google provider와 동일한 OAuth 클라이언트 값을 설정합니다. `NEXT_PUBLIC_` 접두사를 사용하지 않습니다. 기존 Supabase URL 및 service role 설정도 필요합니다.
5. Supabase Authentication URL Configuration의 Redirect URLs에 개발/운영 주소의 `/auth/callback/google**`를 허용합니다. Google Cloud의 Authorized redirect URI는 기존 Supabase `/auth/v1/callback` 주소를 유지합니다.

## 확인

- 로그아웃 상태와 다른 로그인 상태에서 구글 탭의 로그인 버튼을 확인합니다.
- 권한 동의 후 구글 탭으로 복귀하고 대회 추가 및 마이페이지 내역을 확인합니다.
- 단일/여러 날짜 대회가 종일 일정으로 생성되는지 확인합니다. 종료일은 Google API의 배타적 종료일 규칙에 따라 하루를 더합니다.
- 같은 대회를 반복 추가해도 중복 생성되지 않는지 확인합니다. 결정적 이벤트 ID를 사용하고 중단된 예약은 2분 후 재시도할 수 있습니다.
- 동의 취소, 권한 철회, 토큰 만료, 네트워크 실패 후 재시도를 확인합니다.

공식 문서: https://supabase.com/docs/guides/auth/social-login/auth-google
https://developers.google.com/workspace/calendar/api/auth
https://developers.google.com/workspace/calendar/api/v3/reference/events/insert

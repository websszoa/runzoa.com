# 톡캘린더 연결

1. Supabase SQL Editor에서 `sql/supabase-kakao-connections.sql` 전체 실행. 기존 `calendar_events` 테이블도 필요합니다.
2. 서버 `.env.local` 및 운영 환경에 `KAKAO_CLIENT_ID`(Supabase 카카오 provider와 동일한 REST API 키), `KAKAO_CLIENT_SECRET`(해당 클라이언트 시크릿, 활성화한 경우)를 설정합니다. 어드민 키가 아닙니다. 환경변수 변경 후 개발 서버를 재시작합니다.
3. 카카오 로그인 동의항목 `talk_calendar`를 이용 중 동의로 설정합니다. 승인 전에는 앱 멤버 계정으로 테스트합니다.
4. Supabase Redirect URLs에 로컬 `http://localhost:3000/**` 및 운영 `/auth/callback/kakao**` 주소를 등록합니다. 카카오에 등록한 Supabase OAuth callback URI는 유지합니다.
5. `/calendar-add?provider=kakao`에서 카카오 로그인 → 추가 동의 → 대회 추가 → 톡캘린더 및 마이페이지 내역을 확인합니다.

선택한 카카오 계정으로 런조아 로그인이 전환됩니다. 일반 카카오 로그인은 캘린더 동의를 요청하지 않습니다.

권한 오류는 앱 멤버 여부/추가 기능 승인/동의를 확인합니다. 저장소 오류는 SQL 적용을 확인합니다. 갱신 실패 시 서버 키 설정을 확인하고 다시 연결합니다.

카카오 생성 API는 클라이언트 지정 일정 ID를 제공하지 않습니다. DB의 사용자·제공자·대회 고유 제약 및 예약으로 중복 요청을 막습니다. 네트워크 단절/서버 오류로 생성 결과가 불확실하거나 생성 후 내역 저장이 실패하면 pending을 유지합니다. 이 경우 관리자가 실제 톡캘린더 저장 여부를 확인해 created 및 external_event_id를 기록하거나, 미생성이 확인된 경우에만 failed로 변경해야 합니다. pending을 시간만으로 자동 재시도하지 않습니다.

단일 날짜와 여러 날짜, 연말 대회, 재클릭, 권한 취소, API 사용 권한 미승인, 토큰 갱신, 응답 유실을 확인합니다.

공식 API: https://developers.kakao.com/docs/ko/talkcalendar/rest-api
권한 신청: https://developers.kakao.com/docs/ko/talkcalendar/common

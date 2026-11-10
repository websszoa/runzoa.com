import type { Metadata } from "next";

import CalendarAdd from "@/components/calendar/calendar-add";
import PageTitle from "@/components/page/page-title";

import { CalendarPlus2 } from "lucide-react";
import { getMarathons } from "@/lib/marathons";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentKoreanDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "내 캘린더에 추가",
  description:
    "마라톤 대회 일정을 카카오톡, 네이버 캘린더에 간편하게 추가하세요.",
  alternates: { canonical: "/calendar-add" },
};

const kakaoConnectionErrors: Record<string, string> = {
  app_permission:
    "톡캘린더 API 사용 권한이 없습니다. 승인 전에는 해당 카카오 앱의 멤버 계정으로 로그인해 주세요.",
  consent:
    "톡캘린더 이용 동의가 필요합니다. 카카오로 다시 연결하고 캘린더 권한에 동의해 주세요.",
  talk_account: "카카오톡 가입 및 이용 가능한 계정인지 확인해 주세요.",
  token: "카카오 연결이 만료되었습니다. 카카오로 다시 연결해 주세요.",
  calendar_api:
    "톡캘린더 연결 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function CalendarAddPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; calendarError?: string }>;
}) {
  const params = await searchParams;
  let kakaoConnected = false;
  let kakaoRaceAddedSlugs: string[] = [];
  let kakaoRegistrationAddedSlugs: string[] = [];
  const [{ marathons, error }, supabase] = await Promise.all([
    getMarathons(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let naverConnected = false;
  let naverRaceAddedSlugs: string[] = [];
  let naverRegistrationAddedSlugs: string[] = [];

  if (user) {
    const admin = createAdminClient();
    const [connectionResult, naverEvents, kakaoConnection, kakaoEvents] =
      await Promise.all([
        admin
          .from("naver_connections")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle(),
        admin
          .from("calendar_events")
          .select("marathon_slug, event_kind")
          .eq("user_id", user.id)
          .eq("provider", "naver")
          .eq("status", "created"),
        admin
          .from("kakao_connections")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle(),
        admin
          .from("calendar_events")
          .select("marathon_slug, event_kind")
          .eq("user_id", user.id)
          .eq("provider", "kakao")
          .eq("status", "created"),
      ]);
    kakaoConnected = Boolean(kakaoConnection.data);
    kakaoRaceAddedSlugs = (kakaoEvents.data ?? [])
      .filter((item) => item.event_kind !== "registration")
      .map((item) => item.marathon_slug);
    kakaoRegistrationAddedSlugs = (kakaoEvents.data ?? [])
      .filter((item) => item.event_kind === "registration")
      .map((item) => item.marathon_slug);
    naverConnected = Boolean(connectionResult.data);
    naverRaceAddedSlugs = (naverEvents.data ?? [])
      .filter((item) => item.event_kind !== "registration")
      .map((item) => item.marathon_slug);
    naverRegistrationAddedSlugs = (naverEvents.data ?? [])
      .filter((item) => item.event_kind === "registration")
      .map((item) => item.marathon_slug);
  }

  const today = getCurrentKoreanDate();
  const upcomingMarathons = marathons
    .filter((marathon) => marathon.event.startDate >= today)
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));

  return (
    <>
      <PageTitle
        icon={CalendarPlus2}
        eyebrow="RUNZOA CALENDAR CONNECT"
        title="내 캘린더에 추가"
        description="카카오톡 캘린더는 대회 일정과 접수 일정 모두 하루전, 10분 전 알림을 지원합니다."
      />
      {params.calendarError && params.provider === "kakao" && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-4 pt-4 text-sm text-destructive"
        >
          {kakaoConnectionErrors[params.calendarError] ??
            (params.calendarError === "storage"
              ? "톡캘린더 연결 저장소 설정이 필요합니다. 관리자에게 문의해 주세요."
              : params.calendarError === "permission"
                ? "톡캘린더 이용 동의와 앱 사용 권한을 확인해 주세요. 승인 전에는 앱 멤버만 이용할 수 있습니다."
                : "톡캘린더 연결을 완료하지 못했습니다. 카카오로 다시 연결해 주세요.")}
        </p>
      )}
      <CalendarAdd
        marathons={upcomingMarathons}
        hasError={error}
        isLoggedIn={Boolean(user)}
        kakaoConnected={kakaoConnected}
        initialKakaoRaceAddedSlugs={kakaoRaceAddedSlugs}
        initialKakaoRegistrationAddedSlugs={kakaoRegistrationAddedSlugs}
        naverConnected={naverConnected}
        initialNaverRaceAddedSlugs={naverRaceAddedSlugs}
        initialNaverRegistrationAddedSlugs={naverRegistrationAddedSlugs}
      />
    </>
  );
}

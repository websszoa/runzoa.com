import type { Metadata } from "next";

import CalendarAdd from "@/components/calendar/calendar-add";
import PageTitle from "@/components/page/page-title";

import { CalendarPlus2 } from "lucide-react";
import { getMarathons } from "@/lib/marathons";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentKoreanDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "카카오 캘린더에 추가",
  description:
    "마라톤 대회 일정을 카카오톡 캘린더에 추가하고 알림을 받아보세요.",
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
  const admin = createAdminClient();
  const { count: kakaoUserCount } = await admin
    .from("kakao_connections")
    .select("user_id", { count: "exact", head: true });
  if (user) {
    const [kakaoConnection, kakaoEvents] = await Promise.all([
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
        title="카카오 캘린더에 추가"
        description={`카카오톡 캘린더에 대회와 접수 일정을 저장하고 하루 전, 1시간 전 알림을 받아보세요. 현재 ${(kakaoUserCount ?? 0).toLocaleString("ko-KR")}명이 이용하고 있습니다.`}
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
      />
    </>
  );
}

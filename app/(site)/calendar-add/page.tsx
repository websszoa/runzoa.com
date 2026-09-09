import type { Metadata } from "next";
import { CalendarPlus2 } from "lucide-react";

import CalendarAdd from "@/components/calendar/calendar-add";
import PageTitle from "@/components/page/page-title";
import { getMarathons } from "@/lib/marathons";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentKoreanDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "내 캘린더에 추가",
  description:
    "마라톤 대회 일정을 네이버, 구글, 카카오 캘린더에 간편하게 추가하세요.",
  alternates: { canonical: "/calendar-add" },
};

const kakaoConnectionErrors: Record<string, string> = {
  app_permission: "톡캘린더 API 사용 권한이 없습니다. 승인 전에는 해당 카카오 앱의 멤버 계정으로 로그인해 주세요.",
  consent: "톡캘린더 이용 동의가 필요합니다. 카카오로 다시 연결하고 캘린더 권한에 동의해 주세요.",
  talk_account: "카카오톡 가입 및 이용 가능한 계정인지 확인해 주세요.",
  token: "카카오 연결이 만료되었습니다. 카카오로 다시 연결해 주세요.",
  calendar_api: "톡캘린더 연결 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};

export default async function CalendarAddPage({ searchParams }: { searchParams: Promise<{ provider?: string; calendarError?: string }> }) {
  const params = await searchParams;
  let kakaoConnected = false;
  let kakaoAddedSlugs: string[] = [];
  let googleConnected = false;
  let googleAddedSlugs: string[] = [];
  const [{ marathons, error }, supabase] = await Promise.all([
    getMarathons(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let naverConnected = false;
  let addedSlugs: string[] = [];

  if (user) {
    const admin = createAdminClient();
    const [connectionResult, eventsResult, googleConnection, googleEvents, kakaoConnection, kakaoEvents] = await Promise.all([
      admin
        .from("naver_connections")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle(),
      admin
        .from("calendar_events")
        .select("marathon_slug")
        .eq("user_id", user.id)
        .eq("provider", "naver")
        .eq("status", "created"),
      admin.from("google_connections").select("user_id").eq("user_id", user.id).maybeSingle(),
      admin.from("calendar_events").select("marathon_slug").eq("user_id", user.id).eq("provider", "google").eq("status", "created"),
      admin.from("kakao_connections").select("user_id").eq("user_id", user.id).maybeSingle(),
      admin.from("calendar_events").select("marathon_slug").eq("user_id", user.id).eq("provider", "kakao").eq("status", "created"),
    ]);
    kakaoConnected = Boolean(kakaoConnection.data);
    kakaoAddedSlugs = (kakaoEvents.data ?? []).map((item) => item.marathon_slug);
    googleConnected = Boolean(googleConnection.data);
    googleAddedSlugs = (googleEvents.data ?? []).map((item) => item.marathon_slug);
    naverConnected = Boolean(connectionResult.data);
    addedSlugs = (eventsResult.data ?? []).map((item) => item.marathon_slug);
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
        description="참가하고 싶은 마라톤 일정을 선택해 사용하는 캘린더에 바로 저장하세요."
      />
      {params.calendarError && <p role="alert" className="mx-auto max-w-7xl px-4 pt-4 text-sm text-destructive">{params.provider === "kakao" ? (kakaoConnectionErrors[params.calendarError] ?? (params.calendarError === "storage" ? "톡캘린더 연결 저장소 설정이 필요합니다. 관리자에게 문의해 주세요." : params.calendarError === "permission" ? "톡캘린더 이용 동의와 앱 사용 권한을 확인해 주세요. 승인 전에는 앱 멤버만 이용할 수 있습니다." : "톡캘린더 연결을 완료하지 못했습니다. 카카오로 다시 연결해 주세요.")) : "구글 캘린더 연결을 완료하지 못했습니다. 권한 동의와 서버 설정을 확인하고 다시 시도해 주세요."}</p>}
      <CalendarAdd
        marathons={upcomingMarathons}
        hasError={error}
        isLoggedIn={Boolean(user)}
        kakaoConnected={kakaoConnected}
        initialKakaoAddedSlugs={kakaoAddedSlugs}
        googleConnected={googleConnected}
        initialGoogleAddedSlugs={googleAddedSlugs}
        initialProvider={params.provider === "kakao" ? "kakao" : params.provider === "google" ? "google" : "naver"}
        naverConnected={naverConnected}
        initialAddedSlugs={addedSlugs}
      />
    </>
  );
}

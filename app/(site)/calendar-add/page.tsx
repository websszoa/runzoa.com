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

export default async function CalendarAddPage({ searchParams }: { searchParams: Promise<{ provider?: string; calendarError?: string }> }) {
  const params = await searchParams;
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
    const [connectionResult, eventsResult, googleConnection, googleEvents] = await Promise.all([
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
    ]);
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
      {params.calendarError && <p role="alert" className="mx-auto max-w-7xl px-4 pt-4 text-sm text-destructive">구글 캘린더 연결을 완료하지 못했습니다. 권한 동의와 서버 설정을 확인하고 다시 시도해 주세요.</p>}
      <CalendarAdd
        marathons={upcomingMarathons}
        hasError={error}
        isLoggedIn={Boolean(user)}
        googleConnected={googleConnected}
        initialGoogleAddedSlugs={googleAddedSlugs}
        initialProvider={params.provider === "google" ? "google" : "naver"}
        naverConnected={naverConnected}
        initialAddedSlugs={addedSlugs}
      />
    </>
  );
}

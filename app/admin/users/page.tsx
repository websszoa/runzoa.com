import AdminMember, {
  type AdminMemberProfile,
  type AdminMemberStats,
  type MemberProvider,
} from "@/components/admin/admin-member";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  signup_provider: string | null;
  role: "admin" | "user";
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, avatar_url, signup_provider, role, visit_count, is_deleted, created_at",
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as ProfileRow[];
  const profiles: AdminMemberProfile[] = rows.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name?.trim() || "이름 없음",
    email: profile.email ?? "이메일 없음",
    avatarUrl: profile.avatar_url,
    signupProvider: normalizeProvider(profile.signup_provider),
    role: profile.role,
    visitCount: profile.visit_count,
    isDeleted: profile.is_deleted,
    createdAt: formatKoreanDateTime(profile.created_at),
  }));

  const currentMonth = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());

  const stats: AdminMemberStats = {
    total: rows.length,
    newThisMonth: rows.filter(({ created_at }) =>
      formatKoreanMonth(created_at).startsWith(currentMonth),
    ).length,
    deleted: rows.filter(({ is_deleted }) => is_deleted).length,
    google: rows.filter(
      ({ signup_provider }) => normalizeProvider(signup_provider) === "google",
    ).length,
    naver: rows.filter(
      ({ signup_provider }) => normalizeProvider(signup_provider) === "naver",
    ).length,
    kakao: rows.filter(
      ({ signup_provider }) => normalizeProvider(signup_provider) === "kakao",
    ).length,
  };

  return (
    <AdminMember profiles={profiles} stats={stats} hasError={Boolean(error)} />
  );
}

function normalizeProvider(provider: string | null): MemberProvider {
  if (provider === "naver" || provider === "custom:naver") return "naver";
  if (provider === "kakao") return "kakao";
  return "google";
}

function formatKoreanMonth(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  }).format(new Date(value));
}

function formatKoreanDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

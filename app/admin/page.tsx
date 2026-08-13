import AdminDashboard, {
  type DashboardContact,
  type DashboardMember,
  type DashboardNewsletter,
  type DashboardStats,
} from "@/components/admin/admin-dashboard";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  signup_provider: string | null;
};

type ContactRow = {
  id: string;
  title: string;
  type: string;
  status: DashboardContact["status"];
  created_at: string;
};

type NewsletterRow = {
  id: string;
  email: string;
  subscription_source: string;
  status: DashboardNewsletter["status"];
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [profilesResult, contactsResult, newslettersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, signup_provider")
      .order("created_at", { ascending: false }),
    supabase
      .from("contacts")
      .select("id, title, type, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("newsletters")
      .select("id, email, subscription_source, status")
      .order("created_at", { ascending: false }),
  ]);

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const contacts = (contactsResult.data ?? []) as ContactRow[];
  const newsletters = (newslettersResult.data ?? []) as NewsletterRow[];

  const recentMembers: DashboardMember[] = profiles.slice(0, 5).map((profile) => ({
    id: profile.id,
    name: profile.full_name?.trim() || "이름 없음",
    email: profile.email ?? "이메일 없음",
    provider: normalizeProvider(profile.signup_provider),
  }));
  const recentContacts: DashboardContact[] = contacts.slice(0, 5).map((contact) => ({
    id: contact.id,
    title: contact.title,
    type: contact.type,
    status: contact.status,
    createdAt: formatKoreanDate(contact.created_at),
  }));
  const recentNewsletters: DashboardNewsletter[] = newsletters
    .slice(0, 5)
    .map((newsletter) => ({
      id: newsletter.id,
      email: newsletter.email,
      source: newsletter.subscription_source,
      status: newsletter.status,
    }));

  const stats: DashboardStats = {
    member: {
      total: profiles.length,
      google: profiles.filter((profile) => normalizeProvider(profile.signup_provider) === "google").length,
      kakao: profiles.filter((profile) => normalizeProvider(profile.signup_provider) === "kakao").length,
      naver: profiles.filter((profile) => normalizeProvider(profile.signup_provider) === "naver").length,
    },
    contact: {
      total: contacts.length,
      pending: contacts.filter((contact) => contact.status === "대기중").length,
      processing: contacts.filter((contact) => contact.status === "처리중").length,
      completed: contacts.filter((contact) => contact.status === "처리완료").length,
    },
    newsletter: {
      total: newsletters.length,
      active: newsletters.filter((newsletter) => newsletter.status === "구독중").length,
      canceled: newsletters.filter((newsletter) => newsletter.status === "구독취소").length,
    },
  };

  return (
    <AdminDashboard
      hasDataError={Boolean(profilesResult.error || contactsResult.error || newslettersResult.error)}
      stats={stats}
      recentMembers={recentMembers}
      recentContacts={recentContacts}
      recentNewsletters={recentNewsletters}
    />
  );
}

function normalizeProvider(provider: string | null): DashboardMember["provider"] {
  if (provider === "naver" || provider === "custom:naver") return "naver";
  if (provider === "kakao") return "kakao";
  return "google";
}

function formatKoreanDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(value))
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

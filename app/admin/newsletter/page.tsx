import AdminNewsletter, {
  type AdminNewsletterItem,
} from "@/components/admin/admin-newsletter";
import { createClient } from "@/lib/supabase/server";

type NewsletterRow = {
  id: string;
  email: string;
  age: string | null;
  acquisition_source: string | null;
  content_preference: string | null;
  agree_ads: boolean;
  status: "구독중" | "구독취소";
  created_at: string;
};

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select(
      "id, email, age, acquisition_source, content_preference, agree_ads, status, created_at",
    )
    .order("created_at", { ascending: false });

  const newsletters: AdminNewsletterItem[] = (
    (data ?? []) as NewsletterRow[]
  ).map((newsletter) => ({
    id: newsletter.id,
    email: newsletter.email,
    age: newsletter.age,
    acquisitionSource: newsletter.acquisition_source,
    contentPreference: newsletter.content_preference,
    agreeAds: newsletter.agree_ads,
    status: newsletter.status,
    createdAt: formatKoreanDateTime(newsletter.created_at),
  }));

  return (
    <AdminNewsletter
      initialNewsletters={newsletters}
      hasError={Boolean(error)}
    />
  );
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

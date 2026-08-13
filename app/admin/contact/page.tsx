import AdminContact, {
  type AdminContactItem,
} from "@/components/admin/admin-contact";
import { createClient } from "@/lib/supabase/server";

type ContactRow = {
  id: string;
  name: string;
  user_email: string;
  type: AdminContactItem["type"];
  title: string;
  related_url: string | null;
  content: string;
  status: AdminContactItem["status"];
  reply: string | null;
  replied_at: string | null;
  created_at: string;
};

export default async function AdminContactPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select(
      "id, name, user_email, type, title, related_url, content, status, reply, replied_at, created_at",
    )
    .order("created_at", { ascending: false });

  const contacts: AdminContactItem[] = ((data ?? []) as ContactRow[]).map(
    (contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.user_email,
      type: contact.type,
      subject: contact.title,
      relatedUrl: contact.related_url,
      content: contact.content,
      status: contact.status,
      reply: contact.reply,
      repliedAt: contact.replied_at
        ? formatKoreanDateTime(contact.replied_at)
        : null,
      createdAt: formatKoreanDateTime(contact.created_at),
    }),
  );

  return <AdminContact initialContacts={contacts} hasError={Boolean(error)} />;
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

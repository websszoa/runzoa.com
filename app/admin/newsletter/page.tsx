import AdminNewsletter, {
  type AdminNewsletterItem,
} from "@/components/admin/admin-newsletter";

const newsletters: AdminNewsletterItem[] = [
  {
    id: "newsletter-001",
    email: "runner01@example.com",
    age: "30대",
    source: "메인 구독 배너",
    agreeAds: true,
    status: "구독중",
    createdAt: "2026.08.11 14:32",
  },
  {
    id: "newsletter-002",
    email: "runner02@example.com",
    age: "20대",
    source: "뉴스레터 페이지",
    agreeAds: true,
    status: "구독중",
    createdAt: "2026.08.08 09:15",
  },
  {
    id: "newsletter-003",
    email: "runner03@example.com",
    age: null,
    source: "대회 상세페이지",
    agreeAds: false,
    status: "구독취소",
    createdAt: "2026.08.03 18:47",
  },
  {
    id: "newsletter-004",
    email: "runner04@example.com",
    age: "40대",
    source: "메인 구독 배너",
    agreeAds: true,
    status: "구독중",
    createdAt: "2026.07.24 11:08",
  },
  {
    id: "newsletter-005",
    email: "runner05@example.com",
    age: "30대",
    source: null,
    agreeAds: false,
    status: "구독취소",
    createdAt: "2026.07.12 16:21",
  },
];

export default function AdminNewsletterPage() {
  return <AdminNewsletter initialNewsletters={newsletters} />;
}

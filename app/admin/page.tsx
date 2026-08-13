import AdminDashboard, {
  type DashboardContact,
  type DashboardMember,
  type DashboardNewsletter,
  type DashboardReaction,
  type DashboardStats,
} from "@/components/admin/admin-dashboard";
import { getMarathons } from "@/lib/marathons";

const recentMembers: DashboardMember[] = [
  { id: "1", name: "김런너", email: "runner01@example.com", provider: "google" },
  { id: "2", name: "박마라", email: "runner02@example.com", provider: "naver" },
  { id: "3", name: "이페이스", email: "runner03@example.com", provider: "kakao" },
  { id: "4", name: "최완주", email: "runner04@example.com", provider: "google" },
  { id: "5", name: "정하프", email: "runner05@example.com", provider: "naver" },
];

const recentContacts: DashboardContact[] = [
  { id: "1", title: "대회 등록 방법에 대해 문의드립니다.", type: "문의사항", status: "대기중", createdAt: "2026.08.11" },
  { id: "2", title: "캘린더에서 대회 일정이 표시되지 않아요.", type: "불편신고", status: "처리중", createdAt: "2026.08.10" },
  { id: "3", title: "마라톤 개최 장소 정보 수정을 요청합니다.", type: "수정요청", status: "대기중", createdAt: "2026.08.09" },
  { id: "4", title: "뉴스레터 구독 해지는 어디에서 하나요?", type: "문의사항", status: "처리완료", createdAt: "2026.08.07" },
  { id: "5", title: "지도에서 현재 위치 버튼이 동작하지 않습니다.", type: "불편신고", status: "처리완료", createdAt: "2026.08.04" },
];

const recentNewsletters: DashboardNewsletter[] = [
  { id: "1", email: "runner01@example.com", source: "메인 구독 배너", status: "구독중" },
  { id: "2", email: "runner02@example.com", source: "뉴스레터 페이지", status: "구독중" },
  { id: "3", email: "runner03@example.com", source: "대회 상세페이지", status: "구독취소" },
  { id: "4", email: "runner04@example.com", source: "메인 구독 배너", status: "구독중" },
  { id: "5", email: "runner05@example.com", source: "뉴스레터 페이지", status: "구독취소" },
];

const topReactions: DashboardReaction[] = [
  { id: "1", slug: "gyeongju-cherry-marathon-2026", name: "제33회 경주 벚꽃 마라톤대회", views: 12840, likes: 328, favorites: 194, shares: 87 },
  { id: "2", slug: "incheon-night-race-2026", name: "2026 인천 나이트 레이스", views: 9420, likes: 275, favorites: 168, shares: 64 },
  { id: "3", slug: "seoul-race-2026", name: "2026 서울레이스", views: 8150, likes: 221, favorites: 143, shares: 58 },
  { id: "4", slug: "815-run-2026", name: "2026 815런", views: 6370, likes: 184, favorites: 96, shares: 45 },
  { id: "5", slug: "pyeongchang-daegwallyeong-half-marathon-2026", name: "2026 HAPPY700 평창 대관령 전국 하프마라톤 대회", views: 4890, likes: 132, favorites: 74, shares: 31 },
];

const stats: DashboardStats = {
  member: { total: 5, google: 2, kakao: 1, naver: 2 },
  contact: { total: 9, pending: 3, processing: 2, completed: 4 },
  newsletter: { total: 5, active: 3, canceled: 2 },
  reaction: { views: 41670, likes: 1140, favorites: 675, shares: 285 },
};

export default async function AdminDashboardPage() {
  const { marathons, error } = await getMarathons();

  return (
    <AdminDashboard
      marathons={marathons}
      hasMarathonError={error}
      stats={stats}
      recentMembers={recentMembers}
      recentContacts={recentContacts}
      recentNewsletters={recentNewsletters}
      topReactions={topReactions}
    />
  );
}

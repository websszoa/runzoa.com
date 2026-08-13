import AdminReaction, {
  type AdminReactionItem,
} from "@/components/admin/admin-reaction";

const reactions: AdminReactionItem[] = [
  {
    id: "reaction-001",
    slug: "gyeongju-cherry-marathon-2026",
    marathonName: "제33회 경주 벚꽃 마라톤대회",
    views: 12840,
    likes: 328,
    favorites: 194,
    shares: 87,
    updatedAt: "2026.08.11 16:40",
  },
  {
    id: "reaction-002",
    slug: "incheon-night-race-2026",
    marathonName: "2026 인천 나이트 레이스",
    views: 9420,
    likes: 275,
    favorites: 168,
    shares: 64,
    updatedAt: "2026.08.11 16:35",
  },
  {
    id: "reaction-003",
    slug: "seoul-race-2026",
    marathonName: "2026 서울레이스",
    views: 8150,
    likes: 221,
    favorites: 143,
    shares: 58,
    updatedAt: "2026.08.11 16:30",
  },
  {
    id: "reaction-004",
    slug: "815-run-2026",
    marathonName: "2026 815런",
    views: 6370,
    likes: 184,
    favorites: 96,
    shares: 45,
    updatedAt: "2026.08.11 16:25",
  },
  {
    id: "reaction-005",
    slug: "pyeongchang-daegwallyeong-half-marathon-2026",
    marathonName: "2026 HAPPY700 평창 대관령 전국 하프마라톤 대회",
    views: 4890,
    likes: 132,
    favorites: 74,
    shares: 31,
    updatedAt: "2026.08.11 16:20",
  },
];

export default function AdminReactionsPage() {
  return <AdminReaction reactions={reactions} />;
}

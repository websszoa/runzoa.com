import AdminMember, {
  type AdminMemberProfile,
  type AdminMemberStats,
} from "@/components/admin/admin-member";

const profiles: AdminMemberProfile[] = [
  {
    id: "member-001",
    fullName: "김런너",
    email: "runner01@example.com",
    signupProvider: "google",
    role: "admin",
    visitCount: 128,
    isDeleted: false,
    createdAt: "2026.08.10 14:32",
  },
  {
    id: "member-002",
    fullName: "박마라",
    email: "runner02@example.com",
    signupProvider: "naver",
    role: "member",
    visitCount: 42,
    isDeleted: false,
    createdAt: "2026.08.07 09:15",
  },
  {
    id: "member-003",
    fullName: "이페이스",
    email: "runner03@example.com",
    signupProvider: "kakao",
    role: "member",
    visitCount: 17,
    isDeleted: false,
    createdAt: "2026.08.03 18:47",
  },
  {
    id: "member-004",
    fullName: "최완주",
    email: "runner04@example.com",
    signupProvider: "google",
    role: "member",
    visitCount: 76,
    isDeleted: false,
    createdAt: "2026.07.24 11:08",
  },
  {
    id: "member-005",
    fullName: "정하프",
    email: "runner05@example.com",
    signupProvider: "naver",
    role: "member",
    visitCount: 9,
    isDeleted: true,
    createdAt: "2026.07.12 16:21",
  },
];

const stats: AdminMemberStats = {
  total: profiles.length,
  newThisMonth: profiles.filter(({ createdAt }) =>
    createdAt.startsWith("2026.08"),
  ).length,
  deleted: profiles.filter(({ isDeleted }) => isDeleted).length,
  google: profiles.filter(({ signupProvider }) => signupProvider === "google")
    .length,
  naver: profiles.filter(({ signupProvider }) => signupProvider === "naver")
    .length,
  kakao: profiles.filter(({ signupProvider }) => signupProvider === "kakao")
    .length,
};

export default function AdminUsersPage() {
  return <AdminMember profiles={profiles} stats={stats} />;
}

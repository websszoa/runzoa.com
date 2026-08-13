import {
  CircleAlert,
  Settings,
  Share2,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type MemberProvider = "google" | "naver" | "kakao";

export type AdminMemberProfile = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  signupProvider: MemberProvider;
  role: "admin" | "user";
  visitCount: number;
  isDeleted: boolean;
  createdAt: string;
};

export type AdminMemberStats = {
  total: number;
  newThisMonth: number;
  deleted: number;
  google: number;
  kakao: number;
  naver: number;
};

const providerStyles: Record<MemberProvider, string> = {
  google: "bg-blue-500 text-white",
  naver: "bg-emerald-500 text-white",
  kakao: "bg-yellow-300 text-zinc-900",
};

export default function AdminMember({
  profiles,
  stats,
  hasError = false,
}: {
  profiles: AdminMemberProfile[];
  stats: AdminMemberStats;
  hasError?: boolean;
}) {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">회원관리</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          가입 회원 정보와 활동 상태를 확인하고 계정을 관리하세요.
        </p>
      </header>

      {hasError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          회원 정보를 불러오지 못했습니다. SQL 정책 적용 상태를 확인해 주세요.
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              전체 회원
            </dt>
            <Users className="size-4 text-brand" aria-hidden="true" />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold tabular-nums">
            {stats.total}
          </dd>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              이번달 가입
            </dt>
            <UserCheck
              className="size-4 text-green-600"
              aria-hidden="true"
            />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-green-600 tabular-nums">
            {stats.newThisMonth}
          </dd>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              탈퇴 회원
            </dt>
            <UserMinus className="size-4 text-red-500" aria-hidden="true" />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-red-500 tabular-nums">
            {stats.deleted}
          </dd>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              소셜 로그인(구글/네이버/카카오)
            </dt>
            <Share2 className="size-4 text-purple-600" aria-hidden="true" />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-purple-600 tabular-nums">
            {stats.google} / {stats.naver} / {stats.kakao}
          </dd>
        </div>
      </dl>

      <section
        aria-label="회원 목록"
        className="overflow-hidden rounded-lg border bg-white font-anyvid"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="w-[60px] text-center">이미지</TableHead>
              <TableHead className="w-[80px]">이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-[100px] text-center">가입방법</TableHead>
              <TableHead className="w-[80px] text-center">역할</TableHead>
              <TableHead className="w-[80px] text-center">방문</TableHead>
              <TableHead className="w-[80px] text-center">상태</TableHead>
              <TableHead className="w-[150px] text-center">가입일</TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                  등록된 회원이 없습니다.
                </TableCell>
              </TableRow>
            ) : profiles.map((profile, index) => (
              <TableRow
                key={profile.id}
                className="text-muted-foreground hover:bg-gray-50"
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <Avatar className="mx-auto size-9">
                    <AvatarImage
                      src={profile.avatarUrl ?? undefined}
                      alt={`${profile.fullName} 프로필 이미지`}
                    />
                    <AvatarFallback
                      className={`text-xs font-semibold uppercase ${providerStyles[profile.signupProvider]}`}
                    >
                      {profile.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  {profile.fullName}
                </TableCell>
                <TableCell className="text-sm">{profile.email}</TableCell>
                <TableCell className="text-center text-sm capitalize">
                  {profile.signupProvider}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={profile.role === "admin" ? "default" : "outline"}
                    className="font-anyvid text-xs"
                  >
                    {profile.role === "admin" ? "관리자" : "회원"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-sm tabular-nums">
                  {profile.visitCount}회
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={profile.isDeleted ? "destructive" : "default"}
                    className="font-anyvid text-xs"
                  >
                    {profile.isDeleted ? "탈퇴" : "활성"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-sm tabular-nums">
                  {profile.createdAt}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 w-8 p-0 disabled:opacity-100"
                    aria-label={`${profile.fullName} 회원 관리 기능 준비 중`}
                    title="관리 기능 준비 중"
                  >
                    <Settings className="size-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

import Link from "next/link";
import {
  Bookmark,
  Eye,
  Heart,
  Settings,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminReactionItem = {
  id: string;
  slug: string;
  marathonName: string;
  views: number;
  likes: number;
  favorites: number;
  shares: number;
  updatedAt: string;
};

export default function AdminReaction({
  reactions,
}: {
  reactions: AdminReactionItem[];
}) {
  const stats = reactions.reduce(
    (result, reaction) => ({
      views: result.views + reaction.views,
      likes: result.likes + reaction.likes,
      favorites: result.favorites + reaction.favorites,
      shares: result.shares + reaction.shares,
    }),
    { views: 0, likes: 0, favorites: 0, shares: 0 },
  );
  const statCards = [
    {
      icon: Eye,
      label: "페이지뷰",
      count: stats.views,
      color: "text-brand",
    },
    {
      icon: Heart,
      label: "좋아요",
      count: stats.likes,
      color: "text-red-500",
    },
    {
      icon: Bookmark,
      label: "즐겨찾기",
      count: stats.favorites,
      color: "text-violet-600",
    },
    {
      icon: Share2,
      label: "공유하기",
      count: stats.shares,
      color: "text-sky-500",
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">리액션</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          대회 상세페이지의 조회와 사용자 반응 수치를 확인하세요.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map(({ icon: Icon, label, count, color }) => (
          <div key={label} className="rounded-lg border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <dt className="font-paperlogy text-sm text-muted-foreground">
                {label}
              </dt>
              <Icon className={`size-4 ${color}`} aria-hidden="true" />
            </div>
            <dd
              className={`font-paperlogy text-2xl font-semibold tabular-nums ${color}`}
            >
              {count.toLocaleString("ko-KR")}
            </dd>
          </div>
        ))}
      </dl>

      <section
        aria-label="대회별 리액션 목록"
        className="overflow-hidden rounded-lg border bg-white font-anyvid"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>대회명</TableHead>
              <TableHead className="w-[100px] text-center">페이지뷰</TableHead>
              <TableHead className="w-[90px] text-center">좋아요</TableHead>
              <TableHead className="w-[100px] text-center">즐겨찾기</TableHead>
              <TableHead className="w-[90px] text-center">공유하기</TableHead>
              <TableHead className="w-[150px] text-center">최근 집계</TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reactions.map((reaction, index) => (
              <TableRow
                key={reaction.id}
                className="text-muted-foreground hover:bg-gray-50"
              >
                <TableCell className="text-center text-sm">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/marathon/${reaction.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-[420px] truncate text-sm font-medium text-foreground transition-colors hover:text-brand"
                  >
                    {reaction.marathonName}
                  </Link>
                </TableCell>
                <ReactionNumber value={reaction.views} />
                <ReactionNumber value={reaction.likes} />
                <ReactionNumber value={reaction.favorites} />
                <ReactionNumber value={reaction.shares} />
                <TableCell className="text-center text-sm tabular-nums">
                  {reaction.updatedAt}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 w-8 p-0 disabled:opacity-100"
                    aria-label={`${reaction.marathonName} 리액션 관리 기능 준비 중`}
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

function ReactionNumber({ value }: { value: number }) {
  return (
    <TableCell className="text-center text-sm font-medium text-foreground tabular-nums">
      {value.toLocaleString("ko-KR")}
    </TableCell>
  );
}

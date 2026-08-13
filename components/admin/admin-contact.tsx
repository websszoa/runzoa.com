import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  CircleAlert,
  Inbox,
  MessageCircle,
  PencilLine,
  Settings,
} from "lucide-react";

type ContactType = "문의사항" | "불편신고" | "수정요청";
type ContactStatus = "대기중" | "처리중" | "처리완료";
type Contact = {
  id: number;
  type: ContactType;
  email: string;
  subject: string;
  status: ContactStatus;
  answered: boolean;
  createdAt: string;
};
const contacts: Contact[] = [
  {
    id: 9,
    type: "문의사항",
    email: "runner01@example.com",
    subject: "대회 등록 방법에 대해 문의드립니다.",
    status: "대기중",
    answered: false,
    createdAt: "2026.08.11 16:28",
  },
  {
    id: 8,
    type: "불편신고",
    email: "runner02@example.com",
    subject: "캘린더에서 대회 일정이 표시되지 않아요.",
    status: "처리중",
    answered: false,
    createdAt: "2026.08.10 12:59",
  },
  {
    id: 7,
    type: "수정요청",
    email: "organizer@example.com",
    subject: "마라톤 개최 장소 정보 수정을 요청합니다.",
    status: "대기중",
    answered: false,
    createdAt: "2026.08.09 18:46",
  },
  {
    id: 6,
    type: "문의사항",
    email: "runner03@example.com",
    subject: "뉴스레터 구독 해지는 어디에서 하나요?",
    status: "처리완료",
    answered: true,
    createdAt: "2026.08.07 08:57",
  },
  {
    id: 5,
    type: "불편신고",
    email: "runner04@example.com",
    subject: "지도에서 현재 위치 버튼이 동작하지 않습니다.",
    status: "처리완료",
    answered: true,
    createdAt: "2026.08.04 20:14",
  },
  {
    id: 4,
    type: "문의사항",
    email: "runner05@example.com",
    subject: "즐겨찾기 기능 이용 방법을 알고 싶어요.",
    status: "처리완료",
    answered: true,
    createdAt: "2026.08.01 19:03",
  },
  {
    id: 3,
    type: "수정요청",
    email: "race@example.com",
    subject: "대회 접수 마감일이 변경되었습니다.",
    status: "처리중",
    answered: false,
    createdAt: "2026.07.29 15:42",
  },
  {
    id: 2,
    type: "문의사항",
    email: "runner06@example.com",
    subject: "대회 상세페이지 공식 사이트 링크 문의",
    status: "처리완료",
    answered: true,
    createdAt: "2026.07.27 11:30",
  },
  {
    id: 1,
    type: "문의사항",
    email: "runner07@example.com",
    subject: "마라톤 리스트 검색 조건을 문의합니다.",
    status: "처리완료",
    answered: true,
    createdAt: "2026.07.24 09:18",
  },
];

const typeStyles: Record<ContactType, string> = {
  문의사항: "border-brand/35 bg-brand/5 text-brand",
  불편신고: "border-emerald-500/35 bg-emerald-500/5 text-emerald-700",
  수정요청: "border-blue-500/35 bg-blue-500/5 text-blue-700",
};

const statusStyles: Record<ContactStatus, string> = {
  대기중: "border-brand bg-brand text-white",
  처리중: "border-zinc-300 bg-background text-muted-foreground",
  처리완료: "border-zinc-900 bg-zinc-900 text-white",
};

export default function AdminContact() {
  const completedCount = contacts.filter(
    ({ status }) => status === "처리완료",
  ).length;
  const stats: Array<{
    icon: LucideIcon;
    label: string;
    count: number;
    color: string;
  }> = [
    {
      icon: Inbox,
      label: "전체 문의",
      count: contacts.length,
      color: "text-foreground",
    },
    {
      icon: CheckCircle2,
      label: "처리완료",
      count: completedCount,
      color: "text-violet-600",
    },
    {
      icon: CircleAlert,
      label: "불편신고",
      count: countByType("불편신고"),
      color: "text-emerald-600",
    },
    {
      icon: MessageCircle,
      label: "문의사항",
      count: countByType("문의사항"),
      color: "text-brand",
    },
    {
      icon: PencilLine,
      label: "수정요청",
      count: countByType("수정요청"),
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">문의사항</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          문의, 불편신고, 수정요청 내용을 확인하고 빠르게 대응하세요.
        </p>
      </header>

      <section
        aria-label="문의 현황"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
      >
        {stats.map(({ icon: Icon, label, count, color }, index) => (
          <article
            key={label}
            className={`rounded-lg border bg-white p-4 ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-paperlogy text-sm text-muted-foreground">
                {label}
              </h2>
              <Icon className={`size-4 ${color}`} aria-hidden="true" />
            </div>
            <p
              className={`font-paperlogy text-2xl font-semibold tabular-nums ${color}`}
            >
              {count.toLocaleString("ko-KR")}
            </p>
          </article>
        ))}
      </section>

      <section
        aria-label="문의 목록"
        className="overflow-hidden rounded-lg border bg-white font-anyvid"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="w-[90px] text-center">유형</TableHead>
              <TableHead className="w-[200px]">이메일</TableHead>
              <TableHead>문의 제목</TableHead>
              <TableHead className="w-[75px] text-center">상태</TableHead>
              <TableHead className="w-[75px] text-center">답변</TableHead>
              <TableHead className="w-[150px] text-center">문의일</TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-50">
                <TableCell className="text-center tabular-nums">
                  {contact.id}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`font-anyvid text-xs ${typeStyles[contact.type]}`}
                  >
                    {contact.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${contact.email}`}
                    className="block max-w-[190px] truncate hover:text-brand/80"
                  >
                    {contact.email}
                  </a>
                </TableCell>
                <TableCell>
                  <p className="max-w-[300px] truncate text-sm">
                    {contact.subject}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`font-anyvid text-xs ${statusStyles[contact.status]}`}
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`font-anyvid text-xs ${
                      contact.answered
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-brand/35 bg-background text-brand"
                    }`}
                  >
                    {contact.answered ? "답변완료" : "미답변"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {contact.createdAt}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 w-8 p-0 disabled:opacity-100"
                    aria-label={`${contact.subject} 관리 기능 준비 중`}
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

  function countByType(type: ContactType) {
    return contacts.filter((contact) => contact.type === type).length;
  }
}

"use client";

import { useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleAlert,
  Inbox,
  MessageCircle,
  PencilLine,
  Settings,
} from "lucide-react";
import {
  deleteContact,
  updateContact,
  type ContactStatus,
} from "@/app/admin/contact/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type ContactType = "등록문의" | "문의사항" | "불편신고" | "수정요청";

export type AdminContactItem = {
  id: string;
  name: string;
  type: ContactType;
  email: string;
  subject: string;
  relatedUrl: string | null;
  content: string;
  status: ContactStatus;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

const typeStyles: Record<ContactType, string> = {
  등록문의: "border-violet-500/35 bg-violet-500/5 text-violet-700",
  문의사항: "border-brand/35 bg-brand/5 text-brand",
  불편신고: "border-emerald-500/35 bg-emerald-500/5 text-emerald-700",
  수정요청: "border-blue-500/35 bg-blue-500/5 text-blue-700",
};

const statusStyles: Record<ContactStatus, string> = {
  대기중: "border-brand bg-brand text-white",
  처리중: "border-zinc-300 bg-background text-muted-foreground",
  처리완료: "border-zinc-900 bg-zinc-900 text-white",
};

export default function AdminContact({
  initialContacts,
  hasError = false,
}: {
  initialContacts: AdminContactItem[];
  hasError?: boolean;
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState<AdminContactItem | null>(null);
  const [status, setStatus] = useState<ContactStatus>("대기중");
  const [reply, setReply] = useState("");
  const [operationError, setOperationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openContact = (contact: AdminContactItem) => {
    setSelected(contact);
    setStatus(contact.status);
    setReply(contact.reply ?? "");
    setOperationError(null);
  };

  const handleSave = () => {
    if (!selected) return;
    const savedStatus: ContactStatus = reply.trim() ? "처리완료" : status;
    setOperationError(null);
    startTransition(async () => {
      try {
        await updateContact(selected.id, status, reply);
        setContacts((current) =>
          current.map((contact) =>
            contact.id === selected.id
              ? {
                  ...contact,
                  status: savedStatus,
                  reply: reply.trim() || null,
                  repliedAt: reply.trim() ? "방금 전" : null,
                }
              : contact,
          ),
        );
        setSelected(null);
      } catch {
        setOperationError("문의 내용을 저장하지 못했습니다.");
      }
    });
  };

  const handleDelete = () => {
    if (!selected) return;
    const id = selected.id;
    setOperationError(null);
    startTransition(async () => {
      try {
        await deleteContact(id);
        setContacts((current) =>
          current.filter((contact) => contact.id !== id),
        );
        setSelected(null);
      } catch {
        setOperationError("문의를 삭제하지 못했습니다.");
      }
    });
  };

  const pendingContacts = contacts.filter(
    (contact) => contact.status !== "처리완료",
  );
  const stats: Array<{
    icon: LucideIcon;
    label: string;
    count: number;
    color: string;
  }> = [
    {
      icon: Inbox,
      label: "전체 문의",
      count: pendingContacts.length,
      color: "text-foreground",
    },
    {
      icon: PencilLine,
      label: "등록문의",
      count: countByType("등록문의"),
      color: "text-violet-600",
    },
    {
      icon: MessageCircle,
      label: "문의사항",
      count: countByType("문의사항"),
      color: "text-brand",
    },
    {
      icon: CircleAlert,
      label: "불편신고",
      count: countByType("불편신고"),
      color: "text-emerald-600",
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

      {(hasError || operationError) && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
          role="alert"
        >
          {operationError ?? "문의 목록을 불러오지 못했습니다."}
        </p>
      )}

      <section
        aria-label="미처리 문의 현황"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5"
      >
        {stats.map(({ icon: Icon, label, count, color }) => (
          <article key={label} className="rounded-lg border bg-white p-4">
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
              <TableHead className="hidden w-[150px] text-center lg:table-cell">
                문의일
              </TableHead>
              <TableHead className="w-[60px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  등록된 문의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact, index) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  <TableCell className="text-center tabular-nums">
                    {index + 1}
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
                      className={`font-anyvid text-xs ${contact.reply ? "border-zinc-900 bg-zinc-900 text-white" : "border-brand/35 bg-background text-brand"}`}
                    >
                      {contact.reply ? "답변완료" : "미답변"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-center text-muted-foreground tabular-nums lg:table-cell">
                    {contact.createdAt}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openContact(contact)}
                      aria-label={`${contact.subject} 관리`}
                    >
                      <Settings className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="font-paperlogy text-xl font-semibold text-brand">
              문의 상세/수정
            </DialogTitle>
            <DialogDescription className="font-anyvid">
              상태와 답변을 수정한 뒤 저장할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 font-anyvid text-muted-foreground">
              <div className="space-y-2">
                <p className="text-sm text-slate-900">문의자</p>
                <div className="rounded border p-3 text-sm">
                  {selected.name}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-900">문의자 이메일</p>
                <div className="flex items-center justify-center rounded border border-blue-200 bg-blue-50 p-3">
                  <a
                    href={`mailto:${selected.email}`}
                    className="break-all text-sm text-brand underline underline-offset-4 hover:text-brand/80"
                  >
                    {selected.email}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-900">문의 제목</p>
                <div className="rounded border p-3">
                  <p className="break-keep text-sm">{selected.subject}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-900">문의 내용</p>
                <div className="max-h-40 overflow-y-auto rounded border p-3">
                  <p className="whitespace-pre-wrap break-keep text-sm leading-6">
                    {selected.content}
                  </p>
                </div>
              </div>
              {selected.relatedUrl && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-900">관련 페이지</p>
                  <div className="rounded border p-3">
                    <a
                      href={selected.relatedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm text-brand underline underline-offset-4"
                    >
                      {selected.relatedUrl}
                    </a>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="contact-status"
                  className="text-sm text-slate-900"
                >
                  상태
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as ContactStatus)}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="contact-status"
                    className="w-full font-anyvid"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="대기중" className="font-anyvid">
                      대기중
                    </SelectItem>
                    <SelectItem value="처리중" className="font-anyvid">
                      처리중
                    </SelectItem>
                    <SelectItem value="처리완료" className="font-anyvid">
                      처리완료
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contact-reply"
                  className="text-sm text-slate-900"
                >
                  관리자 답변
                </Label>
                <Textarea
                  id="contact-reply"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={10}
                  maxLength={5000}
                  disabled={isPending}
                  placeholder="답변 내용을 입력해 주세요."
                  className="min-h-40 resize-none font-anyvid"
                />
                {selected.repliedAt && (
                  <p className="text-xs text-muted-foreground">
                    최근 답변: {selected.repliedAt}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="mt-2 sm:justify-between">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={isPending}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {isPending ? "처리 중..." : "삭제"}
            </Button>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSelected(null)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="bg-brand text-white hover:bg-brand/90"
              >
                {isPending ? "저장 중..." : reply.trim() ? "답변 저장" : "저장"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function countByType(type: ContactType) {
    return pendingContacts.filter((contact) => contact.type === type).length;
  }
}

"use client";

import { useMemo, useState } from "react";
import {
  Mail,
  Megaphone,
  Settings,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type NewsletterStatus = "구독중" | "구독취소";

export type AdminNewsletterItem = {
  id: string;
  email: string;
  age: string | null;
  source: string | null;
  agreeAds: boolean;
  status: NewsletterStatus;
  createdAt: string;
};

export default function AdminNewsletter({
  initialNewsletters,
}: {
  initialNewsletters: AdminNewsletterItem[];
}) {
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const stats = useMemo(
    () => ({
      total: newsletters.length,
      active: newsletters.filter(({ status }) => status === "구독중").length,
      canceled: newsletters.filter(({ status }) => status === "구독취소")
        .length,
      agreeAds: newsletters.filter(({ agreeAds }) => agreeAds).length,
    }),
    [newsletters],
  );

  const handleToggle = (id: string) => {
    setNewsletters((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "구독중" ? "구독취소" : "구독중",
            }
          : item,
      ),
    );
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    setNewsletters((current) =>
      current.filter(({ id }) => id !== confirmDeleteId),
    );
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">뉴스레터</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          뉴스레터 구독자 목록을 확인하고 관리하세요.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              전체 구독자
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
              구독중
            </dt>
            <UserCheck
              className="size-4 text-emerald-500"
              aria-hidden="true"
            />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-emerald-500 tabular-nums">
            {stats.active}
          </dd>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              구독취소
            </dt>
            <UserX className="size-4 text-gray-400" aria-hidden="true" />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-gray-400 tabular-nums">
            {stats.canceled}
          </dd>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <dt className="font-paperlogy text-sm text-muted-foreground">
              광고 동의
            </dt>
            <Megaphone className="size-4 text-sky-500" aria-hidden="true" />
          </div>
          <dd className="font-paperlogy text-2xl font-semibold text-sky-500 tabular-nums">
            {stats.agreeAds}
          </dd>
        </div>
      </dl>

      <section
        aria-label="뉴스레터 구독자 목록"
        className="overflow-hidden rounded-lg border bg-white font-anyvid"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="w-[80px] text-center">나이대</TableHead>
              <TableHead className="hidden w-[160px] text-center md:table-cell">
                구독 경로
              </TableHead>
              <TableHead className="w-[60px] text-center">광고</TableHead>
              <TableHead className="w-[80px] text-center">상태</TableHead>
              <TableHead className="hidden w-[150px] text-center lg:table-cell">
                구독일
              </TableHead>
              <TableHead className="w-[80px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsletters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Mail className="size-8" aria-hidden="true" />
                    <p className="font-anyvid text-sm">
                      등록된 구독자가 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              newsletters.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="text-muted-foreground hover:bg-gray-50"
                >
                  <TableCell className="text-center text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${item.email}`}
                      className="block max-w-[220px] truncate text-sm transition-colors hover:text-brand"
                    >
                      {item.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {item.age ?? <span className="text-gray-300">-</span>}
                  </TableCell>
                  <TableCell className="hidden text-center text-sm md:table-cell">
                    {item.source ?? <span className="text-gray-300">-</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`font-anyvid text-xs ${
                        item.agreeAds
                          ? "border-sky-500/30 bg-sky-500/10 text-sky-700"
                          : "border-transparent bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.agreeAds ? "동의" : "미동의"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${item.email} 구독 상태 변경`}
                    >
                      <Badge
                        variant="outline"
                        className={`cursor-pointer font-anyvid text-xs ${
                          item.status === "구독중"
                            ? "border-brand bg-brand text-white"
                            : "border-transparent bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="hidden text-center text-sm lg:table-cell">
                    {item.createdAt}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setConfirmDeleteId(item.id)}
                      aria-label={`${item.email} 구독자 관리`}
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
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="font-paperlogy">
              구독자를 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="font-anyvid">
              현재 샘플 화면에서 삭제한 데이터는 새로고침하면 복원됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="font-anyvid"
              onClick={() => setConfirmDeleteId(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              className="bg-red-500 font-anyvid text-white hover:bg-red-600"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

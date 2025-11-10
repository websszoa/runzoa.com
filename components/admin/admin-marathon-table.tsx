import Link from "next/link";
import { Marathon } from "@/lib/types";
import {
  calculateDDay,
  formatDateWithDay,
  getStatusBadgeStyle,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminMarathonTableProps {
  marathons: Marathon[];
  onStatusChange: (marathon: Marathon, status: string) => void;
  updatingStatusId: number | null;
  onEdit: (marathon: Marathon) => void;
}

const STATUS_OPTIONS = ["접수중", "접수대기", "접수마감"];

export default function AdminMarathonTable({
  marathons,
  onStatusChange,
  updatingStatusId,
  onEdit,
}: AdminMarathonTableProps) {
  return (
    <div className="rounded border font-nanumNeo">
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">번호</TableHead>
            <TableHead>대회명</TableHead>
            <TableHead>디데이</TableHead>
            <TableHead>대회 날짜</TableHead>
            <TableHead>접수 상태</TableHead>
            <TableHead>규모</TableHead>
            <TableHead>장소</TableHead>
            <TableHead className="text-center">접수 링크</TableHead>
            <TableHead className="text-center">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marathons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-sm">
                불러온 데이터가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            marathons.map((item, index) => {
              const dDay = calculateDDay(item.event.date);
              const dDayStyle =
                dDay === "종료"
                  ? "text-gray-500 border-gray-400 bg-transparent"
                  : "text-brand border-brand bg-transparent";
              const formattedDate = formatDateWithDay(item.event.date);
              const statusStyle = getStatusBadgeStyle(item.registration.status);

              return (
                <TableRow key={item.id ?? `${item.slug}-${index}`}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/marathon/${item.slug}`}
                      className="font-medium transition-colors hover:text-brand"
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={dDayStyle}>{dDay}</Badge>
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusStyle}>
                        {item.registration.status}
                      </Badge>
                      <select
                        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand focus:outline-none"
                        value={item.registration.status}
                        onChange={(event) =>
                          onStatusChange(item, event.target.value)
                        }
                        disabled={updatingStatusId === item.id}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                  <TableCell>{item.scale}</TableCell>
                  <TableCell>{item.location.text}</TableCell>
                  <TableCell className="text-center">
                    {item.registration.site ? (
                      <Link
                        href={item.registration.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand transition-colorshover:underline underline-offset-4  hover:text-brand/80"
                      >
                        접수하기
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="font-medium text-brand hover:underline underline-offset-4 hover:text-brand/80"
                    >
                      수정
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

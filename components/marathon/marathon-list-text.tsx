import Link from "next/link";
import { Marathon } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  calculateDDay,
  getStatusBadgeStyle,
  formatDateWithDay,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarathonListTextProps {
  marathons: Marathon[];
}

export default function MarathonListText({ marathons }: MarathonListTextProps) {
  return (
    <div className="marathon-list-text rounded border font-nanumNeo">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">번호</TableHead>
            <TableHead>대회명</TableHead>
            <TableHead>디데이</TableHead>
            <TableHead>대회 날짜</TableHead>
            <TableHead>접수 상태</TableHead>
            <TableHead>규모</TableHead>
            <TableHead>장소</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marathons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                해당 기간에 등록된 마라톤이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            marathons.map((item, idx) => {
              // 디데이 계산
              const dDay = calculateDDay(item.event.date);

              // 날짜 포맷 (YYYY-MM-DD(요일))
              const formattedDate = formatDateWithDay(item.event.date);

              // 접수 상태 스타일
              const statusStyle = getStatusBadgeStyle(item.registration.status);

              // 디데이 스타일 (종료된 경우 회색)
              const dDayStyle =
                dDay === "종료"
                  ? "text-gray-500 border-gray-400 bg-transparent"
                  : "text-brand border-brand bg-transparent";

              return (
                <TableRow
                  key={item.slug}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="text-left">
                    <Link
                      href={`/marathon/${item.slug}`}
                      className="hover:text-brand transition-colors font-medium"
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left">
                    <Badge className={dDayStyle}>{dDay}</Badge>
                  </TableCell>
                  <TableCell className="text-left">{formattedDate}</TableCell>
                  <TableCell className="text-left">
                    <Badge className={statusStyle}>
                      {item.registration.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">{item.scale}</TableCell>
                  <TableCell className="text-left">
                    {item.location.text}
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

"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

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
import type { Marathon } from "@/lib/marathons";
import { cn, formatMarathonDate } from "@/lib/utils";

type Props = {
  datasets: Record<number, Marathon[]>;
  initialYear: number;
};

export default function MarathonYearList({ datasets, initialYear }: Props) {
  const years = useMemo(
    () => Object.keys(datasets).map(Number).sort((a, b) => b - a),
    [datasets],
  );
  const [year, setYear] = useState(initialYear);
  const marathons = useMemo(() => datasets[year] ?? [], [datasets, year]);

  return (
    <section className="border-t bg-muted/20" aria-label="연도별 마라톤 대회">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="조회 연도 선택">
              {years.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={year === item ? "default" : "outline"}
                  onClick={() => setYear(item)}
                  aria-pressed={year === item}
                  className={cn(
                    "h-10 min-w-24 font-paperlogy text-sm font-semibold",
                    year === item && "border-brand bg-brand text-white hover:bg-brand/90",
                  )}
                >
                  {item}년
                </Button>
              ))}
            </div>
            <p className="font-anyvid text-sm text-muted-foreground">
              현재 <strong className="font-semibold text-brand">{marathons.length.toLocaleString("ko-KR")}</strong>개의 대회가 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="overflow-hidden rounded-lg border bg-white font-anyvid">
          <Table className="min-w-[940px]">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[54px] text-center">No</TableHead>
                <TableHead>대회명</TableHead>
                <TableHead className="w-[100px] text-center">유형</TableHead>
                <TableHead className="w-[150px] text-center">대회일</TableHead>
                <TableHead className="w-[210px]">지역·장소</TableHead>
                <TableHead className="w-[100px] text-center">상태</TableHead>
                <TableHead className="w-[70px] text-center">링크</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marathons.map((marathon, index) => {
                const site = marathon.event.site ?? marathon.registration.site;

                return (
                  <TableRow key={marathon.slug} className="text-muted-foreground hover:bg-gray-50">
                    <TableCell className="text-center text-sm tabular-nums">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {site ? (
                        <a
                          href={site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[420px] truncate text-sm font-medium text-foreground transition-colors hover:text-brand"
                        >
                          {marathon.name}
                        </a>
                      ) : (
                        <span className="block max-w-[420px] truncate text-sm font-medium text-foreground">
                          {marathon.name}
                        </span>
                      )}
                      <span className="mt-0.5 block max-w-[420px] truncate text-xs text-muted-foreground">
                        {marathon.info.program || marathon.slug}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {marathon.info.type ?? "-"}
                    </TableCell>
                    <TableCell className="text-center text-sm tabular-nums">
                      {formatMarathonDate(marathon.event.startDate)}
                    </TableCell>
                    <TableCell className="text-left text-sm">
                      <span className="block max-w-[210px] truncate">
                        {[marathon.location.region, marathon.location.venue].filter(Boolean).join(" · ") || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-gray-200 bg-gray-50 font-anyvid text-xs text-gray-500">
                        종료
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {site ? (
                        <Button
                          nativeButton={false}
                          render={<a href={site} target="_blank" rel="noopener noreferrer" />}
                          variant="outline"
                          size="icon-sm"
                          aria-label={`${marathon.name} 홈페이지 열기`}
                        >
                          <ExternalLink className="size-4" aria-hidden="true" />
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

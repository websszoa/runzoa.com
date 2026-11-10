"use client";

import { CalendarCheck, CircleAlert, ExternalLink } from "lucide-react";
import type { Marathon } from "@/lib/marathons";
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
  cn,
  formatMarathonDate,
  formatMarathonPrices,
  getEffectiveRegistrationSchedule,
  getMarathonDistances,
} from "@/lib/utils";

export type CalendarEventKind = "race" | "registration";
export type CalendarProvider = "kakao" | "naver";

type CalendarPreviewEntry = {
  label: string;
  value: string;
  href?: string;
};

export type CalendarAddResult = {
  marathonName: string;
  kind: CalendarEventKind;
  provider: CalendarProvider;
  entries: CalendarPreviewEntry[];
  alreadyAdded: boolean;
  warning?: string;
};

const PROVIDER_LABEL: Record<CalendarProvider, string> = {
  kakao: "카카오톡",
  naver: "네이버",
};

const PROVIDER_CALENDAR_URL: Record<CalendarProvider, string> = {
  kakao: "https://calendar.kakao.com/",
  naver: "https://calendar.naver.com/",
};

export function buildCalendarPreviewEntries(
  marathon: Marathon,
  provider: CalendarProvider,
  kind: CalendarEventKind,
): CalendarPreviewEntry[] {
  const isRegistration = kind === "registration";
  const schedule = isRegistration
    ? getEffectiveRegistrationSchedule(marathon)
    : marathon.event;
  const site =
    (isRegistration ? marathon.registration.site : marathon.event.site) ??
    (isRegistration ? marathon.event.site : marathon.registration.site);
  const venue = marathon.location.venue;
  const address = marathon.location.address;
  const distances = getMarathonDistances(marathon.registration.price).join(
    " / ",
  );
  const scheduleText = schedule.startDate
    ? `${formatMarathonDate(schedule.startDate)}${schedule.startTime ? ` ${schedule.startTime}` : ""}`
    : "일정 미정";
  const baseTitle = isRegistration ? `[접수] ${marathon.name}` : marathon.name;
  const title =
    provider === "kakao"
      ? Array.from(baseTitle).slice(0, 50).join("")
      : baseTitle;

  return [
    { label: "제목", value: title },
    { label: "일정", value: scheduleText },
    ...(venue ? [{ label: "장소", value: venue }] : []),
    ...(address ? [{ label: "주소", value: address }] : []),
    ...(distances ? [{ label: "종목", value: distances }] : []),
    {
      label: "가격",
      value: formatMarathonPrices(
        marathon.registration.price,
        marathon.registration.currency ?? "KRW",
      ),
    },
    ...(site ? [{ label: "링크", value: site, href: site }] : []),
    {
      label: "알림",
      value:
        provider === "kakao"
          ? "하루전, 10분전"
          : "네이버 캘린더에서 설정할 수 있어요",
    },
  ];
}

export default function DialogCalendarAdd({
  result,
  onClose,
}: {
  result: CalendarAddResult | null;
  onClose: () => void;
}) {
  const providerName = result ? PROVIDER_LABEL[result.provider] : "";

  return (
    <Dialog open={Boolean(result)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <CalendarCheck className="size-8" aria-hidden="true" />
          </div>
          <DialogTitle className="font-paperlogy text-xl font-semibold">
            {result?.alreadyAdded
              ? "이미 추가된 일정이에요"
              : "캘린더에 추가했어요!"}
          </DialogTitle>
          <DialogDescription className="break-keep text-center font-anyvid">
            선택한 일정을 다음과 같이 저장했습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/35 p-4 font-anyvid">
          <dl className="space-y-2.5">
            {result?.entries.map((entry) => (
              <div key={`${entry.label}:${entry.value}`} className="flex gap-2">
                <dt className="text-sm font-medium text-muted-foreground">
                  {entry.label} :
                </dt>
                <dd className="wrap-break-word text-sm leading-5 text-foreground">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-brand underline underline-offset-3 hover:text-brand/80"
                    >
                      {entry.value}
                    </a>
                  ) : (
                    entry.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {result?.warning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 font-anyvid text-xs leading-5 text-amber-800">
            <CircleAlert
              className="mt-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{result.warning}</span>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            size="lg"
            className={cn(
              "w-full border-transparent font-anyvid font-semibold",
              result?.provider === "kakao"
                ? "bg-[#FEE500] text-[#3C1E1E] hover:bg-[#F5DC00] hover:text-[#3C1E1E]"
                : "bg-[#03c75a] text-white hover:bg-[#02b351] hover:text-white",
            )}
            nativeButton={false}
            render={
              <a
                href={result ? PROVIDER_CALENDAR_URL[result.provider] : "#"}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            {providerName} 캘린더에서 확인
            <ExternalLink className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full bg-background font-anyvid font-semibold hover:bg-muted"
            onClick={onClose}
          >
            계속 둘러보기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

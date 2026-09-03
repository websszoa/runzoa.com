import Link from "next/link";
import DialogNewsletter from "@/components/dialog/dialog-newsletter";
import type { Marathon } from "@/lib/marathons";
import { formatMarathonDate, getRegistrationStatus } from "@/lib/utils";
import {
  Asterisk,
  ArrowUpRight,
  BellRing,
  CalendarCheck,
  CalendarDays,
  HandHeart,
} from "lucide-react";

export default function DetailRegistration({
  marathon,
}: {
  marathon: Marathon;
}) {
  const prices = Object.entries(marathon.registration.price ?? {}).filter(
    (entry): entry is [string, number | string] => entry[1] !== null,
  );
  const schedule = Object.entries(marathon.event.schedule ?? {});
  const additionalRegistration = marathon.registration.additional;
  const hasAdditionalRegistrationInfo = Boolean(
    additionalRegistration &&
      Object.values(additionalRegistration).some(Boolean),
  );
  const hasRegistrationInfo = Boolean(
    marathon.registration.startDate ||
      marathon.registration.endDate ||
      prices.length > 0 ||
      hasAdditionalRegistrationInfo,
  );
  const registrationStatus = getRegistrationStatus(marathon);

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="flex min-h-80 flex-col overflow-hidden rounded-2xl border bg-card shadow-none">
        <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
          <CalendarDays
            className="size-5 shrink-0 text-brand"
            aria-hidden="true"
          />
          <h2 className="font-paperlogy text-lg font-semibold">대회 기간</h2>
          {marathon.event.site && (
            <a
              href={marathon.event.site}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex h-6 items-center gap-1 rounded-full border border-brand px-2.5 font-anyvid text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-white"
            >
              대회 사이트
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 font-anyvid md:p-6">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <Asterisk
                className="h-4.5 w-4.5 shrink-0 text-red-400"
                aria-hidden="true"
              />
              <span>
                대회 시작 : {formatMarathonDate(marathon.event.startDate)}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Asterisk
                className="h-4.5 w-4.5 shrink-0 text-blue-400"
                aria-hidden="true"
              />
              <span>
                대회 종료 :{" "}
                {formatMarathonDate(
                  marathon.event.endDate ?? marathon.event.startDate,
                )}
                {marathon.event.endTime && ` · ${marathon.event.endTime}`}
              </span>
            </p>
          </div>

          {schedule.length > 0 ? (
            <div className="mt-6 overflow-hidden rounded-xl border bg-muted/20 text-sm">
              <div className="divide-y">
                {schedule.map(([time, description]) => {
                  const isShuttle = description.startsWith("셔틀버스");
                  return (
                    <div
                      key={`${time}-${description}`}
                      className="grid grid-cols-[85px_minmax(0,1fr)]"
                    >
                      <span
                        className={`flex items-center justify-center border-r px-2 py-2.5 text-center text-sm tabular-nums ${isShuttle ? "bg-brand font-semibold text-white" : "text-muted-foreground"}`}
                      >
                        {time}
                      </span>
                      <span className="min-w-0 px-3 py-2.5 text-sm leading-5 text-muted-foreground">
                        {description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 flex min-h-24 flex-1 items-center justify-center rounded-xl border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
              등록된 상세 일정이 없습니다.
            </div>
          )}
        </div>
      </article>

      <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-none lg:min-h-80">
        <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
          <CalendarCheck
            className="size-5 shrink-0 text-brand"
            aria-hidden="true"
          />
          <h2 className="font-paperlogy text-lg font-semibold">접수 정보</h2>
          {registrationStatus === "접수마감" ? (
            <span className="ml-auto inline-flex h-6 items-center rounded-full bg-brand px-2.5 font-anyvid text-xs font-medium text-white">
              접수 마감
            </span>
          ) : marathon.registration.site ? (
            <a
              href={marathon.registration.site}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex h-6 items-center gap-1 rounded-full border border-brand px-2.5 font-anyvid text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-white"
            >
              접수 사이트
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5 font-anyvid md:p-6">
          {hasRegistrationInfo ? (
            <>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Asterisk
                    className="h-4.5 w-4.5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                  <span>
                    접수 시작 :{" "}
                    {marathon.registration.startDate
                      ? `${formatMarathonDate(marathon.registration.startDate)}${marathon.registration.startTime ? ` · ${marathon.registration.startTime}` : ""}`
                      : "일정 미정"}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Asterisk
                    className="h-4.5 w-4.5 shrink-0 text-blue-400"
                    aria-hidden="true"
                  />
                  <span>
                    접수 마감 :{" "}
                    {marathon.registration.endDate
                      ? `${formatMarathonDate(marathon.registration.endDate)}${marathon.registration.endTime ? ` · ${marathon.registration.endTime}` : ""}`
                      : marathon.registration.startDate
                        ? "선착순 마감"
                        : "-"}
                  </span>
                </p>
              </div>

              {prices.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-xl border bg-muted/20 text-sm">
                  <div className="divide-y">
                    {prices.map(([distance, price]) => (
                      <div
                        key={distance}
                        className="grid grid-cols-[130px_minmax(0,1fr)]"
                      >
                        <span className="flex items-center justify-center border-r px-2 py-2.5 text-center text-sm text-muted-foreground">
                          {distance}
                        </span>
                        <span className="min-w-0 px-3 py-2.5 text-right text-sm leading-5 text-muted-foreground">
                          {formatPrice(price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAdditionalRegistrationInfo && additionalRegistration && (
                <div className="mt-6 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Asterisk
                      className="h-4.5 w-4.5 shrink-0 text-red-400"
                      aria-hidden="true"
                    />
                    <span>
                      추가 접수 시작 :{" "}
                      {additionalRegistration.startDate
                        ? `${formatMarathonDate(additionalRegistration.startDate)}${additionalRegistration.startTime ? ` · ${additionalRegistration.startTime}` : ""}`
                        : "일정 미정"}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Asterisk
                      className="h-4.5 w-4.5 shrink-0 text-blue-400"
                      aria-hidden="true"
                    />
                    <span>
                      추가 접수 마감 :{" "}
                      {additionalRegistration.endDate
                        ? `${formatMarathonDate(additionalRegistration.endDate)}${additionalRegistration.endTime ? ` · ${additionalRegistration.endTime}` : ""}`
                        : additionalRegistration.startDate
                          ? "선착순 마감"
                          : "-"}
                    </span>
                  </p>
                  {additionalRegistration.memo && (
                    <p className="flex items-start gap-2">
                      <Asterisk
                        className="h-4.5 w-4.5 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="break-keep">
                        {additionalRegistration.memo}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-24 flex-1 items-center justify-center rounded-xl border bg-muted/20 px-4 text-center text-sm text-muted-foreground">
              등록된 접수 정보가 없습니다.
            </div>
          )}
        </div>
      </article>

      <article className="flex min-h-80 flex-col overflow-hidden rounded-2xl border bg-card shadow-none">
        <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
          <BellRing className="size-5 shrink-0 text-brand" aria-hidden="true" />
          <h2 className="font-paperlogy text-lg font-semibold">런조아 구독</h2>
          <Link
            href="/newsletter"
            className="ml-auto inline-flex h-6 items-center gap-1 rounded-full border border-brand px-2.5 font-anyvid text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-white"
          >
            뉴스레터
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-1 font-anyvid">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand/[0.08] via-background to-amber-50 px-5 py-8 text-center">
            <span
              className="absolute -top-12 -right-10 size-32 rounded-full bg-brand/5"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-14 -left-10 size-32 rounded-full bg-amber-300/10"
              aria-hidden="true"
            />

            <span className="relative flex size-12 items-center justify-center rounded-full bg-background text-brand ring-1 ring-brand/10">
              <BellRing className="size-5" aria-hidden="true" />
            </span>
            <p className="relative mt-4 font-paperlogy text-2xl text-foreground">
              러닝 소식을 놓치지 마세요!
            </p>
            <p className="relative mt-2 text-sm leading-5.5 text-muted-foreground">
              새로운 대회 일정과 접수 오픈 소식을
              <br />
              런조아가 한눈에 정리해 드려요.
            </p>

            <div className="relative mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-1">
                <CalendarDays
                  className="size-3.5 text-blue-500"
                  aria-hidden="true"
                />
                대회 일정
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-1">
                <CalendarCheck
                  className="size-3.5 text-violet-500"
                  aria-hidden="true"
                />
                접수 오픈
              </span>
            </div>

            <DialogNewsletter
              subscriptionSource="대회 상세페이지"
              className="cursor-pointer relative mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              <HandHeart className="size-4" aria-hidden="true" />
              구독하기
            </DialogNewsletter>
          </div>
        </div>
      </article>
    </section>
  );
}

function formatPrice(price: number | string) {
  return typeof price === "number"
    ? `${price.toLocaleString("ko-KR")}원`
    : price;
}

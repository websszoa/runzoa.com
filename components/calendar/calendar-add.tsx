"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DialogCalendarAdd, {
  buildCalendarPreviewEntries,
  type CalendarAddResult,
  type CalendarEventKind,
  type CalendarProvider,
} from "@/components/dialog/dialog-calendar-add";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Marathon } from "@/lib/marathons";
import {
  ArrowRight,
  CalendarPlus2,
  Check,
  CircleAlert,
  LoaderCircle,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getAdditionalRegistrationStatus,
  getEffectiveRegistrationSchedule,
  getMarathonDistances,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
  isAdditionalRegistrationActive,
  cn,
} from "@/lib/utils";

type EventKind = CalendarEventKind;
type Provider = CalendarProvider;

type StatusFilter = "전체" | "접수중" | "접수예정" | "추가접수" | "접수마감";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "전체", label: "모든 접수 상태" },
  { value: "접수중", label: "접수중" },
  { value: "접수예정", label: "접수 예정" },
  { value: "추가접수", label: "추가 접수" },
  { value: "접수마감", label: "접수 마감" },
];

type CalendarAddProps = {
  marathons: Marathon[];
  hasError: boolean;
  isLoggedIn: boolean;
  kakaoConnected: boolean;
  initialKakaoRaceAddedSlugs: string[];
  initialKakaoRegistrationAddedSlugs: string[];
};

const PROVIDER_LABEL: Record<Provider, string> = {
  kakao: "카카오톡",
};

const PROVIDER_SHORT_LABEL: Record<Provider, string> = {
  kakao: "카카오",
};

const PROVIDERS: Provider[] = ["kakao"];

const PAGE_SIZE = 30;

export default function CalendarAdd({
  marathons,
  hasError,
  isLoggedIn,
  kakaoConnected,
  initialKakaoRaceAddedSlugs,
  initialKakaoRegistrationAddedSlugs,
}: CalendarAddProps) {
  const [kakaoRaceAddedSlugs, setKakaoRaceAddedSlugs] = useState(
    () => new Set(initialKakaoRaceAddedSlugs),
  );
  const [kakaoRegistrationAddedSlugs, setKakaoRegistrationAddedSlugs] =
    useState(() => new Set(initialKakaoRegistrationAddedSlugs));
  const [kakaoReconnectRequired, setKakaoReconnectRequired] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("접수예정");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [resultDialog, setResultDialog] = useState<CalendarAddResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const kakaoCanUse = isLoggedIn && kakaoConnected && !kakaoReconnectRequired;
  const canUseByProvider: Record<Provider, boolean> = {
    kakao: kakaoCanUse,
  };
  const connectedProviders = PROVIDERS.filter((p) => canUseByProvider[p]);
  const visibleProviders =
    connectedProviders.length > 0 ? connectedProviders : (["kakao"] as const);

  const isAdded = (slug: string, kind: EventKind) => {
    return kind === "registration"
      ? kakaoRegistrationAddedSlugs.has(slug)
      : kakaoRaceAddedSlugs.has(slug);
  };

  const filteredMarathons = useMemo(() => {
    if (statusFilter === "전체") return marathons;
    if (statusFilter === "추가접수") {
      return marathons.filter((marathon) =>
        isAdditionalRegistrationActive(marathon),
      );
    }
    return marathons.filter(
      (marathon) => getRegistrationStatus(marathon) === statusFilter,
    );
  }, [statusFilter, marathons]);

  const addToCalendar = async (
    marathon: Marathon,
    provider: Provider,
    kind: EventKind = "race",
  ) => {
    const key = `${provider}:${marathon.slug}:${kind}`;
    setPendingKey(key);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/calendar/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: marathon.slug, kind }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        alreadyAdded?: boolean;
        warning?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok || !result.success) {
        if (
          result.code === "RECONNECT_REQUIRED" ||
          result.code === "AUTH_REQUIRED"
        ) {
          setKakaoReconnectRequired(true);
        }
        setErrorMessage(result.error ?? "일정을 추가하지 못했습니다.");
        return;
      }

      const addSlug =
        kind === "registration"
          ? setKakaoRegistrationAddedSlugs
          : setKakaoRaceAddedSlugs;
      addSlug((current) => new Set(current).add(marathon.slug));
      setResultDialog({
        marathonName: marathon.name,
        kind,
        provider,
        entries: buildCalendarPreviewEntries(marathon, kind),
        alreadyAdded: Boolean(result.alreadyAdded),
        warning: result.warning,
      });
    } catch {
      setErrorMessage("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ConnectionStatus
              provider="kakao"
              isLoggedIn={isLoggedIn}
              connected={kakaoCanUse}
              reconnectRequired={kakaoReconnectRequired}
            />
            <KakaoReminderGuide />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
            >
              <CircleAlert
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="mt-4">
              <h2 className="font-paperlogy text-xl font-semibold">
                마라톤 대회 선택
              </h2>
              <p className="mt-1 font-anyvid text-sm text-muted-foreground">
                조건에 맞는 대회{" "}
                <strong className="font-black text-brand">
                  {filteredMarathons.length.toLocaleString("ko-KR")}
                </strong>
                개가 있습니다.
              </p>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter((value ?? "전체") as StatusFilter);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <SelectTrigger
                aria-label="접수 상태"
                className="w-full bg-background font-anyvid sm:w-40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {STATUS_FILTERS.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="font-anyvid"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <section className="overflow-hidden rounded-2xl border bg-background">
            {hasError ? (
              <EmptyState message="대회 목록을 불러오지 못했습니다." />
            ) : filteredMarathons.length === 0 ? (
              <EmptyState message="선택한 조건에 맞는 대회가 없습니다." />
            ) : (
              <div className="divide-y overflow-hidden bg-card">
                {filteredMarathons.slice(0, visibleCount).map((marathon) => {
                  const registrationStatus = getRegistrationStatus(marathon);
                  const additionalRegistrationStatus =
                    getAdditionalRegistrationStatus(marathon);
                  const isAdditionalActive =
                    additionalRegistrationStatus === "접수중" ||
                    additionalRegistrationStatus === "접수예정";
                  const registrationLabel =
                    additionalRegistrationStatus === "접수중"
                      ? "추가 접수중"
                      : additionalRegistrationStatus === "접수예정"
                        ? "추가 접수 예정"
                        : getRegistrationLabel(registrationStatus);
                  const registrationBadgeClassName = isAdditionalActive
                    ? "border-violet-500 bg-violet-500 text-white"
                    : getRegistrationBadgeClassName(registrationStatus);
                  const effectiveRegistrationSchedule =
                    getEffectiveRegistrationSchedule(marathon);
                  const showRegistrationButton =
                    (registrationStatus === "접수예정" || isAdditionalActive) &&
                    Boolean(effectiveRegistrationSchedule.startDate);
                  const distances = getMarathonDistances(
                    marathon.registration.price,
                  );
                  const weekday = formatMarathonDate(
                    marathon.event.startDate,
                  ).match(/\((.+)\)/)?.[1];
                  return (
                    <article
                      key={marathon.slug}
                      className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:p-5"
                    >
                      <div className="flex min-w-24 items-center gap-3 sm:flex-col sm:gap-1 sm:text-center">
                        <p className="flex items-baseline gap-1 font-paperlogy text-lg font-semibold tabular-nums">
                          {marathon.event.startDate.slice(5).replace("-", ".")}
                          <span className="relative -top-0.5 font-anyvid text-xs font-normal text-muted-foreground">
                            {weekday}
                          </span>
                        </p>
                        <div className="ml-auto flex gap-1.5 sm:hidden">
                          <Badge
                            variant="outline"
                            className={registrationBadgeClassName}
                          >
                            {registrationLabel}
                          </Badge>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                        <div className="mb-1.5 hidden flex-wrap gap-1.5 sm:flex">
                          <Badge
                            variant="outline"
                            className={registrationBadgeClassName}
                          >
                            {registrationLabel}
                          </Badge>
                        </div>
                        <h3 className="truncate font-paperlogy text-xl font-semibold">
                          <Link
                            href={`/marathon/${encodeURIComponent(marathon.slug)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {marathon.name}
                          </Link>
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1.5 font-anyvid text-sm text-muted-foreground">
                          <p className="flex min-w-0 items-center gap-1.5">
                            <MapPin
                              className="size-3.5 shrink-0 text-pink-500"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {marathon.location.region || "지역 확인"}
                              {marathon.location.venue && (
                                <span>{` · ${marathon.location.venue}`}</span>
                              )}
                            </span>
                          </p>
                          <p className="hidden items-center gap-1.5 sm:flex">
                            <WalletCards
                              className="size-3.5 shrink-0 text-emerald-500"
                              aria-hidden="true"
                            />
                            {formatMarathonPrices(
                              marathon.registration.price,
                              marathon.registration.currency ?? "KRW",
                            )}
                          </p>
                          {distances.length > 0 && (
                            <p className="hidden items-center gap-1.5 sm:flex">
                              <Tag
                                className="size-3.5 shrink-0 text-violet-500"
                                aria-hidden="true"
                              />
                              {distances.join(" / ")}
                            </p>
                          )}
                          {marathon.info.scale && (
                            <p className="hidden items-center gap-1.5 sm:flex">
                              <Users
                                className="size-3.5 shrink-0 text-amber-500"
                                aria-hidden="true"
                              />
                              약 {marathon.info.scale.toLocaleString("ko-KR")}명
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex w-full shrink-0 flex-col gap-2 border-t pt-3 sm:w-80 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                        <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/25 p-3">
                          <div className="min-w-0 font-anyvid">
                            <p className="text-xs font-medium text-muted-foreground">
                              대회 날짜 추가하기
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-foreground">
                              {formatMarathonDate(marathon.event.startDate)}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                            {visibleProviders.map((provider) => {
                              const added = isAdded(
                                marathon.slug,
                                "race",
                              );
                              const pending =
                                pendingKey ===
                                `${provider}:${marathon.slug}:race`;
                              return (
                                <ProviderActionButton
                                  key={provider}
                                  provider={provider}
                                  added={added}
                                  pending={pending}
                                  disabled={
                                    !canUseByProvider[provider] ||
                                    Boolean(pendingKey)
                                  }
                                  onClick={() =>
                                    void addToCalendar(
                                      marathon,
                                      provider,
                                      "race",
                                    )
                                  }
                                  title={`${PROVIDER_LABEL[provider]} 대회 일정`}
                                  label={
                                    pending
                                      ? `${marathon.name} 대회 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가 중`
                                      : added
                                        ? `${marathon.name} 대회 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가 완료`
                                        : `${marathon.name} 대회 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가`
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>

                        {showRegistrationButton && (
                          <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/25 p-3">
                            <div className="min-w-0 font-anyvid">
                              <p className="text-xs font-medium text-muted-foreground">
                                접수 날짜 추가하기
                              </p>
                              <p className="mt-1 truncate text-sm font-medium text-foreground">
                                {formatMarathonDate(
                                  effectiveRegistrationSchedule.startDate,
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                              {visibleProviders.map((provider) => {
                                const added = isAdded(
                                  marathon.slug,
                                  "registration",
                                );
                                const pending =
                                  pendingKey ===
                                  `${provider}:${marathon.slug}:registration`;
                                return (
                                  <ProviderActionButton
                                    key={provider}
                                    provider={provider}
                                    added={added}
                                    pending={pending}
                                    disabled={
                                      !canUseByProvider[provider] ||
                                      Boolean(pendingKey)
                                    }
                                    onClick={() =>
                                      void addToCalendar(
                                        marathon,
                                        provider,
                                        "registration",
                                      )
                                    }
                                    title={`${PROVIDER_LABEL[provider]} 접수 일정`}
                                    label={
                                      pending
                                        ? `${marathon.name} 접수 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가 중`
                                        : added
                                          ? `${marathon.name} 접수 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가 완료`
                                          : `${marathon.name} 접수 일정 ${PROVIDER_LABEL[provider]} 캘린더에 추가`
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {visibleCount < filteredMarathons.length && (
              <div className="border-t p-4 text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  대회 더 보기
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>

      <DialogCalendarAdd
        result={resultDialog}
        onClose={() => setResultDialog(null)}
      />
    </>
  );
}

function ProviderActionButton({
  provider,
  added,
  pending,
  disabled,
  onClick,
  label,
  title,
}: {
  provider: Provider;
  added: boolean;
  pending: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
  title: string;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      title={title}
      className={cn(
        "shrink-0 rounded-full px-4 font-anyvid text-xs",
        added
          ? "bg-[#3C1E1E] text-[#FEE500] hover:bg-[#3C1E1E] hover:text-[#FEE500] disabled:opacity-100"
          : "bg-[#FEE500] text-[#3C1E1E] hover:bg-[#F5DC00]",
      )}
      disabled={disabled || added}
      onClick={onClick}
      aria-label={label}
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          추가 중
        </>
      ) : added ? (
        "추가완료"
      ) : (
        <>
          <CalendarPlus2 className="size-4" aria-hidden="true" />
          {PROVIDER_SHORT_LABEL[provider]} 추가
        </>
      )}
    </Button>
  );
}

function KakaoReminderGuide() {
  return (
    <Card className="overflow-hidden rounded-2xl py-0">
      <div className="grid h-full sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="flex flex-col justify-center px-5 py-6 sm:px-6">
          <Badge
            variant="outline"
            className="w-fit border-amber-200 bg-amber-50 font-anyvid text-amber-800"
          >
            톡캘린더 자동 알림
          </Badge>
          <h2 className="mt-3 font-paperlogy text-lg font-semibold">
            중요한 일정을 놓치지 마세요
          </h2>
          <p className="mt-2 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
            시간이 등록된 대회와 접수 일정은 하루 전과 1시간 전에
            카카오톡 톡캘린더 알림으로 다시 알려드려요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 font-anyvid text-xs font-semibold text-foreground">
            <span className="rounded-full bg-muted px-3 py-1.5">하루 전</span>
            <span className="rounded-full bg-muted px-3 py-1.5">1시간 전</span>
          </div>
        </div>
        <div className="relative min-h-64 border-t bg-[#c8deec] sm:min-h-full sm:border-t-0 sm:border-l">
          <Image
            src="/images/calendar/kakao-talk-calendar-reminders.png"
            alt="카카오톡 톡캘린더에서 하루 전과 1시간 전에 받은 마라톤 일정 알림 예시"
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </Card>
  );
}

function ConnectionStatus({
  provider,
  isLoggedIn,
  connected,
  reconnectRequired,
}: {
  provider: Provider;
  isLoggedIn: boolean;
  connected: boolean;
  reconnectRequired: boolean;
}) {
  const [isNavigating, setIsNavigating] = useState(false);
  const providerName = PROVIDER_LABEL[provider];
  const loginUrl = "/auth/kakao/start";
  const description = connected
    ? `${providerName} 캘린더에 대회 일정을 바로 추가할 수 있어요.`
    : reconnectRequired
      ? "연결이 만료되었어요. 다시 로그인하면 계속 이용할 수 있어요."
      : `${providerName} 캘린더와 연결하고 원하는 대회 일정을 간편하게 저장해 보세요.`;

  return (
    <Card className="gap-0 rounded-2xl py-0">
      <CardHeader className="flex-row items-start gap-4 px-5 pt-6 pb-4 sm:px-6">
        <ProviderIcon />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-paperlogy text-lg font-semibold">
              {providerName} 캘린더
            </h2>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2 py-0.5 font-anyvid text-[11px] font-semibold",
                connected
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : reconnectRequired
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-border bg-muted/60 text-muted-foreground",
              )}
            >
              {connected
                ? "연결됨"
                : reconnectRequired
                  ? "재연결 필요"
                  : "연결 전"}
            </Badge>
          </div>
          <p className="mt-1.5 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="mt-auto gap-0 border-t bg-muted/20 px-5 py-4 sm:px-6">
        {connected ? (
          <div className="flex items-center gap-2 font-anyvid text-sm font-medium text-emerald-700">
            <span
              className="flex size-6 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E]"
            >
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            아래 목록에서 추가할 대회를 선택해 주세요.
          </div>
        ) : (
          <Button
            nativeButton={false}
            render={<a href={loginUrl} />}
            disabled={isNavigating}
            onClick={() => setIsNavigating(true)}
            className="h-11 w-full justify-between rounded-lg bg-[#FEE500] px-4 font-anyvid font-semibold text-[#3C1E1E] hover:bg-[#F5DC00]"
          >
            {isNavigating ? (
              <span className="flex items-center gap-2.5">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                로그인 중...
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2.5">
                  <ProviderLogo />
                  {providerName}
                  으로 {isLoggedIn ? "다시 로그인" : "로그인"}
                </span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ProviderIcon() {
  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FEE500]"
      aria-hidden="true"
    >
      <ProviderLogo />
    </div>
  );
}

function ProviderLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 21 21"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#3C1E1E"
        d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
      />
    </svg>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center px-6 font-anyvid text-sm text-muted-foreground">
      {message}
    </div>
  );
}

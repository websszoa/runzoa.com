"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Marathon } from "@/lib/marathons";
import {
  CalendarCheck2,
  CalendarPlus2,
  Check,
  CircleAlert,
  ClipboardCheck,
  LoaderCircle,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDistances,
  getMarathonDDay,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
  cn,
  type RegistrationStatus,
} from "@/lib/utils";

type EventKind = "race" | "registration";

type StatusFilter = "전체" | RegistrationStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "전체", label: "전체" },
  { value: "접수중", label: "접수중" },
  { value: "접수예정", label: "접수예정" },
];

type CalendarAddProps = {
  marathons: Marathon[];
  hasError: boolean;
  isLoggedIn: boolean;
  naverConnected: boolean;
  googleConnected: boolean;
  kakaoConnected: boolean;
  initialKakaoRaceAddedSlugs: string[];
  initialKakaoRegistrationAddedSlugs: string[];
  initialProvider: "naver" | "google" | "kakao";
  initialGoogleAddedSlugs: string[];
  initialAddedSlugs: string[];
};

type ResultDialog = {
  marathonName: string;
  kind: EventKind;
  alreadyAdded: boolean;
  warning?: string;
};

const EVENT_KIND_LABEL: Record<EventKind, string> = {
  race: "대회 일정",
  registration: "접수 일정",
};

const PAGE_SIZE = 30;
const NAVER_CALENDAR_URL = "https://calendar.naver.com/";

export default function CalendarAdd({
  marathons,
  hasError,
  isLoggedIn,
  naverConnected,
  googleConnected,
  kakaoConnected,
  initialKakaoRaceAddedSlugs,
  initialKakaoRegistrationAddedSlugs,
  initialProvider,
  initialGoogleAddedSlugs,
  initialAddedSlugs,
}: CalendarAddProps) {
  const [provider, setProvider] = useState<string>(initialProvider);
  const providerName = provider === "kakao" ? "카카오톡" : provider === "google" ? "구글" : "네이버";
  const [kakaoRaceAddedSlugs, setKakaoRaceAddedSlugs] = useState(() => new Set(initialKakaoRaceAddedSlugs));
  const [kakaoRegistrationAddedSlugs, setKakaoRegistrationAddedSlugs] = useState(() => new Set(initialKakaoRegistrationAddedSlugs));
  const [kakaoReconnectRequired, setKakaoReconnectRequired] = useState(false);
  const [googleAddedSlugs, setGoogleAddedSlugs] = useState(() => new Set(initialGoogleAddedSlugs));
  const [googleReconnectRequired, setGoogleReconnectRequired] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [addedSlugs, setAddedSlugs] = useState(
    () => new Set(initialAddedSlugs),
  );
  const [resultDialog, setResultDialog] = useState<ResultDialog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconnectRequired, setReconnectRequired] = useState(false);
  const canUseCalendar = isLoggedIn && (provider === "kakao" ? kakaoConnected && !kakaoReconnectRequired : provider === "google" ? googleConnected && !googleReconnectRequired : naverConnected && !reconnectRequired);

  const isAdded = (slug: string, kind: EventKind) => {
    if (provider === "kakao") {
      return kind === "registration" ? kakaoRegistrationAddedSlugs.has(slug) : kakaoRaceAddedSlugs.has(slug);
    }
    return provider === "google" ? googleAddedSlugs.has(slug) : addedSlugs.has(slug);
  };

  const filteredMarathons = useMemo(() => {
    if (statusFilter === "전체") return marathons;
    return marathons.filter((marathon) => getRegistrationStatus(marathon) === statusFilter);
  }, [statusFilter, marathons]);

  const addToCalendar = async (marathon: Marathon, kind: EventKind = "race") => {
    const key = `${marathon.slug}:${kind}`;
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
        if (result.code === "RECONNECT_REQUIRED" || result.code === "AUTH_REQUIRED") {
          if (provider === "kakao") setKakaoReconnectRequired(true);
          else if (provider === "google") setGoogleReconnectRequired(true);
          else setReconnectRequired(true);
        }
        setErrorMessage(result.error ?? "일정을 추가하지 못했습니다.");
        return;
      }

      const addSlug = provider === "kakao"
        ? (kind === "registration" ? setKakaoRegistrationAddedSlugs : setKakaoRaceAddedSlugs)
        : provider === "google" ? setGoogleAddedSlugs : setAddedSlugs;
      addSlug((current) => new Set(current).add(marathon.slug));
      setResultDialog({
        marathonName: marathon.name,
        kind,
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
      <Tabs value={provider} onValueChange={(value) => { if (!pendingKey && !resultDialog) { setProvider(String(value)); setErrorMessage(null); } }} className="gap-0">
        <TabsList className="block h-auto w-full overflow-visible rounded-none border-b bg-background/90 p-0 backdrop-blur group-data-horizontal/tabs:h-auto">
          <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <TabsTrigger
              value="kakao"
              className="h-9 flex-none rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              카카오톡
            </TabsTrigger>
            <TabsTrigger
              value="naver"
              disabled
              className="h-9 flex-none gap-1.5 rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              네이버
              <Badge variant="secondary" className="font-anyvid text-[10px]">준비 중</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="google"
              disabled
              className="h-9 flex-none gap-1.5 rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              구글
              <Badge variant="secondary" className="font-anyvid text-[10px]">준비 중</Badge>
            </TabsTrigger>
          </div>
        </TabsList>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <TabsContent value={provider} className="space-y-6">
            <ConnectionStatus
              isLoggedIn={isLoggedIn}
              provider={provider === "kakao" ? "kakao" : provider === "google" ? "google" : "naver"}
              connected={canUseCalendar}
              reconnectRequired={provider === "kakao" ? kakaoReconnectRequired : provider === "google" ? googleReconnectRequired : reconnectRequired}
            />

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

            <section className="overflow-hidden rounded-2xl border bg-background">
              <div className="border-b p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-paperlogy text-xl font-semibold">
                      마라톤 대회 선택
                    </h2>
                    <p className="mt-1 font-anyvid text-sm text-muted-foreground">
                      앞으로 열리는 대회{" "}
                      {filteredMarathons.length.toLocaleString("ko-KR")}개
                    </p>
                  </div>
                  <div role="group" aria-label="접수 상태 필터" className="flex gap-1.5">
                    {STATUS_FILTERS.map((item) => {
                      const isActive = statusFilter === item.value;
                      return (
                        <Button
                          key={item.value}
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() => {
                            setStatusFilter(item.value);
                            setVisibleCount(PAGE_SIZE);
                          }}
                          className={cn(
                            isActive
                              ? "bg-brand text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {hasError ? (
                <EmptyState message="대회 목록을 불러오지 못했습니다." />
              ) : filteredMarathons.length === 0 ? (
                <EmptyState message="선택한 조건에 맞는 대회가 없습니다." />
              ) : (
                <div className="divide-y overflow-hidden bg-card">
                  {filteredMarathons.slice(0, visibleCount).map((marathon) => {
                    const raceAdded = isAdded(marathon.slug, "race");
                    const registrationAdded = isAdded(marathon.slug, "registration");
                    const racePending = pendingKey === `${marathon.slug}:race`;
                    const registrationPending = pendingKey === `${marathon.slug}:registration`;
                    const registrationStatus = getRegistrationStatus(marathon);
                    const showRegistrationButton = registrationStatus === "접수예정" && Boolean(marathon.registration.startDate);
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
                            {marathon.event.startDate
                              .slice(5)
                              .replace("-", ".")}
                            <span className="relative -top-0.5 font-anyvid text-xs font-normal text-muted-foreground">
                              {weekday}
                            </span>
                          </p>
                          <Badge
                            variant="outline"
                            className="min-w-14 justify-center border-brand/40 font-semibold text-brand tabular-nums"
                          >
                            {getMarathonDDay(marathon.event.startDate)}
                          </Badge>
                          <div className="ml-auto flex gap-1.5 sm:hidden">
                            <Badge
                              variant="outline"
                              className="border-brand/40 text-brand"
                            >
                              {marathon.info.type ?? "러닝"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getRegistrationBadgeClassName(
                                registrationStatus,
                              )}
                            >
                              {getRegistrationLabel(registrationStatus)}
                            </Badge>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                          <div className="mb-1.5 hidden flex-wrap gap-1.5 sm:flex">
                            <Badge
                              variant="outline"
                              className="border-brand/40 text-brand"
                            >
                              {marathon.info.type ?? "러닝"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getRegistrationBadgeClassName(
                                registrationStatus,
                              )}
                            >
                              {getRegistrationLabel(registrationStatus)}
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
                                {[
                                  marathon.location.region,
                                  marathon.location.venue,
                                ]
                                  .filter(Boolean)
                                  .join(" · ") || "장소 확인"}
                              </span>
                            </p>
                            <p className="flex items-center gap-1.5">
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
                              <p className="flex items-center gap-1.5">
                                <Tag
                                  className="size-3.5 shrink-0 text-violet-500"
                                  aria-hidden="true"
                                />
                                {distances.join(" / ")}
                              </p>
                            )}
                            {marathon.info.scale && (
                              <p className="flex items-center gap-1.5">
                                <Users
                                  className="size-3.5 shrink-0 text-amber-500"
                                  aria-hidden="true"
                                />
                                약 {marathon.info.scale.toLocaleString("ko-KR")}
                                명
                              </p>
                            )}
                          </div>
                        </div>

                        {provider === "kakao" ? (
                          <div className="flex w-full shrink-0 flex-col gap-2 border-t pt-3 sm:w-56 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                size="icon-sm"
                                variant="ghost"
                                className={cn(
                                  "size-9 shrink-0 rounded-full",
                                  raceAdded
                                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                                    : "bg-brand/10 text-brand hover:bg-brand/15",
                                )}
                                disabled={!canUseCalendar || raceAdded || Boolean(pendingKey)}
                                onClick={() => void addToCalendar(marathon, "race")}
                                aria-label={
                                  racePending
                                    ? `${marathon.name} 대회 일정 추가 중`
                                    : raceAdded
                                      ? `${marathon.name} 대회 일정 추가 완료`
                                      : `${marathon.name} 대회 일정 ${providerName} 캘린더에 추가`
                                }
                              >
                                {racePending ? (
                                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                                ) : raceAdded ? (
                                  <Check className="size-4" aria-hidden="true" />
                                ) : (
                                  <CalendarPlus2 className="size-4" aria-hidden="true" />
                                )}
                              </Button>
                              <div className="min-w-0 font-anyvid">
                                <p className="text-xs text-muted-foreground">대회 날짜</p>
                                <p className="mt-0.5 text-sm text-foreground">
                                  {formatMarathonDate(marathon.event.startDate)}
                                </p>
                              </div>
                            </div>

                            {showRegistrationButton && (
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="ghost"
                                  className={cn(
                                    "size-9 shrink-0 rounded-full",
                                    registrationAdded
                                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                                      : "bg-brand/10 text-brand hover:bg-brand/15",
                                  )}
                                  disabled={!canUseCalendar || registrationAdded || Boolean(pendingKey)}
                                  onClick={() => void addToCalendar(marathon, "registration")}
                                  aria-label={
                                    registrationPending
                                      ? `${marathon.name} 접수 일정 추가 중`
                                      : registrationAdded
                                        ? `${marathon.name} 접수 일정 추가 완료`
                                        : `${marathon.name} 접수 일정 ${providerName} 캘린더에 추가`
                                  }
                                >
                                  {registrationPending ? (
                                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                                  ) : registrationAdded ? (
                                    <Check className="size-4" aria-hidden="true" />
                                  ) : (
                                    <ClipboardCheck className="size-4" aria-hidden="true" />
                                  )}
                                </Button>
                                <div className="min-w-0 font-anyvid">
                                  <p className="text-xs text-muted-foreground">접수 날짜</p>
                                  <p className="mt-0.5 text-sm text-foreground">
                                    {formatMarathonDate(marathon.registration.startDate)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant={raceAdded ? "outline" : "default"}
                            size="icon-sm"
                            className="group/calendar self-end rounded-full sm:self-center"
                            disabled={
                              !canUseCalendar || raceAdded || Boolean(pendingKey)
                            }
                            onClick={() => void addToCalendar(marathon)}
                            aria-label={
                              racePending
                                ? `${marathon.name} 추가 중`
                                : raceAdded
                                  ? `${marathon.name} 추가 완료`
                                  : `${marathon.name} ${providerName} 캘린더에 추가`
                            }
                            title={raceAdded ? "추가 완료" : "캘린더에 추가"}
                          >
                            {racePending ? (
                              <LoaderCircle
                                className="animate-spin"
                                aria-hidden="true"
                              />
                            ) : raceAdded ? (
                              <Check aria-hidden="true" />
                            ) : (
                              <CalendarPlus2 aria-hidden="true" />
                            )}
                          </Button>
                        )}
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
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }
                  >
                    대회 더 보기
                  </Button>
                </div>
              )}
            </section>
          </TabsContent>

        </div>
      </Tabs>

      <Dialog
        open={Boolean(resultDialog)}
        onOpenChange={(open) => !open && setResultDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CalendarCheck2 className="size-6" aria-hidden="true" />
            </div>
            <DialogTitle className="font-paperlogy text-xl font-semibold">
              {resultDialog?.alreadyAdded
                ? "이미 추가된 일정이에요"
                : "캘린더에 추가했어요!"}
            </DialogTitle>
            <DialogDescription className="break-keep font-anyvid leading-6">
              {resultDialog?.marathonName} {resultDialog ? EVENT_KIND_LABEL[resultDialog.kind] : ""}을 {providerName} 캘린더에 저장했습니다.
              마이페이지에서 추가 내역을 확인할 수 있어요.
              {resultDialog?.warning ? ` ${resultDialog.warning}` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col">
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/mypage#my-calendar" />}
            >
              마이페이지에서 확인
            </Button>
            <Button
              className="w-full"
              variant="outline"
              nativeButton={false}
              render={
                <a href={provider === "kakao" ? "https://calendar.kakao.com/" : provider === "google" ? "https://calendar.google.com/" : NAVER_CALENDAR_URL} target="_blank" rel="noreferrer" />
              }
            >
              {providerName} 캘린더에서 확인
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setResultDialog(null)}
            >
              계속 둘러보기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConnectionStatus({
  provider,
  isLoggedIn,
  connected,
  reconnectRequired,
}: {
  provider: "naver" | "google" | "kakao";
  isLoggedIn: boolean;
  connected: boolean;
  reconnectRequired: boolean;
}) {
  const providerName = provider === "kakao" ? "카카오톡" : provider === "google" ? "구글" : "네이버";
  const toParticle = provider === "kakao" ? "으로" : "로";
  const loginUrl = provider === "kakao" ? "/auth/kakao/start" : provider === "google" ? "/auth/google/start" : "/auth/naver/start?next=/calendar-add";
  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${connected ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
        >
          {connected ? (
            <Check aria-hidden="true" />
          ) : (
            <CircleAlert aria-hidden="true" />
          )}
        </div>
        <div>
          <h2 className="font-paperlogy text-base font-semibold">
            {connected
              ? `${providerName} 로그인 및 캘린더 연결 완료`
              : `${providerName} 연결이 필요해요`}
          </h2>
          <p className="mt-1 break-keep font-anyvid text-sm text-muted-foreground">
            {connected
              ? `${providerName} 캘린더가 연결되어 선택한 대회를 바로 추가할 수 있습니다.`
              : reconnectRequired
                ? `캘린더 권한이 없거나 연결이 만료되었습니다. ${providerName}${toParticle} 다시 연결해 주세요.`
                : `${providerName} 로그인과 캘린더 이용 동의가 필요합니다.`}
          </p>
          {provider !== "naver" && !connected && (
            <p className="mt-1 font-anyvid text-sm text-muted-foreground">선택한 {providerName} 계정으로 런조아에 다시 로그인합니다.</p>
          )}
        </div>
      </div>
      {!connected && (
        <Button
          nativeButton={false}
          render={<a href={loginUrl} />}
          className={provider === "naver" ? "shrink-0 bg-[#03c75a] text-white hover:bg-[#02b351]" : provider === "kakao" ? "shrink-0 gap-2 bg-[#FEE500] text-black hover:bg-[#FEE500]/80" : "shrink-0"}
        >
          {provider === "kakao" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 21 21"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                fill="#3C1E1E"
                d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
              />
            </svg>
          )}
          {providerName}{toParticle} {isLoggedIn ? "다시 로그인" : "로그인"}
        </Button>
      )}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center px-6 font-anyvid text-sm text-muted-foreground">
      {message}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Marathon } from "@/lib/marathons";
import {
  CalendarCheck2,
  CalendarPlus2,
  Check,
  CircleAlert,
  LoaderCircle,
  MapPin,
  Search,
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
import DialogAccountNotice from "@/components/dialog/dialog-account-notice";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDDay,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

type CalendarAddProps = {
  marathons: Marathon[];
  hasError: boolean;
  isLoggedIn: boolean;
  naverConnected: boolean;
  initialAddedSlugs: string[];
};

type ResultDialog = {
  marathonName: string;
  alreadyAdded: boolean;
  warning?: string;
};

const PAGE_SIZE = 30;
const NAVER_CALENDAR_URL = "https://calendar.naver.com/";

export default function CalendarAdd({
  marathons,
  hasError,
  isLoggedIn,
  naverConnected,
  initialAddedSlugs,
}: CalendarAddProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [addedSlugs, setAddedSlugs] = useState(
    () => new Set(initialAddedSlugs),
  );
  const [resultDialog, setResultDialog] = useState<ResultDialog | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconnectRequired, setReconnectRequired] = useState(false);
  const deferredQuery = useDeferredValue(
    query.trim().toLocaleLowerCase("ko-KR"),
  );
  const canUseNaver = isLoggedIn && naverConnected && !reconnectRequired;

  const filteredMarathons = useMemo(() => {
    if (!deferredQuery) return marathons;
    return marathons.filter((marathon) =>
      [
        marathon.name,
        marathon.location.region,
        marathon.location.venue,
        marathon.location.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR")
        .includes(deferredQuery),
    );
  }, [deferredQuery, marathons]);

  const addToNaver = async (marathon: Marathon) => {
    setPendingSlug(marathon.slug);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/calendar/naver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: marathon.slug }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        alreadyAdded?: boolean;
        warning?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok || !result.success) {
        if (result.code === "RECONNECT_REQUIRED") setReconnectRequired(true);
        setErrorMessage(result.error ?? "일정을 추가하지 못했습니다.");
        return;
      }

      setAddedSlugs((current) => new Set(current).add(marathon.slug));
      setResultDialog({
        marathonName: marathon.name,
        alreadyAdded: Boolean(result.alreadyAdded),
        warning: result.warning,
      });
    } catch {
      setErrorMessage("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setPendingSlug(null);
    }
  };

  return (
    <>
      <DialogAccountNotice notice="calendar-test" />

      <Tabs defaultValue="naver" className="gap-0">
        <TabsList className="block h-auto w-full overflow-visible rounded-none border-b bg-background/90 p-0 backdrop-blur group-data-horizontal/tabs:h-auto">
          <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <TabsTrigger
              value="naver"
              className="h-9 flex-none rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              네이버
            </TabsTrigger>
            <TabsTrigger
              value="google"
              className="h-9 flex-none rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              구글
            </TabsTrigger>
            <TabsTrigger
              value="kakao"
              className="h-9 flex-none rounded-md bg-gray-50 px-4 font-anyvid text-sm text-muted-foreground shadow-none after:hidden data-active:bg-brand/10 data-active:font-medium data-active:text-brand group-data-[variant=default]/tabs-list:data-active:shadow-none!"
            >
              카카오톡
            </TabsTrigger>
          </div>
        </TabsList>

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <TabsContent value="naver" className="space-y-6">
            <ConnectionStatus
              isLoggedIn={isLoggedIn}
              connected={canUseNaver}
              reconnectRequired={reconnectRequired}
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
                  <div className="relative w-full sm:w-80">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setVisibleCount(PAGE_SIZE);
                      }}
                      placeholder="대회명, 지역 또는 장소 검색"
                      className="h-10 pl-9"
                    />
                  </div>
                </div>
              </div>

              {hasError ? (
                <EmptyState message="대회 목록을 불러오지 못했습니다." />
              ) : filteredMarathons.length === 0 ? (
                <EmptyState message="검색 조건에 맞는 대회가 없습니다." />
              ) : (
                <div className="divide-y overflow-hidden bg-card">
                  {filteredMarathons.slice(0, visibleCount).map((marathon) => {
                    const added = addedSlugs.has(marathon.slug);
                    const pending = pendingSlug === marathon.slug;
                    const registrationStatus = getRegistrationStatus(marathon);
                    const distances = Object.keys(
                      marathon.registration.price ?? {},
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

                        <Button
                          type="button"
                          variant={added ? "outline" : "default"}
                          size="icon-sm"
                          className="group/calendar self-end rounded-full sm:self-center"
                          disabled={
                            !canUseNaver || added || Boolean(pendingSlug)
                          }
                          onClick={() => void addToNaver(marathon)}
                          aria-label={
                            pending
                              ? `${marathon.name} 추가 중`
                              : added
                                ? `${marathon.name} 추가 완료`
                                : `${marathon.name} 네이버 캘린더에 추가`
                          }
                          title={added ? "추가 완료" : "캘린더에 추가"}
                        >
                          {pending ? (
                            <LoaderCircle
                              className="animate-spin"
                              aria-hidden="true"
                            />
                          ) : added ? (
                            <Check aria-hidden="true" />
                          ) : (
                            <CalendarPlus2 aria-hidden="true" />
                          )}
                        </Button>
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

          <TabsContent value="google">
            <ProviderComingSoon provider="구글 캘린더" />
          </TabsContent>
          <TabsContent value="kakao">
            <ProviderComingSoon provider="카카오 캘린더" />
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
              {resultDialog?.marathonName} 일정을 네이버 캘린더에 저장했습니다.
              마이페이지에서 추가 내역을 확인할 수 있어요.
              {resultDialog?.warning ? ` ${resultDialog.warning}` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResultDialog(null)}
            >
              계속 둘러보기
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a href={NAVER_CALENDAR_URL} target="_blank" rel="noreferrer" />
              }
            >
              네이버 캘린더에서 확인
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/mypage#my-calendar" />}
            >
              마이페이지에서 확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ConnectionStatus({
  isLoggedIn,
  connected,
  reconnectRequired,
}: {
  isLoggedIn: boolean;
  connected: boolean;
  reconnectRequired: boolean;
}) {
  const loginUrl = "/auth/naver/start?next=/calendar-add";
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
            {connected ? "네이버 캘린더 사용 가능" : "네이버 연결이 필요해요"}
          </h2>
          <p className="mt-1 break-keep font-anyvid text-sm text-muted-foreground">
            {connected
              ? "선택한 대회를 네이버 기본 캘린더에 바로 추가할 수 있습니다."
              : reconnectRequired
                ? "캘린더 권한이 없거나 연결이 만료되었습니다. 네이버로 다시 연결해 주세요."
                : isLoggedIn
                  ? "현재 계정에 네이버 캘린더가 연결되지 않았습니다."
                  : "네이버 로그인과 캘린더 이용 동의가 필요합니다."}
          </p>
        </div>
      </div>
      {!connected && (
        <Button
          nativeButton={false}
          render={<Link href={loginUrl} />}
          className="shrink-0 bg-[#03c75a] text-white hover:bg-[#02b351]"
        >
          네이버로 {isLoggedIn ? "다시 연결" : "로그인"}
        </Button>
      )}
    </section>
  );
}

function ProviderComingSoon({ provider }: { provider: string }) {
  return (
    <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-muted/20 px-6 text-center">
      <CalendarPlus2
        className="size-10 text-muted-foreground"
        aria-hidden="true"
      />
      <h2 className="mt-4 font-paperlogy text-xl font-semibold">{provider}</h2>
      <p className="mt-2 font-anyvid text-sm text-muted-foreground">
        연동 기능을 준비하고 있습니다.
      </p>
      <Badge variant="secondary" className="mt-4 font-anyvid">
        준비 중
      </Badge>
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

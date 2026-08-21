"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Marathon } from "@/lib/marathons";
import { LocateFixed, MapPin, Tag, Users, WalletCards } from "lucide-react";
import {
  cn,
  formatMarathonDate,
  formatMarathonPrices,
  getCurrentKoreanDate,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

import MarathonSearchForm from "@/components/marathon/marathon-search-form";

type NaverMap = {
  destroy: () => void;
  panTo: (position: NaverLatLng) => void;
  setZoom: (zoom: number) => void;
};
type NaverLatLng = object;
type NaverMarker = { setMap: (map: NaverMap | null) => void };
type NaverMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => NaverMap;
  LatLng: new (latitude: number, longitude: number) => NaverLatLng;
  Marker: new (options: Record<string, unknown>) => NaverMarker;
  Event: {
    addListener: (target: object, event: string, handler: () => void) => object;
  };
  Position: { TOP_RIGHT: string };
  ZoomControlStyle: { SMALL: string };
};

declare global {
  interface Window {
    naver?: { maps: NaverMapsApi };
    navermap_authFailure?: () => void;
    __runzoaNaverMapsReady?: () => void;
  }
}

const SEOUL_CENTER = { latitude: 36.35, longitude: 127.9 };
const NAVER_MAP_SCRIPT_ID = "naver-maps-sdk";
let naverMapsPromise: Promise<void> | null = null;

function loadNaverMaps(naverMapKey: string) {
  if (window.naver?.maps) return Promise.resolve();
  if (naverMapsPromise) return naverMapsPromise;

  naverMapsPromise = new Promise<void>((resolve, reject) => {
    window.__runzoaNaverMapsReady = () => resolve();

    const existingScript = document.getElementById(
      NAVER_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener(
        "error",
        () => reject(new Error("NAVER Maps SDK load failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(naverMapKey)}&callback=__runzoaNaverMapsReady`;
    script.addEventListener(
      "error",
      () => reject(new Error("NAVER Maps SDK load failed")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return naverMapsPromise;
}

export default function MarathonMap({
  marathons,
  hasError = false,
  naverMapKey,
}: {
  marathons: Marathon[];
  hasError?: boolean;
  naverMapKey: string;
}) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const userMarkerRef = useRef<NaverMarker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const locatedMarathons = useMemo(() => {
    const today = getCurrentKoreanDate();
    return marathons.filter(
      (item) =>
        item.event.startDate >= today &&
        item.location.latitude !== null &&
        item.location.longitude !== null,
    );
  }, [marathons]);
  const regions = useMemo(
    () =>
      [
        ...new Set(
          locatedMarathons.map((item) => item.location.region).filter(Boolean),
        ),
      ].sort() as string[],
    [locatedMarathons],
  );
  const filteredMarathons = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("ko-KR");
    return locatedMarathons.filter((item) => {
      const searchable = [item.name, item.location.region, item.location.venue]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR");
      return (
        (!keyword || searchable.includes(keyword)) &&
        (region === "전체" || item.location.region === region)
      );
    });
  }, [locatedMarathons, query, region]);

  useEffect(() => {
    window.navermap_authFailure = () => setMapError(true);
    return () => {
      delete window.navermap_authFailure;
    };
  }, []);

  useEffect(() => {
    if (!naverMapKey) return;
    let active = true;

    loadNaverMaps(naverMapKey)
      .then(() => {
        if (active) setMapReady(true);
      })
      .catch(() => {
        if (active) setMapError(true);
      });

    return () => {
      active = false;
    };
  }, [naverMapKey]);

  useEffect(() => {
    if (!mapReady || !mapElementRef.current || !window.naver) return;
    const hostElement = mapElementRef.current;
    const mapElement = document.createElement("div");
    mapElement.style.width = "100%";
    mapElement.style.height = "100%";
    hostElement.appendChild(mapElement);

    // React 개발 모드의 첫 번째 검사 마운트에서는 지도를 만들지 않습니다.
    // NAVER Maps가 생성 직후 제거되면서 내부 frame DOM을 중복 정리하는 것을 방지합니다.
    const initializeTimer = window.setTimeout(() => {
      if (!window.naver || !mapElement.isConnected) return;
      const { maps } = window.naver;
      mapRef.current = new maps.Map(mapElement, {
        center: new maps.LatLng(SEOUL_CENTER.latitude, SEOUL_CENTER.longitude),
        zoom: 7,
        minZoom: 6,
        zoomControl: true,
        zoomControlOptions: {
          position: maps.Position.TOP_RIGHT,
          style: maps.ZoomControlStyle.SMALL,
        },
        scaleControl: false,
        mapDataControl: false,
      });
      setMapInitialized(true);
    }, 0);

    return () => {
      window.clearTimeout(initializeTimer);
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      userMarkerRef.current?.setMap(null);
      userMarkerRef.current = null;
      mapRef.current?.destroy();
      mapRef.current = null;
      if (mapElement.parentNode === hostElement) {
        hostElement.removeChild(mapElement);
      }
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapInitialized || !mapRef.current || !window.naver) return;
    const { maps } = window.naver;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    filteredMarathons.forEach((marathon) => {
      const position = new maps.LatLng(
        marathon.location.latitude as number,
        marathon.location.longitude as number,
      );
      const marker = new maps.Marker({
        map: mapRef.current,
        position,
        title: marathon.name,
        zIndex: 100,
        icon: {
          content: `<div aria-hidden="true" style="width:30px;height:30px;border:3px solid white;border-radius:50% 50% 50% 0;background:#f1170f;box-shadow:0 3px 12px rgba(0,0,0,.24);transform:rotate(-45deg);display:grid;place-items:center"><span style="width:8px;height:8px;border-radius:50%;background:white"></span></div>`,
          anchor: { x: 15, y: 30 },
        },
      });
      maps.Event.addListener(marker, "click", () => setSelectedId(marathon.slug));
      markersRef.current.push(marker);
    });
  }, [filteredMarathons, mapInitialized]);

  useEffect(() => {
    if (
      !mapInitialized ||
      !navigator.geolocation ||
      !mapRef.current ||
      !window.naver
    )
      return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        if (!mapRef.current || !window.naver) return;
        const position = new window.naver.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );
        userMarkerRef.current?.setMap(null);
        userMarkerRef.current = new window.naver.maps.Marker({
          map: mapRef.current,
          position,
          title: "내 위치",
          zIndex: 300,
          icon: {
            content:
              '<div class="runzoa-current-location" aria-label="내 위치"><span></span></div>',
            anchor: { x: 18, y: 18 },
          },
        });
        mapRef.current.setZoom(13);
        mapRef.current.panTo(position);
      },
      () => setLocating(false),
      {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  }, [mapInitialized]);

  useEffect(() => {
    if (!selectedId) return;
    document
      .getElementById(`map-race-${selectedId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  const selectMarathon = (marathon: Marathon) => {
    setSelectedId(marathon.slug);
    if (!mapRef.current || !window.naver) return;
    mapRef.current.panTo(
      new window.naver.maps.LatLng(
        marathon.location.latitude as number,
        marathon.location.longitude as number,
      ),
    );
    mapRef.current.setZoom(14);
  };

  const moveToCurrentLocation = () => {
    if (locating || !navigator.geolocation || !mapRef.current || !window.naver)
      return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        if (!mapRef.current || !window.naver) return;
        const position = new window.naver.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );
        userMarkerRef.current?.setMap(null);
        userMarkerRef.current = new window.naver.maps.Marker({
          map: mapRef.current,
          position,
          title: "내 위치",
          zIndex: 300,
          icon: {
            content:
              '<div class="runzoa-current-location" aria-label="내 위치"><span></span></div>',
            anchor: { x: 18, y: 18 },
          },
        });
        mapRef.current.setZoom(13);
        mapRef.current.panTo(position);
      },
      () => setLocating(false),
      {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  };

  return (
    <section aria-label="마라톤 지도">
      <MarathonSearchForm
        value={searchInput}
        onValueChange={setSearchInput}
        onSearch={() => setQuery(searchInput)}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-paperlogy text-2xl font-semibold">대회 지도</h2>
            <p className="mt-1 font-anyvid text-sm text-muted-foreground">
              지도에서 확인할 수 있는 대회{" "}
              <strong className="font-black text-brand">
                {filteredMarathons.length.toLocaleString("ko-KR")}
              </strong>
              개
            </p>
          </div>
        </div>

        <div
          className="mb-5 flex gap-2 overflow-x-auto pb-1"
          aria-label="지역 필터"
        >
          {["전체", ...regions].map((item) => (
            <Button
              key={item}
              variant={region === item ? "default" : "outline"}
              size="sm"
              onClick={() => setRegion(item)}
              className={cn(
                region === item && "bg-brand text-white hover:bg-brand/85",
              )}
            >
              {item}
            </Button>
          ))}
        </div>

        {hasError ? (
          <MapNotice>
            대회 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </MapNotice>
        ) : !naverMapKey ? (
          <MapNotice>
            네이버 지도 API 키를 설정하면 지도가 표시됩니다.
          </MapNotice>
        ) : mapError ? (
          <MapNotice>
            지도를 불러오지 못했습니다. API 키와 Web 서비스 URL 설정을 확인해
            주세요.
          </MapNotice>
        ) : (
          <div className="grid overflow-hidden rounded-2xl border bg-card lg:h-170 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="order-2 max-h-125 overflow-y-auto border-t lg:order-1 lg:max-h-none lg:border-t-0 lg:border-r">
              {filteredMarathons.length ? (
                filteredMarathons.map((marathon) => (
                  <MapRaceItem
                    key={marathon.slug}
                    marathon={marathon}
                    active={selectedId === marathon.slug}
                    onSelect={() => selectMarathon(marathon)}
                  />
                ))
              ) : (
                <div className="px-5 py-16 text-center font-anyvid text-sm text-muted-foreground">
                  검색 조건에 맞는 대회가 없습니다.
                </div>
              )}
            </div>
            <div className="relative order-1 min-h-110 bg-muted lg:order-2 lg:min-h-0">
              {!mapReady && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-muted font-anyvid text-sm text-muted-foreground">
                  지도를 불러오는 중입니다...
                </div>
              )}
              <div
                ref={mapElementRef}
                className="absolute inset-0"
                aria-label="네이버 지도"
              />
              {mapInitialized && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={moveToCurrentLocation}
                  disabled={locating}
                  className="absolute right-2 bottom-8 z-10 rounded-full bg-background shadow-md"
                  aria-label={locating ? "현재 위치 확인 중" : "내 위치로 이동"}
                  title="내 위치"
                >
                  <LocateFixed className={cn(locating && "animate-pulse")} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MapRaceItem({
  marathon,
  active,
  onSelect,
}: {
  marathon: Marathon;
  active: boolean;
  onSelect: () => void;
}) {
  const status = getRegistrationStatus(marathon);
  const distances = Object.keys(marathon.registration.price ?? {});
  return (
    <article
      id={`map-race-${marathon.slug}`}
      className={cn(
        "border-b p-4 transition-colors last:border-b-0",
        active ? "bg-brand/[0.08]" : "hover:bg-muted/40",
      )}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {marathon.info.type ? (
              <Badge variant="outline" className="border-brand/40 text-brand">
                {marathon.info.type}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className={getRegistrationBadgeClassName(status)}
            >
              {getRegistrationLabel(status)}
            </Badge>
          </div>
          <span className="font-anyvid text-xs text-muted-foreground tabular-nums">
            {formatMarathonDate(marathon.event.startDate).replace(
              /^\d{4}년\s*/,
              "",
            )}
          </span>
        </div>
      </button>
      <h3 className="line-clamp-1 font-paperlogy text-xl font-semibold leading-snug mb-2">
        <Link href={`/marathon/${marathon.slug}`} className="hover:text-brand">
          {marathon.name}
        </Link>
      </h3>
      <div className="min-w-0 space-y-1.5 font-anyvid text-sm text-muted-foreground">
        {marathon.location.region || marathon.location.venue ? (
          <p className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-pink-500" />
            <span className="min-w-0 truncate">
              {[marathon.location.region, marathon.location.venue]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </p>
        ) : null}
        {distances.length > 0 ? (
          <p className="flex min-w-0 items-center gap-1.5">
            <Tag className="size-3.5 shrink-0 text-violet-500" />
            <span className="min-w-0 truncate">{distances.join(" / ")}</span>
          </p>
        ) : null}
        {distances.length > 0 ? (
          <p className="flex min-w-0 items-center gap-1.5">
            <WalletCards className="size-3.5 shrink-0 text-emerald-500" />
            <span className="min-w-0 truncate">
              {formatMarathonPrices(marathon.registration.price)}
            </span>
          </p>
        ) : null}
        {marathon.info.scale ? (
          <p className="flex min-w-0 items-center gap-1.5">
            <Users className="size-3.5 shrink-0 text-amber-500" />
            <span className="min-w-0 truncate">
              약 {marathon.info.scale.toLocaleString("ko-KR")}명
            </span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

function MapNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-110 place-items-center rounded-2xl border border-dashed bg-muted/30 px-6 text-center font-anyvid text-sm text-muted-foreground">
      {children}
    </div>
  );
}

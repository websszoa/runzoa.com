"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, ExternalLink, MapPin } from "lucide-react";

type NaverMap = {
  destroy: () => void;
};

type NaverMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => NaverMap;
  LatLng: new (latitude: number, longitude: number) => object;
  Marker: new (options: Record<string, unknown>) => {
    setMap: (map: NaverMap | null) => void;
  };
  Position: { TOP_RIGHT: string };
  ZoomControlStyle: { SMALL: string };
};

type NaverWindow = {
  naver?: { maps: NaverMapsApi };
  navermap_authFailure?: () => void;
  __runzoaNaverMapsReady?: () => void;
};

interface DetailLocationProps {
  name: string;
  venue: string | null;
  naver?: string | null;
  address: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  naverMapKey: string;
}

const NAVER_MAP_SCRIPT_ID = "naver-maps-sdk";
let naverMapsPromise: Promise<void> | null = null;

function loadNaverMaps(naverMapKey: string) {
  const browserWindow = window as unknown as NaverWindow;
  if (browserWindow.naver?.maps) return Promise.resolve();
  if (naverMapsPromise) return naverMapsPromise;

  naverMapsPromise = new Promise<void>((resolve, reject) => {
    browserWindow.__runzoaNaverMapsReady = resolve;

    const existingScript = document.getElementById(
      NAVER_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
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

export default function DetailLocation({
  name,
  venue,
  naver,
  address,
  region,
  country,
  latitude,
  longitude,
  naverMapKey,
}: DetailLocationProps) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const hasCoordinates = latitude !== null && longitude !== null;
  const locationLabel = venue || address || [region, country].filter(Boolean).join(" ");
  const mapSearchQuery =
    naver ||
    address ||
    venue ||
    [region, country].filter(Boolean).join(" ") ||
    name;
  const naverMapUrl = hasCoordinates
    ? `https://map.naver.com/p/search/${encodeURIComponent(mapSearchQuery)}?c=${longitude},${latitude},15,0,0,0,dh`
    : `https://map.naver.com/p/search/${encodeURIComponent(mapSearchQuery)}`;
  const kakaoMapUrl = hasCoordinates
    ? `https://map.kakao.com/link/map/${encodeURIComponent(mapSearchQuery)},${latitude},${longitude}`
    : `https://map.kakao.com/link/search/${encodeURIComponent(mapSearchQuery)}`;

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 2000);
    } catch {
      // 클립보드 사용이 제한된 환경에서는 현재 상태를 유지합니다.
    }
  };

  useEffect(() => {
    if (!naverMapKey || !hasCoordinates || !mapHostRef.current) return;

    const browserWindow = window as unknown as NaverWindow;
    const hostElement = mapHostRef.current;
    let map: NaverMap | null = null;
    let marker: { setMap: (map: NaverMap | null) => void } | null = null;
    let initializeTimer: number | null = null;
    let active = true;

    browserWindow.navermap_authFailure = () => setMapError(true);

    loadNaverMaps(naverMapKey)
      .then(() => {
        if (!active || !browserWindow.naver || !hostElement.isConnected) return;

        initializeTimer = window.setTimeout(() => {
          if (!active || !browserWindow.naver || !hostElement.isConnected) return;

          const mapElement = document.createElement("div");
          mapElement.style.width = "100%";
          mapElement.style.height = "100%";
          hostElement.appendChild(mapElement);

          const { maps } = browserWindow.naver;
          const position = new maps.LatLng(latitude, longitude);
          map = new maps.Map(mapElement, {
            center: position,
            zoom: 15,
            minZoom: 7,
            zoomControl: true,
            zoomControlOptions: {
              position: maps.Position.TOP_RIGHT,
              style: maps.ZoomControlStyle.SMALL,
            },
            scaleControl: false,
            mapDataControl: false,
          });
          marker = new maps.Marker({
            map,
            position,
            title: venue || name,
            icon: {
              content:
                '<div aria-hidden="true" style="width:34px;height:34px;border:3px solid white;border-radius:50% 50% 50% 0;background:#f1170f;box-shadow:0 4px 14px rgba(0,0,0,.24);transform:rotate(-45deg);display:grid;place-items:center"><span style="width:9px;height:9px;border-radius:50%;background:white"></span></div>',
              anchor: { x: 17, y: 34 },
            },
          });
        }, 0);
      })
      .catch(() => {
        if (active) setMapError(true);
      });

    return () => {
      active = false;
      if (initializeTimer !== null) window.clearTimeout(initializeTimer);
      marker?.setMap(null);
      map?.destroy();
      hostElement.replaceChildren();
      delete browserWindow.navermap_authFailure;
    };
  }, [hasCoordinates, latitude, longitude, name, naverMapKey, venue]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <MapPin className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <h2 className="font-paperlogy text-lg font-semibold">대회 위치</h2>
        {locationLabel && (
          <div className="ml-auto flex items-center gap-1.5">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border px-3 font-anyvid text-xs text-muted-foreground transition-colors hover:border-[#03c75a]/40 hover:bg-[#03c75a]/5 hover:text-[#03a94f]"
            >
              <Image
                src="/svg/naver-map.webp"
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-md"
              />
              <span className="hidden sm:inline">네이버 지도</span>
              <ExternalLink className="hidden size-3 sm:block" aria-hidden="true" />
            </a>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border px-3 font-anyvid text-xs text-muted-foreground transition-colors hover:border-[#fee500] hover:bg-[#fee500]/10 hover:text-foreground"
            >
              <Image
                src="/svg/kakao-map.webp"
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-md"
              />
              <span className="hidden sm:inline">카카오맵</span>
              <ExternalLink className="hidden size-3 sm:block" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      <div className="relative h-80 bg-gray-100 sm:h-96">
        {hasCoordinates && naverMapKey && !mapError ? (
          <div ref={mapHostRef} className="absolute inset-0" aria-label={`${name} 위치 지도`} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <span className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
              <MapPin className="size-5 text-brand" aria-hidden="true" />
            </span>
            <p className="font-anyvid text-sm">
              {mapError
                ? "지도를 불러오지 못했습니다. 잠시 후 다시 확인해주세요."
                : !hasCoordinates
                  ? "등록된 위치 좌표가 없습니다."
                  : "지도 API 설정을 확인해주세요."}
            </p>
          </div>
        )}
      </div>

      {address && (
        <div className="flex min-h-16 items-center gap-3 border-t px-4 md:px-6">
          <p className="min-w-0 flex-1 truncate font-anyvid text-sm text-muted-foreground">
            {address}
          </p>
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-3 font-anyvid text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
            aria-label={addressCopied ? "주소가 복사되었습니다" : "주소 복사"}
          >
            {addressCopied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {addressCopied ? "복사됨" : "주소 복사"}
          </button>
        </div>
      )}
    </section>
  );
}

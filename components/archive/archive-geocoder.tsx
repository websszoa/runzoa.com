"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Copy,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type GeocodeResult = {
  query: string;
  source: "address" | "place";
  placeName: string | null;
  address: string;
  roadAddress: string | null;
  jibunAddress: string | null;
  latitude: number;
  longitude: number;
};

type NaverMap = { destroy: () => void };
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

const NAVER_MAP_SCRIPT_ID = "naver-maps-sdk";
let naverMapsPromise: Promise<void> | null = null;

function loadNaverMaps(naverMapKey: string) {
  const browserWindow = window as unknown as NaverWindow;
  if (browserWindow.naver?.maps) return Promise.resolve();
  if (naverMapsPromise) return naverMapsPromise;

  naverMapsPromise = new Promise<void>((resolve, reject) => {
    browserWindow.__runzoaNaverMapsReady = resolve;
    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("지도 로드 실패")),
        {
          once: true,
        },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(naverMapKey)}&callback=__runzoaNaverMapsReady`;
    script.addEventListener(
      "error",
      () => reject(new Error("지도 로드 실패")),
      {
        once: true,
      },
    );
    document.head.appendChild(script);
  });

  return naverMapsPromise;
}

export default function ArchiveGeocoder({
  naverMapKey,
}: {
  naverMapKey: string;
}) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<GeocodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value || loading) return;

    setLoading(true);
    setError("");
    setMapError(false);

    try {
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = (await response.json()) as GeocodeResult & {
        message?: string;
      };

      if (!response.ok)
        throw new Error(data.message || "주소를 검색하지 못했습니다.");
      setResult(data);
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "주소를 검색하지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  useEffect(() => {
    if (!result || !naverMapKey || !mapHostRef.current) return;

    const browserWindow = window as unknown as NaverWindow;
    const host = mapHostRef.current;
    let map: NaverMap | null = null;
    let marker: { setMap: (map: NaverMap | null) => void } | null = null;
    let timer: number | null = null;
    let active = true;

    browserWindow.navermap_authFailure = () => setMapError(true);
    loadNaverMaps(naverMapKey)
      .then(() => {
        if (!active || !browserWindow.naver || !host.isConnected) return;
        timer = window.setTimeout(() => {
          if (!active || !browserWindow.naver || !host.isConnected) return;
          host.replaceChildren();
          const element = document.createElement("div");
          element.style.width = "100%";
          element.style.height = "100%";
          host.appendChild(element);

          const { maps } = browserWindow.naver;
          const position = new maps.LatLng(result.latitude, result.longitude);
          map = new maps.Map(element, {
            center: position,
            zoom: 16,
            minZoom: 7,
            zoomControl: true,
            zoomControlOptions: {
              position: maps.Position.TOP_RIGHT,
              style: maps.ZoomControlStyle.SMALL,
            },
            scaleControl: false,
            mapDataControl: false,
          });
          marker = new maps.Marker({ map, position, title: result.address });
        }, 0);
      })
      .catch(() => setMapError(true));

    return () => {
      active = false;
      if (timer !== null) window.clearTimeout(timer);
      marker?.setMap(null);
      map?.destroy();
      host.replaceChildren();
      delete browserWindow.navermap_authFailure;
    };
  }, [naverMapKey, result]);

  const jsonValue = result
    ? JSON.stringify(
        {
          ...(result.placeName ? { venue: result.placeName } : {}),
          address: result.address,
          latitude: result.latitude,
          longitude: result.longitude,
        },
        null,
        2,
      )
    : "";
  const naverMapUrl = result
    ? `https://map.naver.com/p/search/${encodeURIComponent(result.address)}?c=${result.longitude},${result.latitude},16,0,0,0,dh`
    : "";

  return (
    <section className="border-t bg-muted/25 py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="flex h-14 flex-row items-center gap-2 rounded-none border-b px-5 pb-0! sm:px-6">
              <Search className="size-5 text-brand" aria-hidden="true" />
              <CardTitle className="font-paperlogy text-lg font-semibold">
                주소 검색
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <p className="font-anyvid text-sm leading-6 text-muted-foreground">
                도로명 또는 지번 주소를 입력하면 WGS84 기준 좌표로 변환합니다.
              </p>
              <form onSubmit={submit} className="space-y-3">
                <Label htmlFor="geocode-address">주소</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="geocode-address"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="예: 서울 송파구 올림픽로 424"
                    maxLength={200}
                    className="h-11 font-anyvid"
                  />
                  <Button
                    type="submit"
                    disabled={!query.trim() || loading}
                    className="h-11 sm:px-6"
                  >
                    {loading ? (
                      <LoaderCircle
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Search className="size-4" aria-hidden="true" />
                    )}
                    {loading ? "변환 중" : "좌표 변환"}
                  </Button>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="font-anyvid text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-none">
            <CardHeader className="flex h-14 flex-row items-center gap-2 rounded-none border-b px-5 pb-0! sm:px-6">
              <MapPin className="size-5 text-brand" aria-hidden="true" />
              <CardTitle className="font-paperlogy text-lg font-semibold">
                변환 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {result ? (
                <div className="space-y-1">
                  <ResultRow
                    label="주소"
                    value={result.address}
                    copied={copied === "address"}
                    onCopy={() => copy(result.address, "address")}
                  />
                  {result.placeName && (
                    <ResultRow
                      label="장소"
                      value={result.placeName}
                      copied={copied === "place"}
                      onCopy={() => copy(result.placeName as string, "place")}
                    />
                  )}
                  <ResultRow
                    label="위도"
                    value={String(result.latitude)}
                    copied={copied === "latitude"}
                    onCopy={() => copy(String(result.latitude), "latitude")}
                  />
                  <ResultRow
                    label="경도"
                    value={String(result.longitude)}
                    copied={copied === "longitude"}
                    onCopy={() => copy(String(result.longitude), "longitude")}
                  />
                  {result.jibunAddress &&
                    result.jibunAddress !== result.address && (
                      <ResultRow
                        label="지번"
                        value={result.jibunAddress}
                        copied={copied === "jibun"}
                        onCopy={() =>
                          copy(result.jibunAddress as string, "jibun")
                        }
                      />
                    )}
                  <div className="pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-anyvid text-xs text-muted-foreground">
                        JSON
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copy(jsonValue, "json")}
                      >
                        {copied === "json" ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {copied === "json" ? "복사됨" : "JSON 복사"}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto rounded-xl border bg-muted/50 p-4 font-mono text-xs leading-5">
                      {jsonValue}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-anyvid text-sm">
                    주소를 입력하면 변환 결과가 여기에 표시됩니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-130 gap-0 overflow-hidden py-0 shadow-none lg:col-span-3 lg:min-h-full">
          <CardHeader className="flex h-14 flex-row items-center gap-2 rounded-none border-b px-5 pb-0! sm:px-6">
            <MapPin className="size-5 text-brand" aria-hidden="true" />
            <CardTitle className="font-paperlogy text-lg font-semibold">
              지도 미리보기
            </CardTitle>
            {result && (
              <Button
                nativeButton={false}
                render={
                  <a
                    href={naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
                size="sm"
                className="ml-auto rounded-full"
              >
                네이버 지도
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Button>
            )}
          </CardHeader>
          <div className="relative min-h-113.5 flex-1 bg-muted">
            {result && naverMapKey && !mapError ? (
              <div
                ref={mapHostRef}
                className="absolute inset-0"
                aria-label={`${result.address} 지도`}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
                <span className="flex size-12 items-center justify-center rounded-full border bg-background">
                  <MapPin className="size-5 text-brand" aria-hidden="true" />
                </span>
                <p className="font-anyvid text-sm">
                  {mapError
                    ? "지도를 불러오지 못했습니다. API 설정을 확인해주세요."
                    : result && !naverMapKey
                      ? "지도 API 설정이 필요합니다."
                      : "변환된 위치가 지도에 표시됩니다."}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

function ResultRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0">
      <span className="w-14 shrink-0 font-anyvid text-sm text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-words font-anyvid text-sm font-medium">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onCopy}
        aria-label={`${label} 복사`}
      >
        {copied ? (
          <Check className="size-3.5 text-brand" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

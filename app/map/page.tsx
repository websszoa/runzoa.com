"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

const NAVER_MAP_CLIENT_ID =
  process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ||
  process.env.NAVER_MAP_CLIENT_ID;

export default function MapPage() {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [coords, setCoords] = useState({
    lat: 35.161976,
    lng: 128.032833,
  });
  const [scriptError, setScriptError] = useState<string | null>(null);

  const initializeMap = useCallback(() => {
    if (typeof window === "undefined") return;
    const naverMaps = window.naver?.maps;
    if (!naverMaps) return;
    if (mapRef.current) return;

    const center = new naverMaps.LatLng(coords.lat, coords.lng);

    const map = new naverMaps.Map("map", {
      center,
      zoom: 17,
    });

    const marker = new naverMaps.Marker({
      position: center,
      map,
      draggable: true,
      icon: {
        content: `
          <div style="
            background: #f1170f;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 16px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            RUN
          </div>
        `,
        anchor: new naverMaps.Point(15, 30),
      },
    });

    naverMaps.Event.addListener(marker, "dragend", (event: any) => {
      const lat = event.coord.y;
      const lng = event.coord.x;
      setCoords({ lat, lng });
    });

    mapRef.current = map;
    markerRef.current = marker;
  }, [coords.lat, coords.lng]);

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID) {
      setScriptError("네이버 지도 Client ID가 설정되어 있지 않습니다.");
      return;
    }

    if (typeof window === "undefined") return;

    if (window.naver?.maps) {
      initializeMap();
      return;
    }

    const existingScript = document.getElementById(
      "naver-map-script"
    ) as HTMLScriptElement | null;
    if (existingScript) {
      const handleLoad = () => {
        setScriptError(null);
        initializeMap();
      };
      const handleError = () =>
        setScriptError("네이버 지도 스크립트를 불러오지 못했습니다.");

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.defer = true;
    const handleLoad = () => {
      setScriptError(null);
      initializeMap();
    };
    const handleError = () =>
      setScriptError("네이버 지도 스크립트를 불러오지 못했습니다.");

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [initializeMap]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const naverMaps = window.naver?.maps;
    if (!naverMaps) return;
    if (!mapRef.current || !markerRef.current) return;

    const position = new naverMaps.LatLng(coords.lat, coords.lng);
    mapRef.current.setCenter(position);
    markerRef.current.setPosition(position);
  }, [coords]);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontWeight: 600, marginBottom: "8px" }}>
        🗺️ 지도 마커 좌표 조정
      </h2>
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      />

      {scriptError ? (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "12px",
            color: "#b91c1c",
          }}
        >
          {scriptError}
        </div>
      ) : (
        <div
          style={{
            background: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            fontFamily: "monospace",
          }}
        >
          <p>📍 현재 좌표</p>
          <p>latitude: {coords.lat.toFixed(6)}</p>
          <p>longitude: {coords.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
}

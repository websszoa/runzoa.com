"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  location:
    | {
        text?: string;
        latitude?: number;
        longitude?: number;
      }
    | string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap({ location }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initMap = () => {
    if (!mapRef.current || !window.naver?.maps) return;

    try {
      // 기존 지도가 있으면 제거
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      // 기본값 (서울 중심)
      let lat = 37.5665;
      let lng = 126.978;
      let title = "마라톤 대회 장소";

      // location 객체 체크
      if (typeof location === "object" && location !== null) {
        if (location.latitude && location.longitude) {
          lat = Number(location.latitude);
          lng = Number(location.longitude);
          title = location.text || title;
        }
      } else if (typeof location === "string") {
        title = location;
      }

      const center = new window.naver.maps.LatLng(lat, lng);

      const map = new window.naver.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
      });

      // 지도 인스턴스 저장
      mapInstanceRef.current = map;

      // 커스텀 HTML 마커 생성
      const markerContent = `
        <div style="position: relative; width: 40px; height: 50px;">
          <div style="
            position: absolute;
            width: 34px;
            height: 34px;
            background: white;
            border: 3px solid #f1170f;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img 
              src="/marcur.png" 
              style="
                width: 20px;
                height: 20px;
                transform: rotate(45deg);
                border-radius: 50%;
                object-fit: cover;
              "
              alt="marker"
            />
          </div>
        </div>
      `;

      // HTML 마커 생성
      new window.naver.maps.Marker({
        position: center,
        map,
        title: title,
        icon: {
          content: markerContent,
          anchor: new window.naver.maps.Point(17, 50),
        },
      });
    } catch (error) {
      // 지도 초기화 실패 시 무시
    }
  };

  useEffect(() => {
    if (window.naver?.maps && mapRef.current) {
      initMap();
    } else if (mapLoaded) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, location]);

  return (
    <>
      {/* 네이버 지도 스크립트 로드 */}
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setMapLoaded(true)}
      />
      <div
        ref={mapRef}
        className="w-full h-[340px] rounded border border-gray-100 bg-gray-100"
      />
    </>
  );
}

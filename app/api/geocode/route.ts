import { NextResponse } from "next/server";

const NAVER_GEOCODING_URL =
  "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";

type NaverGeocodeAddress = {
  roadAddress?: string;
  jibunAddress?: string;
  x?: string;
  y?: string;
};

type NaverGeocodeResponse = {
  status?: string;
  errorMessage?: string;
  addresses?: NaverGeocodeAddress[];
};

async function searchAddress(query: string, keyId: string, secret: string) {
  const url = new URL(NAVER_GEOCODING_URL);
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-ncp-apigw-api-key-id": keyId,
      "x-ncp-apigw-api-key": secret,
    },
    cache: "no-store",
  });
  const data = (await response.json()) as NaverGeocodeResponse;

  if (!response.ok || data.status === "ERROR") {
    throw new Error(data.errorMessage || "주소 검색 중 오류가 발생했습니다.");
  }

  const match = data.addresses?.[0];
  const latitude = Number(match?.y);
  const longitude = Number(match?.x);

  if (!match || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    source: "address" as const,
    placeName: null,
    address: match.roadAddress || match.jibunAddress || query,
    roadAddress: match.roadAddress || null,
    jibunAddress: match.jibunAddress || null,
    latitude,
    longitude,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const query =
    typeof body === "object" && body !== null && "query" in body
      ? String(body.query).trim()
      : "";

  if (!query || query.length > 200) {
    return NextResponse.json(
      { message: "200자 이내의 주소를 입력해주세요." },
      { status: 400 },
    );
  }

  const mapKeyId =
    process.env.NAVER_MAP_NCP_KEY_ID ??
    process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID;
  const mapSecret = process.env.NAVER_MAP_CLIENT_SECRET;

  if (!mapKeyId || !mapSecret) {
    return NextResponse.json(
      { message: "네이버 지도 API 설정이 필요합니다." },
      { status: 503 },
    );
  }

  try {
    const addressResult = await searchAddress(query, mapKeyId, mapSecret);
    if (addressResult) {
      return NextResponse.json({ query, ...addressResult });
    }

    return NextResponse.json(
      { message: "검색 결과가 없습니다. 도로명 또는 지번 주소를 입력해주세요." },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "검색 서비스에 연결하지 못했습니다.",
      },
      { status: 502 },
    );
  }
}

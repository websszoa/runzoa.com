import Image from "next/image";
import { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_SLOGAN, APP_DESCRIPTION } from "@/lib/constants";
import MarathonComments from "@/components/marathon/marathon-comments";
import NaverMap from "@/components/marathon/marathon-naver-map";
import MarathonRegistering from "@/components/marathon/marathon-registering";
import MarathonRegisteringRandom from "@/components/marathon/marathon-registering-random";
import {
  calculateDiffDays,
  formatTime,
  formatDateWithDay,
  getRegistrationStatusColor,
  formatRegistrationDateTime,
} from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Castle,
  Clock,
  Cookie,
  CircleDollarSign,
  BellRing,
  Headset,
  AtSign,
  School,
  Instagram,
  MessageCircle,
  FerrisWheel,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 매타데이터 설정
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  // 데이터 가져오기
  const { data } = await supabase
    .from("marathons")
    .select("name, description, images")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return {
      title: `RUNZOA | ${APP_SLOGAN}`,
      description: `${APP_DESCRIPTION}`,
    };
  }

  const mainImage = data.images?.main
    ? `/marathon/${data.images.main}`
    : "/runzoa.png";

  return {
    title: `${data.name} | RUNZOA`,
    description:
      data.description || `${data.name} 마라톤 대회 정보를 확인하세요.`,
    openGraph: {
      title: `${data.name} | RUNZOA`,
      description: data.description || `${data.name} 마라톤 대회`,
      images: [{ url: mainImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} | RUNZOA`,
      description: data.description || `${data.name} 마라톤 대회`,
      images: [mainImage],
    },
  };
}

// 상세 데이터 가져오기
export default async function MarathonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  // 데이터 가져오기
  const { data: marathon, error } = await supabase
    .from("marathons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !marathon) return notFound();

  // 페이지 뷰 증가
  await supabase
    .from("marathons")
    .update({ view_count: marathon.view_count + 1 })
    .eq("slug", slug);

  return (
    <main className="main__container py-2">
      <div className="page__header">
        <div className="left">
          <h2>{marathon.name}</h2>
          <p>
            {marathon.description ||
              `${marathon.name}에 참여하여 마라톤의 열정과 완주의 기쁨을 함께 나누세요!`}
          </p>
        </div>
        <div className="right">
          {calculateDiffDays(marathon.event?.date) > 0 ? (
            <div className="flex flex-col items-center px-4 py-3 rounded-xl border md:border-2 md:border-brand">
              <span className="text-xs text-gray-600 mb-1 font-nanumNeo">
                대회까지
              </span>
              <span className="text-3xl font-black text-brand font-paperlogy">
                D-{calculateDiffDays(marathon.event?.date)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-3 rounded-xl border-2 border-gray-900">
              <span className="text-xs text-gray-600 mb-1">아쉽게도</span>
              <span className="text-3xl font-black text-gray-700">종료</span>
            </div>
          )}
        </div>
      </div>

      <div className="page__contents">
        <div className="page__left">
          {/* 대회 정보 */}
          <div className="page__block">
            <h3>
              <Cookie className="w-5 h-5 text-brand" /> 대회 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-2 md:gap-4">
              {/* 대회 날짜 */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">대회 날짜</p>
                  <p className="font-bold text-gray-900">
                    {formatDateWithDay(marathon.event?.date)}
                  </p>
                  {marathon.event?.start_time && (
                    <p className="text-xs text-gray-600 mt-1">
                      시작 시간: {formatTime(marathon.event.start_time)}
                    </p>
                  )}
                </div>
              </div>

              {/* 장소 */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">장소</p>
                  <p className="font-bold text-gray-900">
                    {marathon.location?.text || "-"}
                  </p>
                </div>
              </div>

              {/* 접수 상태 */}
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">접수 상태</p>
                  <p className="font-bold">
                    <span
                      className={getRegistrationStatusColor(
                        marathon.registration?.status || "접수대기"
                      )}
                    >
                      {marathon.registration?.status || "접수대기"}
                    </span>
                  </p>
                  {marathon.registration?.start && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {formatRegistrationDateTime(marathon.registration.start)}
                      {marathon.registration?.end && (
                        <>
                          {" "}
                          ~{" "}
                          {formatRegistrationDateTime(
                            marathon.registration.end
                          )}
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* 모집 규모 */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Users className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">모집 규모</p>
                  <p className="font-bold text-gray-900">
                    {marathon.scale > 0
                      ? `${marathon.scale.toLocaleString()}명`
                      : "미정"}
                  </p>
                </div>
              </div>

              {/* 추가접수 */}
              {marathon.registration?.restart &&
                marathon.registration.restart.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-brand/5 rounded-lg border border-brand/20">
                    <BellRing className="w-5 h-5 text-brand mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-brand font-semibold mb-1">
                        추가 접수
                      </p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {marathon.registration.restart
                          .split("\n")
                          .map((line: string) => line.trim())
                          .filter((line: string) => line.length > 0)
                          .map((line: string, idx: number) => (
                            <li key={`${line}-${idx}`}>
                              {formatDateWithDay(line)}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* 참가비 */}
          <div className="page__block">
            <h3>
              <CircleDollarSign className="w-5 h-5 text-brand" /> 참가비
            </h3>
            <div className="price">
              {Object.entries(marathon.price).map(([key, value]) => {
                const displayValue =
                  typeof value === "number"
                    ? value.toLocaleString()
                    : String(value);

                return (
                  <div key={key}>
                    <span className="text-gray-700">{key}</span>
                    <span>{displayValue}원</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 기념품 */}
          <div className="page__block">
            <h3>
              <FerrisWheel className="w-5 h-5 text-brand" /> 기념품
            </h3>
            <div>
              <p className="text-sm text-gray-700 rounded py-3 px-4 bg-gray-50 hover:bg-gray-100">
                {Array.isArray(marathon.hosts.souvenir)
                  ? marathon.hosts.souvenir.join(", ")
                  : marathon.hosts.souvenir}
              </p>
              {/* 기념품 이미지 */}
              {marathon.images?.sub &&
                marathon.images.sub.length > 0 &&
                marathon.images.sub[0] !== "" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {marathon.images.sub
                      .filter((img: string) => img && img !== "")
                      .map((image: string, index: number) => {
                        const match = image.match(
                          /^(.*?)(?:\((https?:\/\/[^)]+)\))?$/
                        );
                        const file = match?.[1]?.trim() ?? image;
                        const source = match?.[2]?.trim();

                        if (!file) {
                          return null;
                        }

                        return (
                          <div key={index} className="space-y-1">
                            <div className="relative aspect-square rounded overflow-hidden bg-gray-100">
                              <Image
                                src={`/marathon/${file}`}
                                alt={`${marathon.name} 기념품 ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {source && (
                              <a
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-gray-500 hover:text-gray-600"
                              >
                                출처 :
                                <span className="ml-1 hover:underline underline-offset-4">
                                  이미지 링크
                                </span>
                              </a>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
            </div>
          </div>

          {/* 문의하기 */}
          <div className="page__block">
            <h3>
              <BellRing className="w-5 h-5 text-brand" /> 문의하기
            </h3>
            <div className="contacts">
              {marathon.contacts?.tel && (
                <a href={`tel:${marathon.contacts.tel}`}>
                  <span>{marathon.contacts.tel}</span>
                  <Headset />
                </a>
              )}
              {marathon.contacts?.email && (
                <a href={`mailto:${marathon.contacts.email}`}>
                  <span>{marathon.contacts.email}</span>
                  <AtSign />
                </a>
              )}
              {marathon.contacts?.home && (
                <a
                  href={marathon.contacts.home}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>공식 홈페이지</span>
                  <School />
                </a>
              )}
              {marathon.contacts?.instagram && (
                <a
                  href={`https://www.instagram.com/${marathon.contacts.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>인스타그램</span>
                  <Instagram />
                </a>
              )}
              {marathon.contacts?.kakao && (
                <a
                  href={marathon.contacts.kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>카카오톡 문의</span>
                  <MessageCircle />
                </a>
              )}
            </div>
          </div>

          {/* 지도 보기 */}
          <div className="page__block">
            <h3>
              <MapPin className="w-5 h-5 text-brand" /> 지도 보기
            </h3>
            <div>
              <NaverMap key={marathon.slug} location={marathon.location} />

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(
                      marathon.location?.text || ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/map/navermap.webp"
                      alt="네이버 지도"
                      width={36}
                      height={36}
                      className="inline-block border rounded-[10px]"
                    />
                  </a>
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(
                      marathon.location?.text || ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/map/kakaomap.webp"
                      alt="카카오 지도"
                      width={36}
                      height={36}
                      className="inline-block border border-[#ECD729] rounded-[10px]"
                    />
                  </a>
                  <a
                    href={`tmap://route?goalname=${encodeURIComponent(
                      marathon.location?.text || ""
                    )}&goalx=${marathon.location?.longitude}&goaly=${
                      marathon.location?.latitude
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-only flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/map/tmap.webp"
                      alt="티맵 길찾기"
                      width={36}
                      height={36}
                      className="inline-block border rounded-[10px]"
                    />
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marathon.location?.latitude},${marathon.location?.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/map/googlemaps.webp"
                      alt="구글 맵 길찾기"
                      width={36}
                      height={36}
                      className="inline-block border rounded-[10px]"
                    />
                  </a>
                </div>
                <div className="mobile-only text-xs text-gray-500 mt-2">
                  * 해당 앱이 설치되어 있어야 볼 수 있습니다.
                </div>
              </div>
            </div>
          </div>

          {/* 현재 접수중인 마라톤 */}
          <MarathonRegistering currentMarathonId={marathon.id} />
        </div>

        <div className="page__right">
          {/* 주최 */}
          <div className="page__block">
            <h3>
              <Castle className="w-5 h-5 text-brand" /> 주최
            </h3>
            <div>
              {/* 이미지 */}
              <div className="w-full rounded-sm overflow-hidden mb-4">
                <Image
                  src={`/marathon/${
                    marathon.images?.main && marathon.images.main !== ""
                      ? marathon.images.main
                      : "no-image.jpg"
                  }`}
                  alt={marathon.name}
                  width={600}
                  height={400}
                  loading="eager"
                  className="w-full h-auto"
                />
              </div>
              {/* 주최 */}
              <div className="space-y-3">
                {marathon.hosts.organizer && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">주최</p>
                    <p className="text-sm text-gray-900">
                      {marathon.hosts.organizer}
                    </p>
                  </div>
                )}
                {marathon.hosts.operator && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">주관</p>
                    <p className="text-sm text-muted-foreground">
                      {marathon.hosts.operator}
                    </p>
                  </div>
                )}
                {marathon.hosts.sponsor &&
                  (Array.isArray(marathon.hosts.sponsor)
                    ? marathon.hosts.sponsor.length > 0
                    : marathon.hosts.sponsor !== "") && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">후원</p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(marathon.hosts.sponsor)
                          ? marathon.hosts.sponsor.join(", ")
                          : marathon.hosts.sponsor}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* 신청하기 */}
          {marathon.registration?.site && (
            <div className="mb-8 md:mb-0">
              <a
                href={marathon.registration?.site || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full font-paperlogy text-base bg-brand hover:bg-brand/90 text-white py-6">
                  대회 신청하기
                </Button>
              </a>
            </div>
          )}

          {/* 댓글 */}
          <MarathonComments marathonId={marathon.id} />

          {/* 접수중인 마라톤 */}
          <MarathonRegisteringRandom excludeSlug={marathon.slug} />
        </div>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Marathon } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateDDay,
  getStatusBadgeStyle,
  formatDateWithDay,
  formatPrice,
} from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Eye,
  TrendingUp,
  Medal,
  BadgeDollarSign,
  MessageSquareMore,
} from "lucide-react";

interface MarathonListCardProps {
  marathons: Marathon[];
}

export default function MarathonListCard({ marathons }: MarathonListCardProps) {
  return (
    <div className="marathon-list-card grid grid-cols-1 md:grid-cols-2 gap-4">
      {marathons.length > 0 ? (
        marathons.map((marathon) => {
          // 디데이 계산
          const dDay = calculateDDay(marathon.event.date);

          // 날짜 포맷
          const formattedDate = formatDateWithDay(marathon.event.date);

          // 접수 상태 스타일
          const statusStyle = getStatusBadgeStyle(marathon.registration.status);

          // 디데이 스타일
          const dDayStyle =
            dDay === "종료"
              ? "text-gray-500 border-gray-400 bg-transparent"
              : "text-brand border-brand bg-transparent";

          return (
            <Card
              key={marathon.slug}
              className="hover:shadow-lg transition-shadow py-4 md:py-6"
            >
              <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-xl font-paperlogy text-gray-900 truncate text-left font-extrabold">
                  {marathon.name}
                </CardTitle>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <Badge className={statusStyle}>
                      {marathon.registration.status}
                    </Badge>
                    <Badge className={dDayStyle}>{dDay}</Badge>
                  </div>
                  <div className="flex gap-1">
                    {(marathon.view_count || 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="font-nanumNeo text-xs text-gray-500 font-medium"
                      >
                        <Eye className="w-3 h-3" />
                        {marathon.view_count?.toLocaleString()}
                      </Badge>
                    )}
                    {(marathon.comment_count || 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="font-nanumNeo text-xs text-gray-500 font-medium"
                      >
                        <MessageSquareMore className="w-3 h-3" />
                        {marathon.comment_count?.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                <div className="flex gap-3">
                  {/* 이미지 */}
                  <div className="w-[110px] h-[137px] bg-gray-200 rounded shrink-0 overflow-hidden">
                    <Image
                      src={
                        marathon.images.main
                          ? `/marathon/${marathon.images.main}`
                          : "/marathon/no.png"
                      }
                      width={160}
                      height={206}
                      alt={marathon.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* 날짜 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="truncate">{formattedDate}</span>
                    </div>

                    {/* 장소 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{marathon.location.text}</span>
                    </div>

                    {/* 거리 */}
                    {marathon.price &&
                      Object.keys(marathon.price).length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {Object.keys(marathon.price).join(", ")}
                          </span>
                        </div>
                      )}

                    {/* 규모 */}
                    {marathon.scale && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {marathon.scale.toLocaleString()}명
                        </span>
                      </div>
                    )}

                    {/* 가격 */}
                    {marathon.price &&
                      Object.keys(marathon.price).length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BadgeDollarSign className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {formatPrice(marathon.price)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* 설명 */}
                {marathon.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-nanumNeo text-left">
                    {marathon.description}
                  </p>
                )}

                {/* 하이라이트 */}
                {marathon.highlights && marathon.highlights.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>주요 특징</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {marathon.highlights.map((highlight: string) => (
                        <Badge
                          key={highlight}
                          variant="outline"
                          className="text-xs"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/marathon/${marathon.slug}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-brand hover:bg-brand/90"
                    >
                      <TrendingUp className="h-4 w-4" />
                      상세정보
                    </Button>
                  </Link>
                  {/* <Button size="sm" variant="outline">
                    <Award className="h-4 w-4" />
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="col-span-full text-center py-12 pt-16">
          <Medal className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 font-nanumNeo">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

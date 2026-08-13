import { TriangleAlert } from "lucide-react";

const NOTICES = [
  "대회 상세 일정, 코스, 참가비, 접수 일정 등은 주최 측 사정에 따라 변경될 수 있으니 반드시 공식 홈페이지에서 최종 정보를 확인하세요.",
  "본 사이트(RunZoa)는 마라톤 정보를 모아 제공하는 안내/중개 플랫폼으로, 대회 운영 및 접수 과정에 직접 관여하지 않습니다.",
  "참가 신청, 결제, 환불, 참가권 양도 등은 주최 측 규정에 따라 진행되며, 관련 문의는 공식 채널을 통해 확인해 주세요.",
  "대회 당일 교통 통제, 주차, 집결지 안내는 지역 상황에 따라 달라질 수 있으니 출발 전 공지사항을 확인하는 것을 권장합니다.",
  "안전한 참가를 위해 개인 건강 상태를 점검하고, 필요 시 의료진 상담 후 참가를 결정해 주세요.",
  "기상 상황에 따라 대회 운영 방식이 변경될 수 있으므로, 방한/방수 등 대비 장비를 준비하는 것을 권장합니다.",
  "현장에서는 안전요원의 안내 및 대회 규정을 준수해 주세요. 규정 시간 이후 출발 또는 코스 이탈 시 기록 측정이 제한될 수 있습니다.",
  "개인 물품 분실 및 부상 등에 대비하여 기본 안전 수칙을 준수하고, 귀중품은 최소화하는 것을 권장합니다.",
] as const;

export default function DetailNotice() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <TriangleAlert
          className="size-5 shrink-0 text-amber-500"
          aria-hidden="true"
        />
        <h2 className="font-paperlogy text-lg font-semibold">주의사항</h2>
      </div>

      <div className="p-4 md:p-6">
        <ul
          className="space-y-1 font-anyvid text-sm text-muted-foreground"
          aria-label="주의사항 목록"
        >
          {NOTICES.map((notice, i) => (
            <li key={i} className="flex gap-2">
              <span
                className="mt-0.5 shrink-0 text-amber-400"
                aria-hidden="true"
              >
                •
              </span>
              <span className="break-keep leading-relaxed">{notice}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

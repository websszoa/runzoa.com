// 사이트 및 소셜 채널 통계 보고서 데이터
export type AnalyticsMetric = {
  label: string;
  value: string;
  note: string;
};

export type AnalyticsReport = {
  date: string;
  label: string;
  period: string;
  summary: string;
  metrics: AnalyticsMetric[];
  channels: { label: string; value: number; displayValue: string }[];
  popularContent: {
    title: string;
    channel: "웹사이트" | "Instagram";
    value: string;
    note: string;
  }[];
  observations: { title: string; description: string }[];
  issues: { title: string; description: string }[];
  improvements: { title: string; description: string }[];
  attachments: {
    src: string;
    alt: string;
    title: string;
    width: number;
    height: number;
  }[];
};

export const ANALYTICS_REPORTS: AnalyticsReport[] = [
  {
    date: "2026-08-21",
    label: "2026년 8월 21일",
    period: "웹 2026.07.24~08.20 · Instagram 계정 인사이트",
    summary:
      "검색과 Instagram을 통해 신규 사용자가 빠르게 유입되고 있습니다. 다음 단계는 특정 채널 의존도를 낮추고, 소셜 도달을 사이트 방문과 재방문으로 연결하는 것입니다.",
    metrics: [
      { label: "웹 활성 사용자", value: "4.4천", note: "최근 28일" },
      { label: "평균 참여 시간", value: "51초", note: "활성 사용자당" },
      { label: "Instagram 조회", value: "105.6만", note: "비팔로워 70.3%" },
      { label: "Instagram 도달", value: "24.5만", note: "발견성 강세" },
      { label: "Instagram 반응", value: "3.4만", note: "참여 계정 1.3만" },
      { label: "외부 링크 클릭", value: "1,552", note: "프로필 방문 대비 16.1%" },
    ],
    channels: [
      { label: "네이버 모바일 검색", value: 2300, displayValue: "2.3천" },
      { label: "네이버 자연 검색", value: 846, displayValue: "846" },
      { label: "Instagram", value: 822, displayValue: "822" },
      { label: "직접 방문", value: 326, displayValue: "326" },
      { label: "Google 자연 검색", value: 50, displayValue: "50" },
      { label: "Bing 자연 검색", value: 24, displayValue: "24" },
      { label: "ChatGPT", value: 16, displayValue: "16" },
    ],
    popularContent: [
      {
        title: "런조아 홈",
        channel: "웹사이트",
        value: "조회 4.3천",
        note: "활성 사용자 1.5천 · 이탈률 19.2%",
      },
      {
        title: "2026 블루로드 마라톤 콘텐츠",
        channel: "Instagram",
        value: "조회 9.3만",
        note: "조회수 1위",
      },
      {
        title: "2026 울산마라톤 콘텐츠",
        channel: "Instagram",
        value: "조회 6.4만",
        note: "반응 1,509",
      },
      {
        title: "제26회 순천 남승룡마라톤대회 콘텐츠",
        channel: "Instagram",
        value: "조회 5.4만",
        note: "반응 1,820",
      },
      {
        title: "SAVERACE 2026 콘텐츠",
        channel: "Instagram",
        value: "조회 5만",
        note: "반응 1,304",
      },
      {
        title: "2026 인사이드런 S",
        channel: "웹사이트",
        value: "조회 239",
        note: "이탈률 31.4%",
      },
    ],
    observations: [
      {
        title: "신규 발견이 성장을 주도",
        description:
          "웹 신규 사용자 수가 활성 사용자 수와 같은 4.4천명이고, Instagram 조회의 70.3%가 비팔로워에서 발생했습니다.",
      },
      {
        title: "네이버와 Instagram이 핵심 유입원",
        description:
          "네이버 검색 유입은 확인 가능한 웹 유입의 약 72%이며 Instagram은 세 번째로 큰 유입원입니다.",
      },
      {
        title: "대회 단위 콘텐츠의 반응이 강함",
        description:
          "특정 대회 포스터형 콘텐츠가 조회와 반응 상위권을 차지해 대회명·날짜 중심 포맷의 효율이 확인됩니다.",
      },
      {
        title: "심야·저녁 팔로워 활동이 높음",
        description:
          "월요일 기준 0시·3시와 18시·21시 활동량이 높아 예약 발행 시간 테스트 가치가 있습니다.",
      },
    ],
    issues: [
      {
        title: "재방문 지표 확인이 어려움",
        description:
          "활성 사용자와 신규 사용자 수가 동일합니다. 실제 신규 비중이 매우 높거나 사용자 식별·리포트 설정을 점검해야 할 수 있습니다.",
      },
      {
        title: "검색 채널 편중",
        description:
          "네이버 검색 의존도가 높아 검색 노출 변화에 트래픽이 민감할 수 있습니다. Google·직접 방문·뉴스레터 비중이 낮습니다.",
      },
      {
        title: "소셜 도달 대비 웹 전환 여지",
        description:
          "Instagram 도달 24.5만에 비해 웹 활성 사용자는 4.4천입니다. 프로필과 게시물에서 대회 상세로 이어지는 동선을 더 명확히 해야 합니다.",
      },
      {
        title: "스토리 활용 부족",
        description:
          "조회의 98.8%, 반응의 99.6%가 게시물에 집중되어 스토리를 통한 재방문 유도와 긴급 접수 알림이 부족합니다.",
      },
    ],
    improvements: [
      {
        title: "대회별 캠페인 링크 적용",
        description:
          "Instagram 프로필·스토리·게시물 링크에 UTM을 적용해 어떤 대회 콘텐츠가 사이트 방문과 접수 사이트 이동을 만드는지 측정합니다.",
      },
      {
        title: "재방문 장치 강화",
        description:
          "즐겨찾기, 접수 알림, 뉴스레터 CTA를 상세 페이지 상단과 인기 콘텐츠 하단에 배치하고 재방문 사용자 비율을 핵심 지표로 관리합니다.",
      },
      {
        title: "상위 콘텐츠 포맷 반복 실험",
        description:
          "대회명·개최일·지역이 선명한 포스터형 콘텐츠를 유지하고, 발행 시간을 0시·3시·18시·21시로 나누어 성과를 비교합니다.",
      },
      {
        title: "검색 포트폴리오 확장",
        description:
          "대회별 구조화 데이터와 지역·거리별 가이드 콘텐츠를 보강해 Google 검색과 AI 검색 유입을 점진적으로 확대합니다.",
      },
      {
        title: "측정 기준 정리",
        description:
          "GA4 신규·재방문 사용자 정의와 주요 이벤트를 검토하고, 대회 상세 조회·외부 접수 클릭·즐겨찾기·구독을 전환 이벤트로 분리합니다.",
      },
    ],
    attachments: [
      {
        src: "/analytics/2026-08-21-analytics.png",
        alt: "2026년 8월 21일 Google Analytics 보고서",
        title: "Google Analytics 보고서",
        width: 2274,
        height: 2238,
      },
      {
        src: "/analytics/2026-08-21-ins1.png",
        alt: "2026년 8월 21일 Instagram 조회 인사이트",
        title: "Instagram 조회 인사이트",
        width: 1450,
        height: 1370,
      },
      {
        src: "/analytics/2026-08-21-ins2.png",
        alt: "2026년 8월 21일 Instagram 반응과 팔로워 인사이트",
        title: "Instagram 반응·팔로워 인사이트",
        width: 1454,
        height: 2322,
      },
    ],
  },
];

export function getAnalyticsReport(date?: string): AnalyticsReport {
  return (
    ANALYTICS_REPORTS.find((report) => report.date === date) ??
    ANALYTICS_REPORTS[0]
  );
}

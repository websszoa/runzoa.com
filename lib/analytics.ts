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
  funnel: { label: string; value: string; width: string }[];
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
    date: "2026-11-10",
    label: "2026년 11월 10일",
    period: "웹 2026.10.13~11.09 · Instagram 계정 인사이트",
    summary:
      "웹과 Instagram 핵심 지표가 지난 리포트 대비 전반적으로 2배 가까이 성장했고, 유입 채널도 네이버 외 검색·AI 어시스턴트·직접 방문까지 고르게 늘었습니다. 다만 Instagram 성장은 '알몸마라톤' 콘텐츠 하나의 바이럴 효과에 크게 기대고 있어, 다음 단계는 이 성장을 재현 가능한 패턴으로 만드는 것입니다.",
    metrics: [
      { label: "웹 활성 사용자", value: "8.3천", note: "최근 28일 · +89%" },
      { label: "평균 참여 시간", value: "1분 32초", note: "활성 사용자당 · +80%" },
      { label: "Instagram 조회", value: "210.2만", note: "비팔로워 75.3%" },
      { label: "Instagram 도달", value: "54.4만", note: "조회한 사람 기준" },
      { label: "Instagram 반응", value: "18.3만", note: "참여 계정 3.4만" },
      { label: "외부 링크 클릭", value: "2,657", note: "프로필 방문 대비 16.6%" },
    ],
    channels: [
      { label: "네이버 모바일 검색", value: 4900, displayValue: "4.9천" },
      { label: "Instagram", value: 2200, displayValue: "2.2천" },
      { label: "네이버 자연 검색", value: 1600, displayValue: "1.6천" },
      { label: "직접 방문", value: 1500, displayValue: "1.5천" },
      { label: "Google 자연 검색", value: 292, displayValue: "292" },
      { label: "ChatGPT", value: 132, displayValue: "132" },
      { label: "Bing 자연 검색", value: 102, displayValue: "102" },
    ],
    funnel: [
      { label: "Instagram 조회", value: "210.2만", width: "100%" },
      { label: "Instagram 도달", value: "54.4만", width: "70%" },
      { label: "Instagram 반응", value: "18.3만", width: "42%" },
      { label: "프로필 방문", value: "1.6만", width: "26%" },
      { label: "외부 링크 클릭", value: "2,657", width: "15%" },
    ],
    popularContent: [
      {
        title: "마라톤 리스트 | 런조아",
        channel: "웹사이트",
        value: "조회 1만",
        note: "활성 사용자 2.6천 · 이탈률 7.6%",
      },
      {
        title: "런조아 | 전국 마라톤 대회 정보",
        channel: "웹사이트",
        value: "조회 5.7천",
        note: "활성 사용자 2.8천 · 이탈률 13.2%",
      },
      {
        title: "제19회 전국 새해 알몸마라톤대회 콘텐츠",
        channel: "Instagram",
        value: "조회 57.2만",
        note: "반응 7.2만 · 조회수 1위",
      },
      {
        title: "제31회 오키나와 마라톤 콘텐츠",
        channel: "Instagram",
        value: "조회 11.3만",
        note: "반응 3,246",
      },
      {
        title: "2027 제주 10KM 마라톤대회 콘텐츠",
        channel: "Instagram",
        value: "조회 10.2만",
        note: "반응 2,482",
      },
      {
        title: "런조아 링크 모음 | 런조아",
        channel: "웹사이트",
        value: "조회 2.2천",
        note: "활성 사용자 1.4천 · 이탈률 4.4%",
      },
    ],
    observations: [
      {
        title: "웹 핵심 지표가 전반적으로 2배 가까이 성장",
        description:
          "활성 사용자가 4.4천에서 8.3천으로, 평균 참여 시간이 51초에서 1분 32초로 늘어 트래픽 양과 체류 품질이 함께 좋아졌습니다.",
      },
      {
        title: "특정 채널 의존도가 완화되는 중",
        description:
          "네이버 모바일 검색뿐 아니라 직접 방문(4.6배), Google 자연 검색(5.8배), ChatGPT(8.3배) 세션이 모두 큰 폭으로 늘어 유입 채널이 고르게 분산되고 있습니다.",
      },
      {
        title: "신규 사용자가 유입을 계속 주도",
        description:
          "'신규 사용자 및 재방문자 비교' 추이에서 신규 사용자 라인이 재방문자 라인을 꾸준히 2~4배 웃돌며 성장을 견인하고 있습니다.",
      },
      {
        title: "단일 콘텐츠의 강한 바이럴 효과",
        description:
          "'제19회 전국 새해 알몸마라톤대회' 콘텐츠가 조회 57.2만·반응 7.2만으로 2위 콘텐츠보다 5배 이상 높아, Instagram 전체 성장의 상당 부분을 혼자 견인했습니다.",
      },
    ],
    issues: [
      {
        title: "Instagram 성장이 콘텐츠 하나에 편중",
        description:
          "반응 상위 1위(7.2만)가 2위(3,246)보다 20배 이상 높습니다. 이 콘텐츠를 제외하면 실제 반응 수준은 지난 리포트와 비슷해 성장의 재현 가능성을 점검해야 합니다.",
      },
      {
        title: "재방문자 비중이 여전히 낮음",
        description:
          "신규 사용자 수가 활성 사용자 수와 거의 같고(8.1천/8.3천), 재방문자 추이도 낮은 수준에서 횡보하고 있어 재방문 유도 장치의 효과가 아직 크지 않습니다.",
      },
      {
        title: "네이버 검색 비중이 여전히 큼",
        description:
          "네이버 모바일·자연 검색 세션 합계가 약 6.5천으로 전체 세션의 절반 이상을 차지해, 검색 노출 변화에 트래픽이 민감한 구조가 이어지고 있습니다.",
      },
      {
        title: "릴스 활용이 0%로 그대로 유지",
        description:
          "콘텐츠 유형 기준 조회·상호작용 모두 릴스 비중이 0%입니다. 지난 리포트에서 지적된 문제가 이번에도 그대로 남아 있습니다.",
      },
    ],
    improvements: [
      {
        title: "바이럴 콘텐츠 후속 전환 설계",
        description:
          "'알몸마라톤' 콘텐츠로 유입된 비팔로워·신규 방문자를 팔로우·웹 방문·뉴스레터 구독으로 연결하는 스토리·댓글 고정 CTA를 추가합니다.",
      },
      {
        title: "릴스 포맷 첫 테스트",
        description:
          "이번 기간 상위 콘텐츠(알몸마라톤, 오키나와 마라톤 등)를 짧은 영상으로 재가공해 릴스를 처음으로 발행하고 조회·반응을 게시물과 비교합니다.",
      },
      {
        title: "성장 채널별 투자 비중 조정",
        description:
          "ChatGPT·Google 유입이 각각 8.3배, 5.8배 늘어난 만큼 AI 검색 노출과 SEO 콘텐츠에 투자를 늘려 네이버 의존도를 추가로 낮춥니다.",
      },
      {
        title: "재방문 장치 효과 재점검",
        description:
          "지난 리포트에서 제안한 즐겨찾기·접수 알림·뉴스레터 CTA의 실제 클릭·재방문 전환율을 확인하고, 효과가 작다면 배치 위치와 문구를 바꿔 다시 테스트합니다.",
      },
      {
        title: "콘텐츠별 전환 추적 강화",
        description:
          "대회별 콘텐츠 링크에 UTM을 적용해 어떤 게시물이 실제 대회 상세 조회·접수 사이트 이동으로 이어지는지 단일 콘텐츠 의존 없이도 파악할 수 있게 합니다.",
      },
    ],
    attachments: [
      {
        src: "/analytics/2026-11-10-analytics.png",
        alt: "2026년 11월 10일 Google Analytics 보고서",
        title: "Google Analytics 보고서",
        width: 2972,
        height: 2208,
      },
      {
        src: "/analytics/2026-11-10-ins1.png",
        alt: "2026년 11월 10일 Instagram 조회 인사이트",
        title: "Instagram 조회 인사이트",
        width: 1462,
        height: 1452,
      },
      {
        src: "/analytics/2026-11-10-ins2.png",
        alt: "2026년 11월 10일 Instagram 반응 인사이트",
        title: "Instagram 반응 인사이트",
        width: 1454,
        height: 1186,
      },
      {
        src: "/analytics/2026-11-10-ins3.png",
        alt: "2026년 11월 10일 Instagram 프로필·팔로워 인사이트",
        title: "Instagram 프로필·팔로워 인사이트",
        width: 1444,
        height: 1238,
      },
    ],
  },
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
    funnel: [
      { label: "Instagram 조회", value: "105.6만", width: "100%" },
      { label: "Instagram 도달", value: "24.5만", width: "72%" },
      { label: "Instagram 반응", value: "3.4만", width: "45%" },
      { label: "프로필 방문", value: "9,645", width: "28%" },
      { label: "외부 링크 클릭", value: "1,552", width: "16%" },
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

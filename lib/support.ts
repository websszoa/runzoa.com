export type SupportType =
  | "registration"
  | "inquiry"
  | "complaint"
  | "correction";

export type SupportItem = {
  type: SupportType;
  label: string;
  description: string;
  formTitle: string;
  formDescription: string;
  guideTitle: string;
  guideDescription: string;
  contentLabel: string;
  contentPlaceholder: string;
  subjectPlaceholder: string;
  guideItems: readonly string[];
};

export const SUPPORT_ITEMS: readonly SupportItem[] = [
  {
    type: "registration",
    label: "등록문의",
    description:
      "런조아에 아직 등록되지 않은 마라톤과 러닝 대회를 알려주시면 확인 후 서비스에 반영합니다.",
    formTitle: "대회 등록 요청",
    formDescription: "공식 안내 페이지와 대회 정보를 함께 보내주세요.",
    guideTitle: "등록문의 작성 안내",
    guideDescription:
      "대회 등록은 무료예요. 부담 없이 정보를 보내주시면 내용을 꼼꼼히 확인한 뒤 런조아에 등록해 드릴게요. 등록된 대회는 런조아 인스타그램에도 함께 소개됩니다.",
    contentLabel: "대회 정보",
    contentPlaceholder:
      "대회명, 개최일, 장소, 종목, 접수 기간 등 확인 가능한 정보를 적어주세요. 공식 홈페이지 주소가 있다면 함께 남겨주세요.",
    subjectPlaceholder: "예: 2026 런조아 마라톤 등록 요청",
    guideItems: [
      "대회명과 개최일을 정확히 적어주세요.",
      "공식 홈페이지 또는 모집 공고 주소를 남겨주세요.",
      "확인 가능한 정보부터 순차적으로 반영합니다.",
      "참가 규모가 3,000명 이상인 대회부터 등록할 수 있습니다.",
    ],
  },
  {
    type: "inquiry",
    label: "문의사항",
    description:
      "런조아 서비스 이용 방법, 제휴 및 기타 궁금한 내용을 보내주시면 확인 후 답변드리겠습니다.",
    formTitle: "문의사항 요청",
    formDescription:
      "문의 내용을 구체적으로 작성하면 더 정확하게 안내할 수 있어요.",
    guideTitle: "문의사항 작성 안내",
    guideDescription:
      "아래 내용을 참고해 작성해 주세요. 접수된 문의는 내용을 확인한 뒤 입력한 이메일로 답변드립니다.",
    contentLabel: "문의 내용",
    contentPlaceholder: "궁금한 점이나 요청할 내용을 자세히 적어주세요.",
    subjectPlaceholder: "예: 캘린더 이용 방법 문의",
    guideItems: [
      "문의 내용을 자세히 작성해 주시면 빠르게 확인해 드립니다.",
      "관련된 페이지나 참고 자료가 있다면 함께 남겨주세요.",
      "개인정보나 민감한 정보는 입력하지 마세요.",
    ],
  },
  {
    type: "complaint",
    label: "불편신고",
    description:
      "페이지 오류, 링크 문제 또는 이용하기 어려운 부분을 알려주시면 더 나은 서비스로 개선하겠습니다.",
    formTitle: "불편신고 요청",
    formDescription: "문제가 발생한 화면과 상황을 가능한 자세히 알려주세요.",
    guideTitle: "불편신고 작성 안내",
    guideDescription:
      "아래 내용을 참고해 작성해 주세요. 접수된 내용을 확인하고 더 편리한 서비스가 되도록 개선하겠습니다.",
    contentLabel: "불편 내용",
    contentPlaceholder:
      "발생한 문제, 이용한 기기와 브라우저, 재현 방법 등을 적어주세요.",
    subjectPlaceholder: "예: 마라톤 캘린더 표시 오류",
    guideItems: [
      "문제가 발생한 페이지 주소를 남겨주세요.",
      "발생 시점과 반복 여부를 알려주세요.",
      "보안 문제가 의심되면 개인정보를 제외하고 즉시 신고해 주세요.",
    ],
  },
  {
    type: "correction",
    label: "수정요청",
    description:
      "일정, 장소, 접수 상태 등 실제 내용과 다른 정보를 보내주시면 공식 자료를 확인해 수정합니다.",
    formTitle: "정보 수정 요청",
    formDescription:
      "수정할 정보와 이를 확인할 수 있는 공식 출처를 보내주세요.",
    guideTitle: "수정요청 작성 안내",
    guideDescription:
      "아래 내용을 참고해 작성해 주세요. 공식 자료를 확인한 뒤 정확한 대회 정보로 수정하겠습니다.",
    contentLabel: "수정 요청 내용",
    contentPlaceholder: "현재 표시된 내용과 올바른 내용을 구분해 적어주세요.",
    subjectPlaceholder: "예: 대회 개최일 수정 요청",
    guideItems: [
      "수정이 필요한 대회명을 정확히 적어주세요.",
      "변경 내용을 확인할 수 있는 공식 주소를 남겨주세요.",
      "주최 측 공지를 우선하여 검토하고 반영합니다.",
    ],
  },
];

export function getSupportItem(type?: string) {
  return SUPPORT_ITEMS.find((item) => item.type === type) ?? SUPPORT_ITEMS[0];
}

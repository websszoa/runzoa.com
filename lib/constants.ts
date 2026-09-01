export const APP_NAME = "런조아";
export const APP_ENG_NAME = "Runzoa";
export const APP_SLOGAN = "마라톤 여정을 위한 완벽한 가이드";
export const APP_COPYRIGHT = "© 2026 webstoryboy. All rights reserved.";

export const APP_SITE_URL = "https://runzoa.com";
export const GOOGLE_ANALYTICS_ID = "G-SJT6MVPQJ";
export const APP_EMAIL = "webstoryboy@naver.com";
export const APP_INSTAGRAM_URL = "https://www.instagram.com/runzoa_official";
export const APP_THREADS_URL = "https://www.threads.com/@runzoa_official";
export const APP_GITHUB_URL = "https://github.com/webstoryboy";
export const APP_YOUTUBE_URL = "https://www.youtube.com/@webstoryboy";

export const APP_RUNZOA_URL = "https://runzoa.com";
export const APP_EVENTZOA_URL = "https://eventzoa.com";
export const APP_KCALZOA_URL = "https://kcalzoa.com";

export const APP_DESCRIPTION =
  "국내외 마라톤 대회 정보, 코스 정보, 참가 신청, 마라톤 팁과 가이드를 제공하는 종합 마라톤 정보 사이트입니다.";
export const APP_SHORT_DESCRIPTION =
  "필터를 활용해 전국 마라톤 빠르게 찾아보세요.";
export const APP_KEYWORDS =
  "런조아, runzoa, 마라톤 일정, 전국 마라톤 대회, 마라톤 접수, 하프마라톤 일정, 러닝 대회, 2026 마라톤 일정, 트레일런 대회, 해외 마라톤, 마라톤 참가 신청, 초보 마라톤 준비, 전국 마라톤 캘린더, 접수 중 마라톤 대회, 마라톤 대회 정보, 마라톤 코스 안내, 마라톤 참가비, 마라톤 대회 후기, 마라톤 대회 추천";

export const MARATHON_COVER_BASE_URL =
  "https://websszoa.github.io/runzoa.com/public/marathon/cover";

export function getMarathonCoverUrl(fileName: string) {
  return `${MARATHON_COVER_BASE_URL}/${fileName}`;
}

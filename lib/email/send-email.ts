import "server-only";

import { Resend } from "resend";

const DEFAULT_FROM = "RUNZOA <noreply@runzoa.com>";
export const ADMIN_EMAIL = "webstoryboy@naver.com";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY가 없습니다.");

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM,
    to,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
}

export function formatKoreanDate(date = new Date()): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function logEmailResults(
  workflow: string,
  results: PromiseSettledResult<void>[],
): void {
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`${workflow} 메일 발송 실패 [${index}]:`, result.reason);
    }
  });
}

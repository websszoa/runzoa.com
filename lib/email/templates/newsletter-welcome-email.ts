import { emailButton, emailLayout, infoTable } from "./email-layout";

export function newsletterWelcomeEmail({ email, subscribedAt, newsletterId }: { email: string; subscribedAt: string; newsletterId: string }): string {
  return emailLayout({
    eyebrow: "RUNZOA NEWSLETTER",
    title: "뉴스레터 구독이 완료됐어요!",
    description: "새로운 대회와 접수 소식을 정성껏 모아 보내드릴게요.",
    content: `<p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#374151">대회 일정, 접수 오픈, 놓치기 아쉬운 러닝 소식을 필요한 만큼 가볍게 전해드립니다.</p>${infoTable([["이메일", email], ["구독 일시", subscribedAt]])}${emailButton("런조아 둘러보기", "https://runzoa.com")}<p style="margin:18px 0 0;text-align:center;font-size:12px;color:#9ca3af"><a href="https://runzoa.com/unsubscribe?id=${newsletterId}" style="color:#6b7280">구독 취소</a></p>`,
    footer: "뉴스레터 구독 신청을 완료하여 발송된 메일입니다.",
  });
}

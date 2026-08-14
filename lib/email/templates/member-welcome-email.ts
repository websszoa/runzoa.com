import { emailButton, emailLayout, infoTable } from "./email-layout";

export function memberWelcomeEmail({ name, email, provider }: { name: string; email: string; provider: string }): string {
  return emailLayout({
    eyebrow: "WELCOME TO RUNZOA",
    title: `${name}님, 가입을 환영합니다!`,
    description: "새로운 대회와 접수 소식을 런조아에서 편하게 확인하세요.",
    content: `<p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#374151">국내외 마라톤 일정, 접수 정보, 지도와 즐겨찾기까지 러닝에 필요한 정보를 한곳에서 만나보세요.</p>${infoTable([["이메일", email], ["가입 방식", provider]])}${emailButton("대회 일정 보러 가기", "https://runzoa.com")}`,
    footer: "런조아 회원가입을 완료하여 발송된 메일입니다.",
  });
}

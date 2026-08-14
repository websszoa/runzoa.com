import "server-only";

import { ADMIN_EMAIL, formatKoreanDate, logEmailResults, sendEmail } from "./send-email";
import { memberAdminEmail } from "./templates/member-admin-email";
import { memberWelcomeEmail } from "./templates/member-welcome-email";

export async function sendMemberSignupEmails({ name, email, provider }: { name: string; email: string; provider: string }): Promise<void> {
  const results = await Promise.allSettled([
    sendEmail({ to: ADMIN_EMAIL, subject: `[런조아] 신규 회원 가입 - ${name}`, html: memberAdminEmail({ name, email, provider, joinedAt: formatKoreanDate() }) }),
    sendEmail({ to: email, subject: `${name}님, 런조아 가입을 환영합니다!`, html: memberWelcomeEmail({ name, email, provider }) }),
  ]);

  logEmailResults("회원가입", results);
}

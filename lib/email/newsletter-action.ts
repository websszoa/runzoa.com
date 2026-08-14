"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL, formatKoreanDate, logEmailResults, sendEmail } from "./send-email";
import { newsletterAdminEmail } from "./templates/newsletter-admin-email";
import { newsletterWelcomeEmail } from "./templates/newsletter-welcome-email";

const schema = z.object({
  email: z.string().trim().email().max(320),
  age: z.enum(["10대", "20대", "30대", "40대", "50대", "60대 이상"]),
  acquisitionSource: z.enum(["검색", "인스타그램·SNS", "러닝 크루·지인 추천", "커뮤니티·카페", "대회 또는 행사", "기타"]),
  contentPreference: z.string().trim().max(500),
  subscriptionSource: z.enum(["메인 구독 배너", "뉴스레터 페이지", "대회 상세페이지"]),
  consent: z.literal(true),
});

export type SubscribeNewsletterInput = z.infer<typeof schema>;

export async function subscribeNewsletter(input: SubscribeNewsletterInput): Promise<{ success: true } | { success: false; message: string }> {
  const validation = schema.safeParse(input);
  if (!validation.success) return { success: false, message: "입력 내용을 다시 확인해 주세요." };

  const data = validation.data;
  const supabase = await createClient();
  const { data: newsletterId, error } = await supabase.rpc("subscribe_newsletter", {
    subscriber_email: data.email,
    subscriber_age: data.age,
    subscriber_acquisition_source: data.acquisitionSource,
    subscriber_content_preference: data.contentPreference || null,
    subscriber_subscription_source: data.subscriptionSource,
    privacy_agreed: true,
    ads_agreed: true,
  });

  if (error || !newsletterId) {
    console.error("뉴스레터 구독 저장 실패:", error?.message);
    if (error?.message.includes("already_subscribed")) {
      return { success: false, message: "이미 뉴스레터를 구독 중인 이메일입니다." };
    }
    return { success: false, message: "구독 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const subscribedAt = formatKoreanDate();
  const results = await Promise.allSettled([
    sendEmail({ to: ADMIN_EMAIL, subject: `[런조아] 신규 뉴스레터 구독 - ${data.email}`, html: newsletterAdminEmail({ email: data.email, subscribedAt }) }),
    sendEmail({ to: data.email, subject: "[런조아] 뉴스레터 구독을 환영합니다!", html: newsletterWelcomeEmail({ email: data.email, subscribedAt, newsletterId }) }),
  ]);
  logEmailResults("뉴스레터 구독", results);

  return { success: true };
}

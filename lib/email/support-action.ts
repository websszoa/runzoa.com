"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { ADMIN_EMAIL, formatKoreanDate, logEmailResults, sendEmail } from "./send-email";
import { supportAdminEmail } from "./templates/support-admin-email";
import { supportReceiptEmail } from "./templates/support-receipt-email";

const supportTypeSchema = z.enum(["등록문의", "문의사항", "불편신고", "수정요청"]);

export async function submitSupportRequest(values: ContactFormValues, type: string): Promise<{ success: true } | { success: false; unavailable?: boolean }> {
  const form = contactFormSchema.safeParse(values);
  const supportType = supportTypeSchema.safeParse(type);
  if (!form.success || !supportType.success) return { success: false };

  const data = form.data;
  const supabase = await createClient();
  const { data: contactId, error } = await supabase.rpc("submit_contact", {
    contact_name: data.name,
    contact_email: data.email,
    contact_type: supportType.data,
    contact_title: data.subject,
    contact_content: data.content,
    contact_related_url: data.relatedUrl || null,
    privacy_agreed: data.privacyConsent,
  });

  if (error || !contactId) {
    console.error("지원 요청 저장 실패:", error?.message);
    return { success: false, unavailable: error?.code === "PGRST202" };
  }

  const submittedAt = formatKoreanDate();
  const results = await Promise.allSettled([
    sendEmail({ to: ADMIN_EMAIL, subject: `[런조아] ${supportType.data} 접수 - ${data.subject}`, html: supportAdminEmail({ type: supportType.data, name: data.name, email: data.email, title: data.subject, content: data.content, submittedAt }) }),
    sendEmail({ to: data.email, subject: `[런조아] ${supportType.data} 접수가 완료되었습니다`, html: supportReceiptEmail({ name: data.name, type: supportType.data, title: data.subject, submittedAt }) }),
  ]);
  logEmailResults("지원 요청", results);

  return { success: true };
}

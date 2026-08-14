"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatKoreanDate, sendEmail } from "@/lib/email/send-email";
import { supportReplyEmail } from "@/lib/email/templates/support-reply-email";
import { createClient } from "@/lib/supabase/server";

export type ContactStatus = "대기중" | "처리중" | "처리완료";

const updateContactSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["대기중", "처리중", "처리완료"]),
  reply: z.string().max(5000),
});

export type UpdateContactResult = {
  success: true;
  emailSent: boolean;
};

export async function updateContact(
  id: string,
  status: ContactStatus,
  reply: string,
): Promise<UpdateContactResult> {
  const input = updateContactSchema.safeParse({ id, status, reply });
  if (!input.success) throw new Error("입력한 내용을 확인해 주세요.");

  const supabase = await createAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .select("name, user_email, type, title, reply")
    .eq("id", input.data.id)
    .single();

  if (contactError || !contact) {
    throw new Error("문의 내용을 찾지 못했습니다.");
  }

  const normalizedReply = input.data.reply.trim() || null;
  const shouldSendReply = Boolean(
    normalizedReply && normalizedReply !== contact.reply?.trim(),
  );
  const repliedAt = normalizedReply ? new Date() : null;
  const { error } = await supabase
    .from("contacts")
    .update({
      status: normalizedReply ? "처리완료" : input.data.status,
      reply: normalizedReply,
      replied_at: repliedAt?.toISOString() ?? null,
    })
    .eq("id", input.data.id);

  if (error) throw new Error("문의 내용을 수정하지 못했습니다.");

  let emailSent = false;
  if (shouldSendReply && normalizedReply && repliedAt) {
    try {
      await sendEmail({
        to: contact.user_email,
        subject: `[런조아] 문의 답변 - ${contact.title}`,
        html: supportReplyEmail({
          name: contact.name,
          type: contact.type,
          title: contact.title,
          reply: normalizedReply,
          repliedAt: formatKoreanDate(repliedAt),
        }),
      });
      emailSent = true;
    } catch (emailError) {
      console.error("문의 답변 메일 발송 실패:", emailError);
    }
  }

  revalidatePath("/admin/contact");
  return { success: true, emailSent };
}

export async function deleteContact(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) throw new Error("문의를 삭제하지 못했습니다.");
  revalidatePath("/admin/contact");
}

async function createAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_deleted")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.is_deleted) {
    throw new Error("관리자 권한이 필요합니다.");
  }

  return supabase;
}

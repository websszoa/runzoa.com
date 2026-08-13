"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ContactStatus = "대기중" | "처리중" | "처리완료";

export async function updateContact(
  id: string,
  status: ContactStatus,
  reply: string,
) {
  const supabase = await createAdminClient();
  const normalizedReply = reply.trim() || null;
  const { error } = await supabase
    .from("contacts")
    .update({
      status: normalizedReply ? "처리완료" : status,
      reply: normalizedReply,
      replied_at: normalizedReply ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error("문의 내용을 수정하지 못했습니다.");
  revalidatePath("/admin/contact");
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

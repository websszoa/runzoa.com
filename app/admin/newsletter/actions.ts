"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateNewsletterStatus(
  id: string,
  status: "구독중" | "구독취소",
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("newsletters")
    .update({
      status,
      unsubscribed_at: status === "구독취소" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error("뉴스레터 구독 상태를 변경하지 못했습니다.");
  revalidatePath("/admin/newsletter");
}

export async function deleteNewsletter(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("newsletters").delete().eq("id", id);

  if (error) throw new Error("뉴스레터 구독자를 삭제하지 못했습니다.");
  revalidatePath("/admin/newsletter");
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

"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const withdrawalSchema = z.literal("회원 탈퇴");

export type WithdrawAccountResult =
  | { success: true }
  | { success: false; message: string };

export async function withdrawAccount(
  confirmation: string,
): Promise<WithdrawAccountResult> {
  if (!withdrawalSchema.safeParse(confirmation.trim()).success) {
    return { success: false, message: "확인 문구를 정확히 입력해 주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "로그인 정보를 확인할 수 없습니다." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, is_deleted")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { success: false, message: "회원 정보를 확인할 수 없습니다." };
  }

  if (profile.is_deleted) {
    await supabase.auth.signOut();
    return { success: true };
  }

  const { data: withdrawn, error: withdrawalError } = await supabase.rpc(
    "withdraw_my_account",
  );

  if (withdrawalError || withdrawn !== true) {
    console.error("회원 탈퇴 처리 실패:", withdrawalError?.message);
    return {
      success: false,
      message: "회원 탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  await supabase.auth.signOut();
  return { success: true };
}

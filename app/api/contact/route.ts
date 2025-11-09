import { supabase } from "@/lib/supabase-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("contact")
      .insert([{ name, email, message }]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message:
        "문의해 주셔서 감사합니다. 남겨주신 내용은 확인 후 24시간 이내에 정성껏 답변드리겠습니다.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "문의 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

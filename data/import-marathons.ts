import "dotenv/config";
import { supabase } from "@/lib/supabase-client";
import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "./data-marathon.json");
const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function importData() {
  console.log(`총 ${jsonData.item.length}개의 마라톤 데이터 처리 시작...\n`);

  let addedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const item of jsonData.item) {
    // 기존 대회가 있는지 확인 (slug 기준)
    const { data: existing } = await supabase
      .from("marathons")
      .select("slug")
      .eq("slug", item.slug)
      .single();

    const marathonData = {
      name: item.name,
      slug: item.slug,
      description: item.description,
      registration: item.registration || {},
      event: item.event || {},
      location: item.location || {},
      price: item.price || {},
      scale: item.scale ? String(item.scale) : null,
      hosts: item.hosts || {},
      highlights: item.highlights || [],
      images: item.images || {},
      contacts: item.contacts || {},
    };

    const { error } = await supabase
      .from("marathons")
      .upsert(marathonData, { onConflict: "slug" });

    if (error) {
      console.error(`❌ ${item.name} 처리 실패:`, error.message);
      errorCount++;
    } else {
      if (existing) {
        console.log(`🔄 ${item.name} - 업데이트 완료`);
        updatedCount++;
      } else {
        console.log(`✨ ${item.name} - 신규 추가 완료`);
        addedCount++;
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 데이터 임포트 완료!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✨ 신규 추가: ${addedCount}개`);
  console.log(`🔄 업데이트: ${updatedCount}개`);
  if (errorCount > 0) {
    console.log(`❌ 실패: ${errorCount}개`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

importData();

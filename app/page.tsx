import MarathonList from "@/components/marathon/marathon-list";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function HomePage() {
  // await new Promise((resolve) => setTimeout(resolve, 100_000));

  const supabase = await createServerSupabase();
  const { data: marathons, error } = await supabase
    .from("marathons")
    .select("*");

  console.log("Supabase Data:", marathons);

  if (error) {
    console.error(error);
    return (
      <main className="main__container flex items-center justify-center">
        <p className="text-muted-foreground font-nanumNeo">
          데이터를 불러오는 중 오류가 발생했습니다 😢
        </p>
      </main>
    );
  }

  return (
    <main className="main__container">
      <MarathonList marathons={marathons || []} />
    </main>
  );
}

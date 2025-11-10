import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { CalendarHeart } from "lucide-react";
import { Marathon } from "@/lib/types";

interface MarathonRegisteringRandomProps {
  excludeSlug?: string;
}

export default async function MarathonRegisteringRandom({
  excludeSlug,
}: MarathonRegisteringRandomProps) {
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("marathons")
    .select("id, name, slug, registration")
    .contains("registration", { status: "접수중" })
    .limit(50);

  if (!data || data.length === 0) {
    return null;
  }

  const filtered = data.filter(
    (item: Partial<Marathon>) => item.slug && item.slug !== excludeSlug
  );

  if (filtered.length === 0) {
    return null;
  }

  const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div className="page__block">
      <h3>
        <CalendarHeart className="h-5 w-5 text-brand" /> 접수중인 마라톤
      </h3>
      <div>
        <ul>
          {shuffled.map((item) => (
            <li
              key={item.id ?? item.slug}
              className="mb-2 rounded bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-100 last:mb-0"
            >
              <Link
                href={`/marathon/${item.slug}`}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

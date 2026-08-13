import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/admin-sidebar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_deleted")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin" || profile.is_deleted) redirect("/");

  return (
    <div className="min-h-screen bg-[#f7f7f8] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}

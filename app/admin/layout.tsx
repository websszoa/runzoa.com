import type { Metadata } from "next";

import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-[#f7f7f8] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}

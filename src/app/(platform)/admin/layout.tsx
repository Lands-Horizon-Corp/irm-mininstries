import type { Metadata } from "next";

import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  description:
    "IRM Ministries admin dashboard for managing ministry content and operations.",
  title: "Admin Dashboard – IRM Ministries",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

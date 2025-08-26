import type { Metadata } from "next";

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
  return children;
}

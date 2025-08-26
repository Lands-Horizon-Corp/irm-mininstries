import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Frequently asked questions about IRM Ministries, membership, beliefs, and joining our faith community.",
  title: "FAQ — IRM Ministries",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

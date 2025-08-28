import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Join IRM Ministries and be part of our mission to spread God's word and serve communities worldwide. Choose to become a member or worker and begin your spiritual journey with us.",
  openGraph: {
    description:
      "Join IRM Ministries as a member or worker. Become part of our community and help us serve God's people around the world.",
    title: "Join IRM Ministries",
    url: "https://irm-ministries.fly.dev/join",
  },
  title: "Join IRM Ministries",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

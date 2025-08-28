import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Join IRM Ministries as a member and be part of our community. Complete your member profile and connect with fellow believers in our mission.",
  openGraph: {
    description:
      "Become a member with IRM Ministries. Join our community and participate in fellowship, worship, and service.",
    title: "Member's Profile – IRM Ministries",
    url: "https://irm-ministries.fly.dev/join/member",
  },
  title: "Member's Profile – IRM Ministries",
};

export default function JoinMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

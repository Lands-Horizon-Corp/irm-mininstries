import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Join IRM Ministries as a minister and be part of our mission to spread God's word and serve communities worldwide. Submit your application and begin your ministry journey with us.",
  openGraph: {
    description:
      "Become a minister with IRM Ministries. Apply to join our ministry team and help us serve God's people around the world.",
    title: "Join as Minister – IRM Ministries",
    url: "https://irmministries.org/join",
  },
  title: "Join as Minister – IRM Ministries",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

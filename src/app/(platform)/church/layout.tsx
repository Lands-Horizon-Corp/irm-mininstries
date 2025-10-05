import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Discover IRM Ministries churches and connect with local Christian communities. Find church locations, service times, ministry programs, and join our growing network of believers.",
  openGraph: {
    description:
      "Connect with IRM Ministries churches in your area. Explore local Christian communities, worship services, and ministry programs.",
    title: "Churches – IRM Ministries",
    url: "https://irm-ministries.fly.dev/church",
  },
  title: "Churches – IRM Ministries",
};

export default function ChurchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

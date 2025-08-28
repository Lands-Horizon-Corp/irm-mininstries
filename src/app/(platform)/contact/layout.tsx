import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Contact IRM Ministries for spiritual guidance, prayer requests, ministry questions, or to learn more about joining our Christian community. Our ministry team is here to support you.",
  openGraph: {
    description:
      "Get in touch with IRM Ministries for prayer support, spiritual guidance, ministry inquiries, or to connect with our Christian community.",
    title: "Contact – IRM Ministries",
    url: "https://irm-ministries.fly.dev/contact",
  },
  title: "Contact – IRM Ministries",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Read the privacy policy for IRM Ministries. Learn how we collect, use, and protect your personal information when you join our Christian ministry and participate in our services.",
  openGraph: {
    description:
      "IRM Ministries values your privacy. Review our privacy policy to understand how your data is processed and secured when participating in our ministry activities.",
    title: "Privacy Policy – IRM Ministries",
    url: "https://irmministries.org/privacy",
  },
  title: "Privacy Policy – IRM Ministries",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

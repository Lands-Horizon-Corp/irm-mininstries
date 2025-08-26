import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  alternates: {
    canonical: "https://irmministries.org/terms",
  },
  description:
    "Read the terms and conditions for membership and participation in IRM Ministries. Important information about our ministry guidelines, member responsibilities, and church policies.",
  openGraph: {
    description:
      "Review the terms and conditions for joining and participating in IRM Ministries. Learn about membership guidelines, responsibilities, and our ministry policies.",
    title: "Terms and Conditions – IRM Ministries",
  },
  title: "Terms and Conditions – IRM Ministries",
};

export default function GeneralTermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

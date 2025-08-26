import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Admin login for IRM Ministries. Access your ministry administration panel to manage content, members, and ministry activities.",
  openGraph: {
    description:
      "Secure admin access for IRM Ministries. Login to manage your ministry administration panel.",
    title: "Admin Login – IRM Ministries",
    url: "https://irmministries.org/login",
  },
  title: "Admin Login – IRM Ministries",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

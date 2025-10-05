import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import QueryProvider from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import MouseTrailEffect from "@/components/ui/mouse-trail-effect";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";

// @ts-ignore
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "IRM Ministries is a church rooted in God's Word, united in prayer, and commissioned to redeem lives through intentional discipleship. We embody servant leadership while nurturing relationships with God and people, impacting our community and the world through faithful worship and humble service.",
  title:
    "IRM Ministries - Intentional Redeeming Ministries | Faith, Community & Servant Leadership",
  openGraph: {
    title: "IRM Ministries - Intentional Redeeming Ministries",
    description: "Faith, Community & Servant Leadership",
    url: "https://irm-ministries.fly.dev",
    siteName: "IRM Ministries",
    images: [
      {
        url: "/images/logo-dark.webp",
        width: 1200,
        height: 630,
        alt: "IRM Ministries - Faith, Community & Servant Leadership",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IRM Ministries - Intentional Redeeming Ministries",
    description: "Faith, Community & Servant Leadership",
    images: ["/images/logo-dark.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo-dark.webp", sizes: "192x192", type: "image/webp" },
      { url: "/images/logo-dark.webp", sizes: "512x512", type: "image/webp" },
    ],
    apple: [
      {
        url: "/images/logo-white.webp",
        sizes: "180x180",
        type: "image/webp",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider
              disableTransitionOnChange
              enableSystem
              attribute="class"
              defaultTheme="system"
            >
              <MouseTrailEffect
                color="primary"
                effect="dots"
                maxPoints={1000}
                size={10}
              />
              <Navbar />

              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

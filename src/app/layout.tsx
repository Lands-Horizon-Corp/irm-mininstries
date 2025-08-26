import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import QueryProvider from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import MouseTrailEffect from "@/components/ui/mouse-trail-effect";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";

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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
    "Cooperatives embody the power of community, where shared ownership and mutual aid transform economic challenges into opportunities for progress and empowerment.",
  title: "Empowering Communities Through Cooperative Ownership",
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
      </body>
    </html>
  );
}

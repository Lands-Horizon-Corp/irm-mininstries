import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import { Suspense } from "react"
import { QueryProvider } from "@/providers/query-provider"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Footer from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "IRM Ministries",
  description:
    "IRM Ministries is a Christian organization focused on spreading the Gospel and serving communities.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense
          fallback={
            <div className='flex items-center justify-center h-screen'>
              Loading...
            </div>
          }
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}

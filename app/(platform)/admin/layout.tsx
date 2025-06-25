"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, loading, router])

  // Show loading state until mounted and auth is resolved
  if (!mounted || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span className='text-sm text-muted-foreground'>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span className='text-sm text-muted-foreground'>Redirecting...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex bg-background'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col'>
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}

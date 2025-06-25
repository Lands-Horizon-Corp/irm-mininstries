"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginTestPage() {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span className='text-sm text-muted-foreground'>Loading...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
          <p className='text-muted-foreground'>
            Sign in to your IRM Ministries account
          </p>
        </div>

        <LoginForm />

        <div className='text-center text-sm text-muted-foreground'>
          <p>IRM Ministries Admin Portal</p>
          <p className='mt-1'>Secure access for authorized personnel only</p>
        </div>
      </div>
    </div>
  )
}

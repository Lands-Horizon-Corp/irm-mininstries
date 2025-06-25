"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuthSimple } from "@/hooks/use-auth-simple"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, user, loading } = useAuthSimple()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isSubmitting) return

    setIsSubmitting(true)
    const success = await login(email, password)

    if (success) {
      router.push("/admin")
    }
    setIsSubmitting(false)
  }

  // Show loading if checking auth
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

  // Don't render if already authenticated
  if (user) {
    return null
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4'>
      {/* Theme Toggle - Fixed position */}
      <div className='fixed top-4 right-4 z-10'>
        <ModeToggle />
      </div>

      <div className='w-full max-w-md space-y-8'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
          <p className='text-muted-foreground'>
            Sign in to your IRM Ministries account
          </p>
        </div>

        {/* Login Card */}
        <Card className='shadow-lg border-0 bg-card/50 backdrop-blur-sm'>
          <CardHeader className='space-y-1 pb-4'>
            <CardTitle className='text-2xl text-center'>Sign in</CardTitle>
            <CardDescription className='text-center'>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Field */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email address
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='admin@irm-ministries.com'
                  className='h-11'
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label htmlFor='password' className='text-sm font-medium'>
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    className='h-11 pr-10'
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className={cn(
                  "w-full h-11 mt-6",
                  isSubmitting && "cursor-not-allowed"
                )}
                disabled={!email || !password || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className='mr-2 h-4 w-4' />
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center text-sm text-muted-foreground'>
          <p>IRM Ministries Admin Portal</p>
          <p className='mt-1'>Secure access for authorized personnel only</p>
        </div>
      </div>
    </div>
  )
}

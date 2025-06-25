"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"

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

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuthSimple()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isSubmitting) return

    setIsSubmitting(true)
    const success = await login(email, password)

    if (success) {
      // Use Next.js router for navigation
      router.push("/admin")
      router.refresh() // Force refresh to update navbar
    }
    setIsSubmitting(false)
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl'>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email Field */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='admin@irm-ministries.com'
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Password Field */}
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='pr-10'
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
            className='w-full'
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
  )
}

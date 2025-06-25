"use client"

import Image from "next/image"
import { Loader2, Lock, Shield } from "lucide-react"

interface PageLoadingProps {
  message?: string
  submessage?: string
  showLogo?: boolean
  variant?: "auth" | "page" | "minimal"
}

export function PageLoading({
  message = "Loading...",
  submessage = "Please wait while we prepare your experience",
  showLogo = true,
  variant = "page",
}: PageLoadingProps) {
  if (variant === "minimal") {
    return (
      <div className='min-h-[200px] flex items-center justify-center'>
        <div className='flex items-center space-x-3'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
          <span className='text-muted-foreground'>{message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4'>
      <div className='flex flex-col items-center space-y-8 max-w-md w-full'>
        {/* Logo Section */}
        {showLogo && (
          <div className='flex justify-center'>
            <div className='p-6 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-pulse'>
              <Image
                src='/images/irm-logo.png'
                width={80}
                height={80}
                alt='IRM Ministries Logo'
                className='rounded-lg'
                priority
              />
            </div>
          </div>
        )}

        {/* Loading Content */}
        <div className='flex flex-col items-center space-y-6 text-center'>
          {/* Loading Spinner with Icon */}
          <div className='relative'>
            <div className='p-4 rounded-full bg-primary/5 border border-primary/20'>
              {variant === "auth" ? (
                <Shield className='h-8 w-8 text-primary' />
              ) : (
                <Lock className='h-8 w-8 text-primary' />
              )}
            </div>
            <Loader2 className='h-6 w-6 animate-spin text-primary absolute -top-1 -right-1' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-xl font-semibold text-foreground'>{message}</h2>
            <p className='text-muted-foreground text-sm max-w-sm'>
              {submessage}
            </p>
          </div>

          {/* Progress Bar Animation */}
          <div className='w-full max-w-xs'>
            <div className='h-1 bg-muted rounded-full overflow-hidden'>
              <div className='h-full bg-gradient-to-r from-primary/60 to-primary rounded-full animate-pulse w-3/4 transition-all duration-1000'></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className='flex space-x-2'>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center space-y-1'>
          <p className='text-sm text-muted-foreground font-medium'>
            IRM Ministries
          </p>
          <p className='text-xs text-muted-foreground/70'>
            {variant === "auth"
              ? "Secure authentication portal"
              : "Loading your content"}
          </p>
        </div>
      </div>
    </div>
  )
}

// Specific variants for different use cases
export function AuthPageLoading() {
  return (
    <PageLoading
      variant='auth'
      message='Authenticating...'
      submessage='Verifying your credentials and loading your dashboard'
    />
  )
}

export function ContentPageLoading() {
  return (
    <PageLoading
      variant='page'
      message='Loading content...'
      submessage='Please wait while we prepare your page'
    />
  )
}

export function MinimalPageLoading({
  message = "Loading...",
}: {
  message?: string
}) {
  return <PageLoading variant='minimal' message={message} showLogo={false} />
}

// Default export
export default PageLoading

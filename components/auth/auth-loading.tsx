"use client"

import Image from "next/image"
import { Loader2, Shield } from "lucide-react"

interface AuthLoadingProps {
  message?: string
  showLogo?: boolean
}

export function AuthLoading({
  message = "Authenticating...",
  showLogo = true,
}: AuthLoadingProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4'>
      <div className='flex flex-col items-center space-y-8 max-w-md w-full'>
        {/* Logo Section */}
        {showLogo && (
          <div className='flex justify-center'>
            <div className='p-6 rounded-full bg-primary/10 backdrop-blur-sm animate-pulse'>
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
          {/* Loading Spinner with Shield */}
          <div className='relative'>
            <div className='p-4 rounded-full bg-primary/5 border border-primary/20'>
              <Shield className='h-8 w-8 text-primary' />
            </div>
            <Loader2 className='h-6 w-6 animate-spin text-primary absolute -top-1 -right-1' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-xl font-semibold text-foreground'>{message}</h2>
            <p className='text-muted-foreground text-sm'>
              Verifying your credentials and loading your dashboard
            </p>
          </div>

          {/* Progress Bar Animation */}
          <div className='w-full max-w-xs'>
            <div className='h-1 bg-muted rounded-full overflow-hidden'>
              <div className='h-full bg-primary rounded-full animate-pulse w-3/4'></div>
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
          <p className='text-sm text-muted-foreground'>IRM Ministries</p>
          <p className='text-xs text-muted-foreground/70'>
            Secure access portal
          </p>
        </div>
      </div>
    </div>
  )
}

// Default export for easier usage
export default AuthLoading

import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4'>
      <div className='flex flex-col items-center space-y-8'>
        {/* Logo Section */}
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

        {/* Loading Content */}
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='flex items-center space-x-3'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
            <h2 className='text-xl font-semibold text-foreground'>Loading</h2>
          </div>

          <p className='text-muted-foreground max-w-sm'>
            Please wait while we prepare your experience...
          </p>

          {/* Loading Animation */}
          <div className='flex space-x-2 mt-6'>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center space-y-1 mt-8'>
          <p className='text-sm text-muted-foreground'>IRM Ministries</p>
          <p className='text-xs text-muted-foreground/70'>
            Spreading hope and building communities through faith
          </p>
        </div>
      </div>
    </div>
  )
}

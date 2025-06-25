import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8 text-center'>
        {/* Logo Section */}
        <div className='flex justify-center mb-8'>
          <div className='p-4 rounded-full bg-primary/10 backdrop-blur-sm'>
            <Image
              src='/images/irm-logo.png'
              width={80}
              height={80}
              alt='IRM Ministries Logo'
              className='rounded-lg'
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className='border-0 bg-card/50 backdrop-blur-sm shadow-lg'>
          <CardContent className='p-8 space-y-6'>
            {/* 404 Text */}
            <div className='space-y-2'>
              <h1 className='text-8xl font-bold text-muted-foreground/20 select-none'>
                404
              </h1>
              <h2 className='text-2xl font-semibold text-foreground'>
                Page Not Found
              </h2>
              <p className='text-muted-foreground max-w-sm mx-auto'>
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved. Let&apos;s get you back on track.
              </p>
            </div>

            {/* Search Icon Decoration */}
            <div className='flex justify-center py-4'>
              <div className='p-3 rounded-full bg-muted/30'>
                <Search className='h-6 w-6 text-muted-foreground/50' />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <Button asChild className='w-full'>
                <Link href='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Back to Home
                </Link>
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link href='/'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Return Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className='text-center space-y-2'>
          <p className='text-sm text-muted-foreground'>IRM Ministries</p>
          <p className='text-xs text-muted-foreground/70'>
            Spreading hope and building communities through faith
          </p>
        </div>
      </div>
    </div>
  )
}

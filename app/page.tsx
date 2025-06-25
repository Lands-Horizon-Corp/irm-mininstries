"use client"

import { AlertTriangle, Church, RefreshCw } from "lucide-react"

import { useChurchCovers } from "@/hooks/use-church-covers"
import { useChurchEvents } from "@/hooks/use-church-events"
import { Button } from "@/components/ui/button"
import ChurchValues from "@/components/home/church_values"
import ChurchEventsSection from "@/components/home/church-events-section"
import ChurchHeroCarousel from "@/components/home/home_hero"

// Loading component for the hero carousel
function HeroLoadingSkeleton() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden'>
      <div className='absolute inset-0 bg-grid-pattern opacity-5' />
      <div className='text-center space-y-8 relative z-10'>
        <div className='relative'>
          <div className='w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto' />
          <div
            className='absolute inset-0 w-20 h-20 border-4 border-transparent border-b-secondary rounded-full animate-spin mx-auto'
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>
        <div className='space-y-3'>
          <div className='inline-flex p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30'>
            <Church className='h-6 w-6 text-primary' />
          </div>
          <h2 className='text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            Loading Church Covers
          </h2>
          <p className='text-muted-foreground text-lg max-w-md mx-auto'>
            Preparing our beautiful gallery for you...
          </p>
        </div>
      </div>
    </div>
  )
}

// Error component for the hero carousel
function HeroErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-background via-destructive/5 to-background relative overflow-hidden'>
      <div className='absolute inset-0 bg-grid-pattern opacity-5' />
      <div className='text-center space-y-8 max-w-lg mx-auto px-6 relative z-10'>
        <div className='space-y-6'>
          <div className='inline-flex p-4 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 border border-destructive/30'>
            <AlertTriangle className='h-8 w-8 text-destructive' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Unable to Load Church Covers
            </h2>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              We&apos;re having trouble loading the church cover images. Please
              check your connection and try again.
            </p>
          </div>
        </div>
        <Button
          onClick={onRetry}
          className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 px-8 py-3 text-white font-semibold'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default function Home() {
  const { covers: churchCovers, isLoading, error, refetch } = useChurchCovers()
  const {
    events: churchEvents,
    isLoading: eventsLoading,
    error: eventsError,
  } = useChurchEvents()

  return (
    <div className='min-h-screen'>
      {isLoading ? (
        <HeroLoadingSkeleton />
      ) : error ? (
        <HeroErrorFallback onRetry={() => refetch()} />
      ) : (
        <ChurchHeroCarousel churchCovers={churchCovers} />
      )}
      <ChurchValues />
      <ChurchEventsSection
        events={churchEvents}
        isLoading={eventsLoading}
        error={eventsError as Error | null}
      />
    </div>
  )
}

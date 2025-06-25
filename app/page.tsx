"use client"

import { useChurchCovers } from "@/hooks/use-church-covers"
import ChurchValues from "@/components/home/church_values"
import ChurchHeroCarousel from "@/components/home/home_hero"

// Loading component for the hero carousel
function HeroLoadingSkeleton() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200'>
      <div className='text-center space-y-4'>
        <div className='w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto'></div>
        <p className='text-gray-600 text-lg'>Loading church covers...</p>
      </div>
    </div>
  )
}

// Error component for the hero carousel
function HeroErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100'>
      <div className='text-center space-y-6 max-w-md mx-auto px-4'>
        <div className='text-red-600'>
          <h3 className='text-2xl font-bold mb-2'>
            Unable to Load Church Covers
          </h3>
          <p className='text-red-700'>
            We&apos;re having trouble loading the church cover images. Please
            check your connection and try again.
          </p>
        </div>
        <button
          onClick={onRetry}
          className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const { covers: churchCovers, isLoading, error, refetch } = useChurchCovers()

  return (
    <div>
      {isLoading ? (
        <HeroLoadingSkeleton />
      ) : error ? (
        <HeroErrorFallback onRetry={() => refetch()} />
      ) : (
        <ChurchHeroCarousel churchCovers={churchCovers} />
      )}
      <ChurchValues />
    </div>
  )
}

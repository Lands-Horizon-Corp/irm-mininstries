"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"

interface ChurchCover {
  name: string
  description: string
  coverImage: string
}

interface ChurchHeroCarouselProps {
  churchCovers: ChurchCover[]
}

export default function ChurchHeroCarousel({
  churchCovers,
}: ChurchHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === churchCovers.length - 1 ? 0 : prevIndex + 1
    )
  }, [churchCovers.length])

  const prevSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? churchCovers.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [churchCovers.length, nextSlide])

  if (!churchCovers || churchCovers.length === 0) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-gray-100'>
        <p className='text-gray-500'>No church covers available</p>
      </div>
    )
  }

  return (
    <section className='relative w-full h-screen overflow-hidden'>
      {/* Main carousel container */}
      <div className='relative w-full h-full'>
        {churchCovers.map((cover, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background image */}
            <div className='relative w-full h-full'>
              <Image
                src={
                  cover.coverImage
                    ? isTigrisUrl(cover.coverImage)
                      ? getProxiedImageUrl(cover.coverImage)
                      : cover.coverImage
                    : "/placeholder.svg"
                }
                alt={cover.name}
                fill
                className='object-cover'
                priority={index === 0}
                sizes='100vw'
              />
              {/* Overlay for better text readability */}
              <div className='absolute inset-0 bg-black/40' />
            </div>

            {/* Content overlay */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center text-white px-4 max-w-4xl'>
                <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg'>
                  {cover.name}
                </h1>
                <p className='text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md max-w-2xl mx-auto'>
                  {cover.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant='outline'
        size='icon'
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm'
        onClick={prevSlide}
        aria-label='Previous slide'
      >
        <ChevronLeft className='h-6 w-6' />
      </Button>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm'
        onClick={nextSlide}
        aria-label='Next slide'
      >
        <ChevronRight className='h-6 w-6' />
      </Button>

      {/* Dot indicators */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {churchCovers.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className='absolute top-8 right-8 text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm'>
        <span className='text-sm font-medium'>
          {currentIndex + 1} / {churchCovers.length}
        </span>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react"

import { ChurchEvent } from "@/types/common"
import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ChurchEventsSectionProps {
  events: ChurchEvent[]
  isLoading?: boolean
  error?: Error | null
}

function EventCardSkeleton() {
  return (
    <Card className='overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background to-muted/50'>
      <div className='animate-pulse'>
        <div className='h-48 bg-gradient-to-br from-muted/50 to-muted' />
        <div className='p-6 space-y-4'>
          <div className='h-4 bg-gradient-to-r from-muted to-muted/50 rounded-full w-3/4' />
          <div className='h-3 bg-gradient-to-r from-muted to-muted/50 rounded-full w-1/2' />
          <div className='h-3 bg-gradient-to-r from-muted to-muted/50 rounded-full w-2/3' />
          <div className='space-y-2'>
            <div className='h-3 bg-gradient-to-r from-muted to-muted/50 rounded-full' />
            <div className='h-3 bg-gradient-to-r from-muted to-muted/50 rounded-full w-4/5' />
          </div>
        </div>
      </div>
    </Card>
  )
}

function EventCard({ event }: { event: ChurchEvent }) {
  const formatDateTime = (date: Date) => {
    const eventDate = new Date(date)
    const dateStr = eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const timeStr = eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return { dateStr, timeStr }
  }

  const { dateStr, timeStr } = formatDateTime(event.datetime)
  const isUpcoming = new Date(event.datetime) > new Date()

  const imageUrl = event.imageUrl
    ? isTigrisUrl(event.imageUrl)
      ? getProxiedImageUrl(event.imageUrl)
      : event.imageUrl
    : null

  return (
    <Card className='overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full border-0 bg-gradient-to-br from-background via-background to-muted/30 hover:scale-[1.02] hover:from-background hover:to-primary/5'>
      {/* Image Section */}
      {imageUrl ? (
        <div className='relative h-48 w-full overflow-hidden'>
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className='object-cover group-hover:scale-110 transition-transform duration-500'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
          {isUpcoming && (
            <div className='absolute top-4 left-4'>
              <span className='bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm'>
                Upcoming
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className='relative h-48 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5' />
          <Calendar className='h-16 w-16 text-primary/40 group-hover:text-primary/60 transition-colors duration-300' />
          {isUpcoming && (
            <div className='absolute top-4 left-4'>
              <span className='bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm'>
                Upcoming
              </span>
            </div>
          )}
        </div>
      )}

      <CardContent className='p-6'>
        <div className='space-y-4'>
          {/* Date and Time */}
          <div className='flex items-center gap-4 text-sm'>
            <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'>
              <Calendar className='h-4 w-4 text-primary' />
              <span className='font-medium text-primary'>{dateStr}</span>
            </div>
            <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20'>
              <Clock className='h-4 w-4 text-secondary-foreground' />
              <span className='font-medium text-secondary-foreground'>
                {timeStr}
              </span>
            </div>
          </div>

          {/* Event Name */}
          <h3 className='font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>
            {event.name}
          </h3>

          {/* Location */}
          <div className='flex items-start gap-3'>
            <div className='p-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30'>
              <MapPin className='h-4 w-4 text-accent-foreground' />
            </div>
            <span className='text-sm text-muted-foreground line-clamp-1 font-medium pt-1'>
              {event.place}
            </span>
          </div>

          {/* Description */}
          <p className='text-sm text-muted-foreground line-clamp-3 leading-relaxed'>
            {event.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ChurchEventsSection({
  events,
  isLoading = false,
  error = null,
}: ChurchEventsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (error) {
    return (
      <section className='py-20 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-5' />
        <div className='container mx-auto px-4 relative'>
          <div className='text-center py-16'>
            <div className='mb-6'>
              <div className='inline-flex p-4 rounded-full to-destructive/10 border border-destructive/30'>
                <Calendar className='h-8 w-8 text-destructive' />
              </div>
            </div>
            <h2 className='text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Upcoming Events
            </h2>
            <p className='text-muted-foreground mb-8 text-lg max-w-md mx-auto'>
              We&apos;re having trouble loading our events. Please try again
              later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className='py-20 relative overflow-hidden'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <div className='container mx-auto px-4 relative'>
          <div className='text-center mb-16'>
            <div className='mb-6'>
              <div className='inline-flex p-4 rounded-ful from-primary/20 to-primary/10 border border-primary/30'>
                <Calendar className='h-8 w-8 text-primary animate-pulse' />
              </div>
            </div>
            <h2 className='text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Upcoming Events
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto text-lg'>
              Join us for worship, fellowship, and community events throughout
              the year.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {Array.from({ length: 3 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!events || events.length === 0) {
    return (
      <section className='py-20 relative overflow-hidden'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <div className='container mx-auto px-4 relative'>
          <div className='text-center py-16'>
            <div className='mb-6'>
              <div className='inline-flex p-4 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 border border-muted/50'>
                <Calendar className='h-8 w-8 text-muted-foreground' />
              </div>
            </div>
            <h2 className='text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Upcoming Events
            </h2>
            <p className='text-muted-foreground mb-8 text-lg max-w-md mx-auto'>
              No events scheduled at the moment. Check back soon for updates!
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )

  // Show only upcoming events for the home page
  const upcomingEvents = sortedEvents.filter(
    event => new Date(event.datetime) > new Date()
  )

  // If no upcoming events, show the most recent 3 events
  const displayEvents =
    upcomingEvents.length > 0
      ? upcomingEvents.slice(0, 6)
      : sortedEvents.slice(-3)

  const eventsPerPage = 3
  const totalPages = Math.ceil(displayEvents.length / eventsPerPage)
  const currentEvents = displayEvents.slice(
    currentIndex * eventsPerPage,
    (currentIndex + 1) * eventsPerPage
  )

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className='py-10 relative overflow-hidden'>
      <div className='absolute inset-0 bg-grid-pattern opacity-5' />
      <div className='container mx-auto px-4 relative'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='mb-6'>
            <div className='inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30'>
              <Calendar className='h-8 w-8 text-primary' />
            </div>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent'>
            {upcomingEvents.length > 0 ? "Upcoming Events" : "Recent Events"}
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed'>
            Join us for worship, fellowship, and community events throughout the
            year.
          </p>
        </div>

        {/* Events Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {currentEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Navigation and View All Button */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-6'>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className='border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <div className='px-4 py-2 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border border-muted/50'>
                <span className='text-sm font-medium text-muted-foreground'>
                  {currentIndex + 1} of {totalPages}
                </span>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={nextSlide}
                disabled={currentIndex === totalPages - 1}
                className='border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          )}

          {/* View All Button */}
          <div className={totalPages <= 1 ? "mx-auto" : ""}>
            <Button
              variant='default'
              className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 px-8 py-2.5 text-white font-semibold'
            >
              View All Events
              <ArrowRight className='h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

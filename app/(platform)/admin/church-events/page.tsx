"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"

import { ChurchEvent } from "@/types/common"
import { useChurchEvents } from "@/hooks/use-church-events"
import { Button } from "@/components/ui/button"
import ChurchEventCard from "@/components/admin/church-event-card"
import ChurchEventForm from "@/components/admin/church-event-form"

export default function ChurchEventsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null)

  const {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useChurchEvents()

  const handleSubmit = async (data: {
    name: string
    description: string
    place: string
    datetime?: string
    imageUrl?: string
  }) => {
    if (!data.datetime) {
      return
    }
    const eventData = {
      ...data,
      datetime: new Date(data.datetime),
    }

    if (editingEvent) {
      await updateEvent(editingEvent.id, eventData)
    } else {
      await createEvent(eventData)
    }
    setShowForm(false)
    setEditingEvent(null)
  }

  const handleEdit = (event: ChurchEvent) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await deleteEvent(id)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(event => new Date(event.datetime) > now)
  const pastEvents = events.filter(event => new Date(event.datetime) <= now)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Church Events</h1>
          <p className='text-muted-foreground'>
            Manage church events and announcements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Event
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : events.length === 0 ? (
        <div className='text-center py-12 border-2 border-dashed border-border rounded-lg'>
          <p className='text-muted-foreground text-lg'>
            No church events found.
          </p>
          <p className='text-sm text-muted-foreground mt-2 mb-4'>
            Start by adding your first church event.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Add Your First Event
          </Button>
        </div>
      ) : (
        <div className='space-y-8'>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <h2 className='text-xl font-semibold'>
                  Upcoming Events ({upcomingEvents.length})
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {upcomingEvents.map(event => (
                  <ChurchEventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                <h2 className='text-xl font-semibold'>
                  Past Events ({pastEvents.length})
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {pastEvents.map(event => (
                  <ChurchEventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ChurchEventForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingEvent}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

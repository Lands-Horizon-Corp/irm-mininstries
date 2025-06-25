"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react"

import { ChurchEvent } from "@/types/common"
import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChurchEventCardProps {
  event: ChurchEvent
  onEdit: (event: ChurchEvent) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function ChurchEventCard({
  event,
  onEdit,
  onDelete,
  isDeleting = false,
}: ChurchEventCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(event.id)
    setShowDeleteDialog(false)
  }

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
    <>
      <Card className='overflow-hidden group hover:shadow-lg transition-all duration-200'>
        <CardHeader className='p-0'>
          {/* Image Section */}
          {imageUrl && (
            <div className='relative h-48 w-full'>
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-black/20' />
              <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='h-8 w-8 p-0'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Edit className='h-4 w-4 mr-2' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className='text-destructive'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Date/Time Header */}
          <div
            className={`relative p-4 ${imageUrl ? "bg-card" : "bg-gradient-to-r from-primary to-primary/80"} ${imageUrl ? "text-card-foreground" : "text-primary-foreground"}`}
          >
            {!imageUrl && (
              <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='h-8 w-8 p-0'
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Edit className='h-4 w-4 mr-2' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className='text-destructive'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className='flex items-center gap-2 mb-2'>
              <Calendar className='h-4 w-4' />
              <span className='text-sm font-medium'>{dateStr}</span>
            </div>

            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              <span className='text-sm'>{timeStr}</span>
              {isUpcoming && (
                <span
                  className={`ml-auto text-xs px-2 py-1 rounded-full ${imageUrl ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-green-500/20 text-green-200 dark:bg-green-500/30 dark:text-green-100"}`}
                >
                  Upcoming
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-4'>
          <h3 className='font-semibold text-lg mb-2 line-clamp-1'>
            {event.name}
          </h3>

          <div className='flex items-start gap-2 mb-3'>
            <MapPin className='h-4 w-4 mt-1 text-muted-foreground flex-shrink-0' />
            <span className='text-sm text-muted-foreground line-clamp-1'>
              {event.place}
            </span>
          </div>

          <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
            {event.description}
          </p>

          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>
              Created: {new Date(event.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated: {new Date(event.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Church Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{event.name}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

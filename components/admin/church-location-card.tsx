"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, MapPin, MoreVertical, Trash2 } from "lucide-react"

import { ChurchLocation } from "@/types/common"
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

interface ChurchLocationCardProps {
  location: ChurchLocation
  onEdit: (location: ChurchLocation) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function ChurchLocationCard({
  location,
  onEdit,
  onDelete,
  isDeleting = false,
}: ChurchLocationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const imageUrl = location.imageUrl
    ? isTigrisUrl(location.imageUrl)
      ? getProxiedImageUrl(location.imageUrl)
      : location.imageUrl
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
                alt={location.address}
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
                    <DropdownMenuItem onClick={() => onEdit(location)}>
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
        </CardHeader>

        <CardContent className='p-4'>
          <h3 className='font-semibold text-lg mb-2 line-clamp-1'>
            {location.address}
          </h3>

          <div className='flex items-start gap-2 mb-3'>
            <MapPin className='h-4 w-4 mt-1 text-muted-foreground flex-shrink-0' />
            <span className='text-sm text-muted-foreground line-clamp-1'>
              {location.latitude}, {location.longitude}
            </span>
          </div>

          <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
            {location.description}
          </p>

          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>
              Created: {new Date(location.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated: {new Date(location.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Church Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{location.address}&rdquo;?
              This action cannot be undone.
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
              onClick={() => onDelete(location.id)}
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

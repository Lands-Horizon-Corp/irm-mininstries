"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, MoreVertical, Trash2 } from "lucide-react"

import { ChurchCoverPhoto } from "@/types/common"
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

interface ChurchCoverCardProps {
  cover: ChurchCoverPhoto
  onEdit: (cover: ChurchCoverPhoto) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function ChurchCoverCard({
  cover,
  onEdit,
  onDelete,
  isDeleting = false,
}: ChurchCoverCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(cover.id)
    setShowDeleteDialog(false)
  }

  const imageUrl = isTigrisUrl(cover.coverImage)
    ? getProxiedImageUrl(cover.coverImage)
    : cover.coverImage

  return (
    <>
      <Card className='overflow-hidden group hover:shadow-lg transition-shadow'>
        <CardHeader className='p-0'>
          <div className='relative h-48 w-full'>
            <Image
              src={imageUrl}
              alt={cover.name}
              fill
              className='object-cover'
            />
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='secondary' size='sm' className='h-8 w-8 p-0'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onEdit(cover)}>
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
        </CardHeader>
        <CardContent className='p-4'>
          <h3 className='font-semibold text-lg mb-2 line-clamp-1'>
            {cover.name}
          </h3>
          <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
            {cover.description}
          </p>
          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>
              Created: {new Date(cover.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated: {new Date(cover.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Church Cover</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{cover.name}&rdquo;? This
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

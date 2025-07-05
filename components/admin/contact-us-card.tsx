"use client"

import { useState } from "react"
import { Edit, MoreVertical, Trash2 } from "lucide-react"

import { ContactUs } from "@/types/common"
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

interface ContactUsCardProps {
  contact: ContactUs
  onEdit: (contact: ContactUs) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function ContactUsCard({
  contact,
  onEdit,
  onDelete,
  isDeleting = false,
}: ContactUsCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(contact.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className='overflow-hidden group hover:shadow-lg transition-shadow'>
        <CardHeader className='p-0 flex flex-row items-center justify-between'>
          <div className='p-4'>
            <div className='font-semibold text-lg line-clamp-1'>
              {contact.name}
            </div>
            <div className='text-sm text-muted-foreground line-clamp-1'>
              {contact.email}
            </div>
            <div className='text-xs text-muted-foreground'>
              {contact.contactNumber}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='sm' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit(contact)}>
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
        </CardHeader>
        <CardContent className='p-4'>
          <div className='mb-2 text-sm text-muted-foreground line-clamp-3'>
            {contact.description}
          </div>
          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>
              Created: {new Date(contact.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated: {new Date(contact.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{contact.name}&rdquo;? This
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

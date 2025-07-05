"use client"

import { useState } from "react"
import { Edit, MoreVertical, Trash2 } from "lucide-react"

import { MinistryRanks } from "@/types/common"
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

interface MinistryRanksCardProps {
  rank: MinistryRanks
  onEdit: (rank: MinistryRanks) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export default function MinistryRanksCard({
  rank,
  onEdit,
  onDelete,
  isDeleting = false,
}: MinistryRanksCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(rank.id)
    setShowDeleteDialog(false)
  }

  return (
    <Card className='mb-4'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <h3 className='font-semibold text-lg'>{rank.name}</h3>
          <p className='text-sm text-muted-foreground'>{rank.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreVertical className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(rank)}>
              <Edit className='w-4 h-4 mr-2' /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className='w-4 h-4 mr-2' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>{/* Additional content if needed */}</CardContent>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ministry Rank</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ministry rank?
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"

import { ChurchCoverPhoto } from "@/types/common"
import { useChurchCovers } from "@/hooks/use-church-covers"
import { Button } from "@/components/ui/button"
import ChurchCoverCard from "@/components/admin/church-cover-card"
import ChurchCoverForm from "@/components/admin/church-cover-form"

export default function ChurchCoverPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCover, setEditingCover] = useState<ChurchCoverPhoto | null>(
    null
  )

  const {
    covers,
    isLoading,
    createCover,
    updateCover,
    deleteCover,
    isCreating,
    isUpdating,
    isDeleting,
  } = useChurchCovers()

  const handleSubmit = async (data: {
    name: string
    description: string
    coverImage: string
  }) => {
    if (editingCover) {
      await updateCover(editingCover.id, data)
    } else {
      await createCover(data)
    }
    setShowForm(false)
    setEditingCover(null)
  }

  const handleEdit = (cover: ChurchCoverPhoto) => {
    setEditingCover(cover)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    await deleteCover(id)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCover(null)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Church Cover</h1>
          <p className='text-muted-foreground'>
            Manage church cover images and banners
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Cover
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : covers.length === 0 ? (
        <div className='text-center py-12 border-2 border-dashed border-border rounded-lg'>
          <p className='text-muted-foreground text-lg'>
            No church covers found.
          </p>
          <p className='text-sm text-muted-foreground mt-2 mb-4'>
            Start by adding your first church cover image.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Add Your First Cover
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {covers.map(cover => (
            <ChurchCoverCard
              key={cover.id}
              cover={cover}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      <ChurchCoverForm
        open={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingCover}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

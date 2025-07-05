"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  MinistryRanksFormData,
  ministryRanksSchema,
} from "@/lib/ministry-ranks-schema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface MinistryRanksFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: MinistryRanksFormData) => Promise<void>
  initialData?: MinistryRanksFormData | null
  isLoading?: boolean
}

export default function MinistryRanksForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: MinistryRanksFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MinistryRanksFormData>({
    resolver: zodResolver(ministryRanksSchema),
    defaultValues: initialData || { name: "", description: "" },
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({ name: "", description: "" })
    }
  }, [initialData, reset])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Ministry Rank" : "Add Ministry Rank"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...register("name")} disabled={isLoading} />
            {errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.description.message}
              </p>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

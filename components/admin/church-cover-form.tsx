"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChurchCoverPhoto } from "@/types/common"
import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FileUpload from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const churchCoverSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  coverImage: z.string().url("Valid image URL is required"),
})

type ChurchCoverFormData = z.infer<typeof churchCoverSchema>

interface ChurchCoverFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ChurchCoverFormData) => Promise<void>
  initialData?: ChurchCoverPhoto | null
  isLoading?: boolean
}

export default function ChurchCoverForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ChurchCoverFormProps) {
  const [imageUrl, setImageUrl] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ChurchCoverFormData>({
    resolver: zodResolver(churchCoverSchema),
    defaultValues: {
      name: "",
      description: "",
      coverImage: "",
    },
  })

  // Update form when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description,
          coverImage: initialData.coverImage,
        })
        setImageUrl(initialData.coverImage)
      } else {
        reset({
          name: "",
          description: "",
          coverImage: "",
        })
        setImageUrl("")
      }
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    reset({
      name: "",
      description: "",
      coverImage: "",
    })
    setImageUrl("")
    onClose()
  }

  const handleFormSubmit = async (data: ChurchCoverFormData) => {
    await onSubmit(data)
    handleClose()
  }

  const handleImageUpload = (file: { url: string } | null) => {
    if (file?.url) {
      setImageUrl(file.url)
      setValue("coverImage", file.url, { shouldValidate: true })
    } else {
      setImageUrl("")
      setValue("coverImage", "", { shouldValidate: true })
    }
  }

  const handleImageRemove = () => {
    setImageUrl("")
    setValue("coverImage", "", { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Church Cover" : "Add Church Cover"}
          </DialogTitle>
        </DialogHeader>

        <form
          key={initialData?.id || "new"}
          onSubmit={handleSubmit(handleFormSubmit)}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register("name")}
              placeholder='Enter cover name'
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register("description")}
              placeholder='Enter description'
              rows={3}
            />
            {errors.description && (
              <p className='text-sm text-destructive'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>Cover Image</Label>
            <FileUpload
              accept='image/*'
              maxSize={5 * 1024 * 1024} // 5MB
              onUploadSuccess={handleImageUpload}
              onUploadError={error => console.error(error)}
            />
            {imageUrl && (
              <div className='relative'>
                <Image
                  src={
                    isTigrisUrl(imageUrl)
                      ? getProxiedImageUrl(imageUrl)
                      : imageUrl
                  }
                  alt='Preview'
                  width={400}
                  height={128}
                  className='w-full h-32 object-cover rounded-md'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={handleImageRemove}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            )}
            {errors.coverImage && (
              <p className='text-sm text-destructive'>
                {errors.coverImage.message}
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

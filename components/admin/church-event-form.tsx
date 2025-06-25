"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChurchEvent } from "@/types/common"
import { getProxiedImageUrl, isTigrisUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-picker"
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

const churchEventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  place: z.string().min(1, "Place is required").max(200, "Place too long"),
  datetime: z.string().optional(), // Made optional since we handle it separately
  imageUrl: z
    .string()
    .url("Valid image URL is required")
    .optional()
    .or(z.literal("")),
})

type ChurchEventFormData = z.infer<typeof churchEventSchema>

interface ChurchEventFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ChurchEventFormData) => Promise<void>
  initialData?: ChurchEvent | null
  isLoading?: boolean
}

export default function ChurchEventForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ChurchEventFormProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ChurchEventFormData>({
    resolver: zodResolver(churchEventSchema),
    defaultValues: {
      name: "",
      description: "",
      place: "",
      datetime: "",
      imageUrl: "",
    },
  })

  // Update form when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Parse the datetime for the DateTimePicker
        const eventDate = new Date(initialData.datetime)
        setSelectedDateTime(eventDate)

        reset({
          name: initialData.name,
          description: initialData.description,
          place: initialData.place,
          datetime: "", // We'll handle this separately with datetime state
          imageUrl: initialData.imageUrl || "",
        })
        setImageUrl(initialData.imageUrl || "")
      } else {
        setSelectedDateTime(undefined)
        reset({
          name: "",
          description: "",
          place: "",
          datetime: "",
          imageUrl: "",
        })
        setImageUrl("")
      }
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    reset({
      name: "",
      description: "",
      place: "",
      datetime: "",
      imageUrl: "",
    })
    setImageUrl("")
    setSelectedDateTime(undefined)
    onClose()
  }

  const handleFormSubmit = async (data: ChurchEventFormData) => {
    try {
      // Check if datetime is selected
      if (!selectedDateTime) {
        throw new Error("Please select both date and time")
      }

      const eventData = {
        ...data,
        datetime: selectedDateTime.toISOString(),
      }
      await onSubmit(eventData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleImageUpload = (file: { url: string } | null) => {
    if (file?.url) {
      setImageUrl(file.url)
      setValue("imageUrl", file.url, { shouldValidate: true })
    } else {
      setImageUrl("")
      setValue("imageUrl", "", { shouldValidate: true })
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    setValue("imageUrl", "")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Church Event" : "Add Church Event"}
          </DialogTitle>
        </DialogHeader>

        <form
          key={initialData?.id || "new"}
          onSubmit={handleSubmit(handleFormSubmit)}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>Event Name</Label>
            <Input
              id='name'
              {...register("name")}
              placeholder='Enter event name'
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
              placeholder='Enter event description'
              rows={3}
            />
            {errors.description && (
              <p className='text-sm text-destructive'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='place'>Place</Label>
            <Input
              id='place'
              {...register("place")}
              placeholder='Enter event location'
            />
            {errors.place && (
              <p className='text-sm text-destructive'>{errors.place.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <DateTimePicker
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              placeholder='Select event date'
              dateLabel='Event Date'
              timeLabel='Event Time'
              className='w-full'
              showTime={true}
            />
            {!selectedDateTime && (
              <p className='text-sm text-destructive'>
                Please select both date and time
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>Event Image (Optional)</Label>
            {imageUrl ? (
              <div className='relative'>
                <div className='relative w-full h-48 rounded-md overflow-hidden'>
                  <Image
                    src={
                      isTigrisUrl(imageUrl)
                        ? getProxiedImageUrl(imageUrl)
                        : imageUrl
                    }
                    alt='Event preview'
                    fill
                    className='object-cover'
                  />
                </div>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={handleRemoveImage}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <FileUpload
                accept='image/*'
                maxSize={5 * 1024 * 1024} // 5MB
                onUploadSuccess={handleImageUpload}
                onUploadError={error => console.error(error)}
              />
            )}
            {errors.imageUrl && (
              <p className='text-sm text-destructive'>
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                  ? "Update Event"
                  : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

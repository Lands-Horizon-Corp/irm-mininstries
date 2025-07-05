"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ChurchLocation } from "@/types/common"
import { LatLng } from "@/types/map-picker"
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
import { MapPicker } from "@/components/ui/map-picker"
import { Textarea } from "@/components/ui/textarea"

const churchLocationSchema = z.object({
  imageUrl: z.string().url("Valid image URL is required"),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Valid email is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
})

type ChurchLocationFormData = z.infer<typeof churchLocationSchema>

interface ChurchLocationFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ChurchLocationFormData) => Promise<void>
  initialData?: ChurchLocation | null
  isLoading?: boolean
}

export default function ChurchLocationForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ChurchLocationFormProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [location, setLocation] = useState<LatLng | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ChurchLocationFormData>({
    resolver: zodResolver(churchLocationSchema),
    defaultValues: {
      imageUrl: "",
      longitude: "",
      latitude: "",
      address: "",
      email: "",
      description: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setLocation({
          lat: parseFloat(initialData.latitude),
          lng: parseFloat(initialData.longitude),
        })
        reset({
          imageUrl: initialData.imageUrl || "",
          longitude: initialData.longitude,
          latitude: initialData.latitude,
          address: initialData.address,
          email: initialData.email,
          description: initialData.description,
        })
        setImageUrl(initialData.imageUrl || "")
      } else {
        setLocation(null)
        reset({
          imageUrl: "",
          longitude: "",
          latitude: "",
          address: "",
          email: "",
          description: "",
        })
        setImageUrl("")
      }
    }
  }, [open, initialData, reset])

  useEffect(() => {
    if (location) {
      setValue("latitude", location.lat.toString(), { shouldValidate: true })
      setValue("longitude", location.lng.toString(), { shouldValidate: true })
    }
  }, [location, setValue])

  const handleClose = () => {
    reset({
      imageUrl: "",
      longitude: "",
      latitude: "",
      address: "",
      email: "",
      description: "",
    })
    setImageUrl("")
    setLocation(null)
    onClose()
  }

  const handleFormSubmit = async (data: ChurchLocationFormData) => {
    try {
      if (!location) {
        throw new Error("Please select a location on the map")
      }
      await onSubmit(data)
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
            {initialData ? "Edit Church Location" : "Add Church Location"}
          </DialogTitle>
        </DialogHeader>

        <form
          key={initialData?.id || "new"}
          onSubmit={handleSubmit(handleFormSubmit)}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input
              id='address'
              {...register("address")}
              placeholder='Enter the church location address'
            />
            {errors.address && (
              <p className='text-sm text-destructive'>
                {errors.address.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              {...register("email")}
              placeholder='Enter email'
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
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
            <Label>Location (Pick on Map)</Label>
            <MapPicker
              value={location}
              onChange={setLocation}
              placeholder='Select location'
            />
            {(errors.latitude || errors.longitude) && (
              <p className='text-sm text-destructive'>
                {errors.latitude?.message || errors.longitude?.message}
              </p>
            )}
          </div>

          <div className='flex gap-2'>
            <div className='w-1/2'>
              <Label htmlFor='latitude'>Latitude</Label>
              <Input
                id='latitude'
                {...register("latitude")}
                placeholder='Latitude'
                readOnly
              />
            </div>
            <div className='w-1/2'>
              <Label htmlFor='longitude'>Longitude</Label>
              <Input
                id='longitude'
                {...register("longitude")}
                placeholder='Longitude'
                readOnly
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Location Image</Label>
            {imageUrl ? (
              <div className='relative'>
                <div className='relative w-full h-48 rounded-md overflow-hidden'>
                  <Image
                    src={
                      isTigrisUrl(imageUrl)
                        ? getProxiedImageUrl(imageUrl)
                        : imageUrl
                    }
                    alt='Location preview'
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
                maxSize={5 * 1024 * 1024}
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
                  ? "Update Location"
                  : "Create Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

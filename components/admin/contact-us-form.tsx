"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ContactUsFormData, contactUsSchema } from "@/lib/contact-us-schema"
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

interface ContactUsFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ContactUsFormData) => Promise<void>
  initialData?: ContactUsFormData | null
  isLoading?: boolean
}

export default function ContactUsForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ContactUsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactUsFormData>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: { name: "", email: "", contactNumber: "", description: "" },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData)
      } else {
        reset({ name: "", email: "", contactNumber: "", description: "" })
      }
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    reset({ name: "", email: "", contactNumber: "", description: "" })
    onClose()
  }

  const handleFormSubmit = async (data: ContactUsFormData) => {
    await onSubmit(data)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Contact Submission" : "Contact Us"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register("name")}
              placeholder='Enter your name'
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...register("email")}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contactNumber'>Contact Number</Label>
            <Input
              id='contactNumber'
              {...register("contactNumber")}
              placeholder='Enter your contact number'
            />
            {errors.contactNumber && (
              <p className='text-sm text-destructive'>
                {errors.contactNumber.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              {...register("description")}
              placeholder='How can we help you?'
              rows={3}
            />
            {errors.description && (
              <p className='text-sm text-destructive'>
                {errors.description.message}
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
              {isLoading ? "Submitting..." : initialData ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

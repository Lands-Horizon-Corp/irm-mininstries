"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2Icon,
  HandshakeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ContactUsFormData, contactUsSchema } from "@/lib/contact-us-schema"
import { useContactUs } from "@/hooks/use-contact-us"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PublicContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { createContactUs, isCreating } = useContactUs()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactUsFormData>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: { name: "", email: "", contactNumber: "", description: "" },
  })

  const onSubmit = async (data: ContactUsFormData) => {
    if (cooldown > 0) return
    setIsSubmitting(true)
    try {
      await createContactUs(data)
      toast.success("Thank you for reaching out! We'll get back to you soon.")
      reset()
      setCooldown(30) // 30 seconds cooldown
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Timer effect
  useEffect(() => {
    if (cooldown === 0) return
    const timer = setInterval(() => {
      setCooldown(c => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12'>
      <Card className='w-full max-w-lg shadow-xl border-0 bg-card'>
        <CardHeader className='flex flex-col items-center gap-2 pb-2'>
          <span className='rounded-full bg-muted p-3 mb-2'>
            <HandshakeIcon className='h-8 w-8 text-foreground' />
          </span>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Contact Us
          </h1>
          <p className='text-sm text-muted-foreground text-center max-w-xs'>
            Have a question, need prayer, or want to know more about our church?
            Fill out the form below and we’ll get in touch!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Input
                {...register("name")}
                placeholder='Your Name'
                disabled={isSubmitting || isCreating}
              />
              {errors.name && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("email")}
                placeholder='Your Email'
                type='email'
                disabled={isSubmitting || isCreating}
              />
              {errors.email && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("contactNumber")}
                placeholder='Contact Number'
                disabled={isSubmitting || isCreating}
              />
              {errors.contactNumber && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
            <div>
              <Textarea
                {...register("description")}
                placeholder='How can we help you?'
                rows={4}
                disabled={isSubmitting || isCreating}
              />
              {errors.description && (
                <p className='text-xs text-destructive mt-1'>
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              className='w-full font-semibold'
              disabled={isSubmitting || isCreating || cooldown > 0}
            >
              {isSubmitting || isCreating
                ? "Sending..."
                : cooldown > 0
                  ? `Please wait ${cooldown}s`
                  : "Send Message"}
            </Button>
          </form>
          <div className='mt-8 border-t pt-6 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2 mb-2'>
              <Building2Icon className='h-4 w-4' />
              <span>IRM Ministries</span>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              <MailIcon className='h-4 w-4' />
              <a
                href='mailto:irm.ministries@gmail.com'
                className='hover:underline'
              >
                irm.ministries@gmail.com
              </a>
            </div>
            <div className='flex items-center gap-2 mb-2'>
              <PhoneIcon className='h-4 w-4' />
              <a href='tel:+6323417653' className='hover:underline'>
                (02) 3417 6053
              </a>
            </div>
            <div className='flex items-center gap-2'>
              <MapPinIcon className='h-4 w-4' />
              <span>
                351 Tandang Sora Avenue Pasong Tamo 1107 Quezon City,
                Philippines
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

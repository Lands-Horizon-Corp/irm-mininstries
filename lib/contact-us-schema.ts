import { z } from "zod"

export const contactUsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Valid email is required"),
  contactNumber: z.string().min(7, "Contact number is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
})

export type ContactUsFormData = z.infer<typeof contactUsSchema>

import { z } from "zod";

export const contactUsFormSchema = z
  .object({
    description: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
    email: z.string().email("Email is not valid."),
    name: z.string().min(2, {
      message: "First and last name must be at least 2 characters.",
    }),
    prayerRequest: z.string().optional(),
    repeatEmail: z.string().email("Email is not valid."),
    subject: z.string().min(3, {
      message: "Subject is required.",
    }),
    supportEmail: z.string().email("Support email is not valid."),
  })
  .superRefine((data, ctx) => {
    if (data.email !== data.repeatEmail) {
      ctx.addIssue({
        code: "custom",
        message: "Emails do not match",
        path: ["repeatEmail"],
      });
    }
  });

export const updateContactUsFormSchema = contactUsFormSchema.partial().omit({
  repeatEmail: true,
});

export const contactUsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ContactFormData = z.infer<typeof contactUsFormSchema>;
export type UpdateContactFormData = z.infer<typeof updateContactUsFormSchema>;
export type ContactQueryParams = z.infer<typeof contactUsQuerySchema>;

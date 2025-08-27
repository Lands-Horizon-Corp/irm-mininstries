import { z } from "zod";

export const churchSchema = z.object({
  name: z
    .string()
    .min(1, "Church name is required")
    .max(100, "Church name is too long"),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  longitude: z
    .string()
    .regex(
      /^-?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/,
      "Please enter a valid longitude (-180 to 180)"
    )
    .optional()
    .or(z.literal("")),
  latitude: z
    .string()
    .regex(
      /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
      "Please enter a valid latitude (-90 to 90)"
    )
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address too long")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(1000, "Description too long")
    .optional()
    .or(z.literal("")),
});

export const updateChurchSchema = churchSchema.partial();

export const churchQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ChurchFormData = z.infer<typeof churchSchema>;
export type UpdateChurchFormData = z.infer<typeof updateChurchSchema>;
export type ChurchQueryParams = z.infer<typeof churchQuerySchema>;

export interface Church {
  id: number;
  name: string;
  imageUrl?: string | null;
  longitude?: string | null;
  latitude?: string | null;
  address?: string | null;
  email?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

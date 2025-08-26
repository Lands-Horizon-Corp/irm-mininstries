import { z } from "zod";

export const churchSchema = z.object({
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Please enter a valid URL"),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .regex(
      /^-?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/,
      "Please enter a valid longitude (-180 to 180)"
    ),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .regex(
      /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
      "Please enter a valid latitude (-90 to 90)"
    ),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address too long"),
  email: z.string().email("Please enter a valid email address"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description too long"),
});

export type ChurchFormData = z.infer<typeof churchSchema>;

export interface Church {
  id: number;
  imageUrl: string;
  longitude: string;
  latitude: string;
  address: string;
  email: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

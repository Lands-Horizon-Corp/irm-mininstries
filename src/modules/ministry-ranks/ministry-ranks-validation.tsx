import { z } from "zod";

export const ministryRanksSchema = z.object({
  name: z
    .string()
    .min(1, "Ministry rank name is required")
    .max(100, "Name is too long (maximum 100 characters)")
    .trim()
    .refine((val) => val.length > 0, "Ministry rank name cannot be empty"),
  description: z
    .string()
    .max(500, "Description is too long (maximum 500 characters)")
    .optional()
    .or(z.literal("")),
});

export const updateMinistryRanksSchema = ministryRanksSchema.partial();

export const ministryRankQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type MinistryRanksFormData = z.infer<typeof ministryRanksSchema>;
export type UpdateMinistryRanksFormData = z.infer<
  typeof updateMinistryRanksSchema
>;
export type MinistryRankQueryParams = z.infer<typeof ministryRankQuerySchema>;

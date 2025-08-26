import { z } from "zod";

export const ministryRanksSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
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

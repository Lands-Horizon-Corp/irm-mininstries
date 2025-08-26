import { z } from "zod";

export const ministrySkillsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
});

export const updateMinistrySkillsSchema = ministrySkillsSchema.partial();

export const ministrySkillQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type MinistrySkillsFormData = z.infer<typeof ministrySkillsSchema>;
export type UpdateMinistrySkillsFormData = z.infer<
  typeof updateMinistrySkillsSchema
>;
export type MinistrySkillQueryParams = z.infer<typeof ministrySkillQuerySchema>;

import { z } from "zod";

export const ministrySkillsSchema = z.object({
  name: z
    .string()
    .min(1, "Ministry skill name is required")
    .max(100, "Name is too long (maximum 100 characters)")
    .trim()
    .refine((val) => val.length > 0, "Ministry skill name cannot be empty"),
  description: z
    .string()
    .max(500, "Description is too long (maximum 500 characters)")
    .trim()
    .refine((val) => val.length > 0, "Description cannot be empty"),
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

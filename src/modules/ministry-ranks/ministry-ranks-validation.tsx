import { z } from "zod";

export const ministryRanksSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
});

export type MinistryRanksFormData = z.infer<typeof ministryRanksSchema>;

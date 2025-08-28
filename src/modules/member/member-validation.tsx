import { z } from "zod";

export const memberSchema = z.object({
  id: z.number().int().optional(),

  // Profile Information
  profilePicture: z.string().optional().nullable(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional().nullable(),
  gender: z.enum(["male", "female"]),
  birthdate: z.string().min(1, { message: "Birthdate is required" }), // Use string for date input
  yearJoined: z.coerce
    .number()
    .int()
    .min(1900, { message: "Invalid year" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),

  // Ministry & Work Information
  ministryInvolvement: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),

  // Educational Information
  educationalAttainment: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),

  // Contact Information
  mobileNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  homeAddress: z.string().optional().nullable(),

  // Social Media Links
  facebookLink: z.string().optional().nullable(),
  xLink: z.string().optional().nullable(),
  instagramLink: z.string().optional().nullable(),

  // Additional Information
  notes: z.string().optional().nullable(),

  // Timestamps
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateMemberSchema = memberSchema.partial();

export const memberQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Member = z.infer<typeof memberSchema>;
export type UpdateMember = z.infer<typeof updateMemberSchema>;
export type MemberQueryParams = z.infer<typeof memberQuerySchema>;

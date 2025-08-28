import { z } from "zod";

export const ministerSchema = z.object({
  id: z.number().int().optional(),

  // ==================== STEP 1: PERSONAL INFORMATION ====================
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  heightFeet: z.string(),
  weightKg: z.string(),
  civilStatus: z.enum([
    "single",
    "married",
    "widowed",
    "separated",
    "divorced",
  ]),
  imageUrl: z.string().optional().nullable(),

  // ==================== STEP 2: CONTACT INFORMATION & Government IDs ====================
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  address: z.string(),
  presentAddress: z.string(),
  permanentAddress: z.string().optional().nullable(),

  passportNumber: z.string().optional().nullable(),
  sssNumber: z.string().optional().nullable(),
  philhealth: z.string().optional().nullable(),
  tin: z.string().optional().nullable(),

  // ==================== STEP 3: FAMILY & SPOUSE INFORMATION (INCLUDING CHILDREN) ====================
  // Family Information
  fatherName: z.string(),
  fatherProvince: z.string(),
  fatherBirthday: z.coerce.date(),
  fatherOccupation: z.string(),
  motherName: z.string(),
  motherProvince: z.string(),
  motherBirthday: z.coerce.date(),
  motherOccupation: z.string(),

  // Spouse Information
  spouseName: z.string().optional().nullable(),
  spouseProvince: z.string().optional().nullable(),
  spouseBirthday: z.coerce.date().optional().nullable(),
  spouseOccupation: z.string().optional().nullable(),
  weddingDate: z.coerce.date().optional().nullable(),

  // Children information (part of family info)
  children: z
    .array(
      z.object({
        id: z.number().int().optional(),
        name: z.string(),
        placeOfBirth: z.string(),
        dateOfBirth: z.coerce.date(),
        gender: z.enum(["male", "female"]),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // ==================== STEP 4: EMERGENCY CONTACTS & SKILLS/INTERESTS ====================
  // Emergency Contacts
  emergencyContacts: z
    .array(
      z.object({
        id: z.number().int().optional(),
        name: z.string(),
        relationship: z.string(),
        address: z.string(),
        contactNumber: z.string(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // Skills & Interests
  skills: z.string().optional().nullable(),
  hobbies: z.string().optional().nullable(),
  sports: z.string().optional().nullable(),
  otherReligiousSecularTraining: z.string().optional().nullable(),

  // ==================== STEP 5: EDUCATION & EMPLOYMENT BACKGROUND ====================
  // Education Background
  educationBackgrounds: z
    .array(
      z.object({
        id: z.number().int().optional(),
        schoolName: z.string(),
        educationalAttainment: z.string(),
        dateGraduated: z.coerce.date().optional().nullable(),
        description: z.string().optional().nullable(),
        course: z.string().optional().nullable(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // Employment Records
  employmentRecords: z
    .array(
      z.object({
        id: z.number().int().optional(),
        companyName: z.string(),
        fromYear: z.string(),
        toYear: z.string().optional().nullable(),
        position: z.string(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // ==================== STEP 6: MINISTRY EXPERIENCE & SKILLS ====================
  // Ministry Experience
  ministryExperiences: z
    .array(
      z.object({
        id: z.number().int().optional(),
        ministryRankId: z.number().int(),
        description: z.string().optional().nullable(),
        fromYear: z.string(),
        toYear: z.string().optional().nullable(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // Ministry Skills
  ministrySkills: z
    .array(
      z.object({
        id: z.number().int().optional(),
        ministrySkillId: z.number().int(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // ==================== STEP 7: MINISTRY RECORDS & AWARDS/RECOGNITIONS ====================
  // Ministry Records
  ministryRecords: z
    .array(
      z.object({
        id: z.number().int().optional(),
        churchLocationId: z.number().int(),
        fromYear: z.string(),
        toYear: z.string().optional().nullable(),
        contribution: z.string().optional().nullable(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // Awards & Recognitions
  awardsRecognitions: z
    .array(
      z.object({
        id: z.number().int().optional(),
        year: z.string(),
        description: z.string(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // ==================== STEP 8: SEMINARS & CONFERENCES ====================
  seminarsConferences: z
    .array(
      z.object({
        id: z.number().int().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        place: z.string().optional().nullable(),
        year: z.string(),
        numberOfHours: z.number().int(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  // ==================== STEP 9: CERTIFICATION & SIGNATURES ====================
  caseReports: z
    .array(
      z.object({
        id: z.number().int().optional(),
        description: z.string().min(1, { message: "Description is required" }),
        year: z.string().min(1, { message: "Year is required" }),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),

  certifiedBy: z.string().optional().nullable(),
  signatureImageUrl: z.string().optional().nullable(),
  signatureByCertifiedImageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const updateMinisterSchema = ministerSchema.partial();

export const ministerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Minister = z.infer<typeof ministerSchema>;
export type UpdateMinister = z.infer<typeof updateMinisterSchema>;
export type MinisterQueryParams = z.infer<typeof ministerQuerySchema>;

export interface StepProps {
  formData: Minister;
  updateFormData: (
    field: keyof FormData,
    value: string | Date | boolean | Minister
  ) => void;
  updateMinisterData: (
    field: keyof Minister,
    value: string | boolean | Date | string[] | File | null
  ) => void;
  onNext: (
    updatedMinister?: Minister,
    confirmation?: boolean
  ) => void | Promise<void>;
  onBack?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

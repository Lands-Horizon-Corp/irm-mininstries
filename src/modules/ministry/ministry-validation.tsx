import { z } from "zod";

export const ministerSchema = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string(),
  address: z.string(),
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
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
  sssNumber: z.string().optional().nullable(),
  philhealth: z.string().optional().nullable(),
  tin: z.string().optional().nullable(),
  presentAddress: z.string(),
  permanentAddress: z.string().optional().nullable(),
  fatherName: z.string(),
  fatherProvince: z.string(),
  fatherBirthday: z.coerce.date(),
  fatherOccupation: z.string(),
  motherName: z.string(),
  motherProvince: z.string(),
  motherBirthday: z.coerce.date(),
  motherOccupation: z.string(),
  spouseName: z.string().optional().nullable(),
  spouseProvince: z.string().optional().nullable(),
  spouseBirthday: z.coerce.date().optional().nullable(),
  spouseOccupation: z.string().optional().nullable(),
  weddingDate: z.coerce.date().optional().nullable(),
  skills: z.string().optional().nullable(),
  hobbies: z.string().optional().nullable(),
  sports: z.string().optional().nullable(),
  otherReligiousSecularTraining: z.string().optional().nullable(),
  certifiedBy: z.string().optional().nullable(),
  signatureImageUrl: z.string().optional().nullable(),
  signatureByCertifiedImageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  imageUrl: z.string().optional().nullable(),
  // Relations
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
  ministryExperiences: z
    .array(
      z.object({
        id: z.number().int().optional(),
        title: z.string(),
        description: z.string().optional().nullable(),
        fromYear: z.string(),
        toYear: z.string().optional().nullable(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),
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
  employmentRecords: z
    .array(
      z.object({
        id: z.number().int().optional(),
        companyName: z.string(),
        fromYear: z.string(),
        toYear: z.string(),
        position: z.string(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .optional(),
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
});

export type Minister = z.infer<typeof ministerSchema>;

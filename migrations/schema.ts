import {
  pgTable,
  integer,
  text,
  timestamp,
  unique,
  varchar,
  foreignKey,
  date,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const contactSubmissions = pgTable("contact_submissions", {
  id: integer()
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "contact_submissions_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
  name: text().notNull(),
  email: text().notNull(),
  subject: text().notNull(),
  description: text().notNull(),
  prayerRequest: text("prayer_request"),
  supportEmail: text("support_email").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const churches = pgTable(
  "churches",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "churches_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: text().notNull(),
    imageUrl: text("image_url"),
    longitude: text(),
    latitude: text(),
    address: text(),
    email: text(),
    description: text(),
    link: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("churches_name_unique").on(table.name)]
);

export const members = pgTable(
  "members",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "members_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    churchId: integer("church_id").notNull(),
    profilePicture: text("profile_picture"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    middleName: text("middle_name"),
    gender: text().notNull(),
    birthdate: date().notNull(),
    yearJoined: integer("year_joined").notNull(),
    ministryInvolvement: text("ministry_involvement"),
    occupation: text(),
    educationalAttainment: text("educational_attainment"),
    school: text(),
    degree: text(),
    mobileNumber: text("mobile_number"),
    email: text(),
    homeAddress: text("home_address"),
    facebookLink: text("facebook_link"),
    xLink: text("x_link"),
    instagramLink: text("instagram_link"),
    tiktokLink: text("tiktok_link"),
    notes: text(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.churchId],
      foreignColumns: [churches.id],
      name: "members_church_id_churches_id_fk",
    }),
  ]
);

export const ministers = pgTable(
  "ministers",
  {
    id: serial().primaryKey().notNull(),
    churchId: integer("church_id").notNull(),
    biography: text(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    middleName: text("middle_name"),
    suffix: text(),
    nickname: text(),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }).notNull(),
    placeOfBirth: text("place_of_birth").notNull(),
    address: text().notNull(),
    gender: text().notNull(),
    heightFeet: text("height_feet").notNull(),
    weightKg: text("weight_kg").notNull(),
    civilStatus: text("civil_status").notNull(),
    email: text(),
    telephone: text(),
    passportNumber: text("passport_number"),
    sssNumber: text("sss_number"),
    philhealth: text(),
    tin: text(),
    presentAddress: text("present_address").notNull(),
    permanentAddress: text("permanent_address"),
    fatherName: text("father_name").notNull(),
    fatherProvince: text("father_province").notNull(),
    fatherBirthday: timestamp("father_birthday", { mode: "string" }).notNull(),
    fatherOccupation: text("father_occupation").notNull(),
    motherName: text("mother_name").notNull(),
    motherProvince: text("mother_province").notNull(),
    motherBirthday: timestamp("mother_birthday", { mode: "string" }).notNull(),
    motherOccupation: text("mother_occupation").notNull(),
    spouseName: text("spouse_name"),
    spouseProvince: text("spouse_province"),
    spouseBirthday: timestamp("spouse_birthday", { mode: "string" }),
    spouseOccupation: text("spouse_occupation"),
    weddingDate: timestamp("wedding_date", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    skills: text(),
    hobbies: text(),
    sports: text(),
    otherReligiousSecularTraining: text("other_religious_secular_training"),
    certifiedBy: text("certified_by"),
    signatureImageUrl: text("signature_image_url"),
    signatureByCertifiedImageUrl: text("signature_by_certified_image_url"),
    imageUrl: text("image_url"),
  },
  (table) => [
    foreignKey({
      columns: [table.churchId],
      foreignColumns: [churches.id],
      name: "ministers_church_id_churches_id_fk",
    }),
  ]
);

export const ministerAwardsRecognitions = pgTable(
  "minister_awards_recognitions",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    year: text().notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_awards_recognitions_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerCaseReports = pgTable(
  "minister_case_reports",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    description: text().notNull(),
    year: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_case_reports_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerChildren = pgTable(
  "minister_children",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    name: text().notNull(),
    placeOfBirth: text("place_of_birth").notNull(),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }).notNull(),
    gender: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_children_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerEducationBackgrounds = pgTable(
  "minister_education_backgrounds",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    schoolName: text("school_name").notNull(),
    educationalAttainment: text("educational_attainment").notNull(),
    dateGraduated: timestamp("date_graduated", { mode: "string" }),
    description: text(),
    course: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_education_backgrounds_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerEmergencyContacts = pgTable(
  "minister_emergency_contacts",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    name: text().notNull(),
    relationship: text().notNull(),
    address: text().notNull(),
    contactNumber: text("contact_number").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_emergency_contacts_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerEmploymentRecords = pgTable(
  "minister_employment_records",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    companyName: text("company_name").notNull(),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    position: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_employment_records_minister_id_ministers_id_fk",
    }),
  ]
);

export const ministerMinistryExperiences = pgTable(
  "minister_ministry_experiences",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    ministryRankId: integer("ministry_rank_id").notNull(),
    description: text(),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_ministry_experiences_minister_id_ministers_id_fk",
    }),
    foreignKey({
      columns: [table.ministryRankId],
      foreignColumns: [ministryRanks.id],
      name: "minister_ministry_experiences_ministry_rank_id_ministry_ranks_i",
    }),
  ]
);

export const ministryRanks = pgTable(
  "ministry_ranks",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ministry_ranks_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("ministry_ranks_name_unique").on(table.name)]
);

export const ministerMinistryRecords = pgTable(
  "minister_ministry_records",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    churchLocationId: integer("church_location_id").notNull(),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    contribution: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_ministry_records_minister_id_ministers_id_fk",
    }),
    foreignKey({
      columns: [table.churchLocationId],
      foreignColumns: [churches.id],
      name: "minister_ministry_records_church_location_id_churches_id_fk",
    }),
  ]
);

export const ministerMinistrySkills = pgTable(
  "minister_ministry_skills",
  {
    id: serial().primaryKey().notNull(),
    ministerId: integer("minister_id").notNull(),
    ministrySkillId: integer("ministry_skill_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_ministry_skills_minister_id_ministers_id_fk",
    }),
    foreignKey({
      columns: [table.ministrySkillId],
      foreignColumns: [ministrySkills.id],
      name: "minister_ministry_skills_ministry_skill_id_ministry_skills_id_f",
    }),
  ]
);

export const ministrySkills = pgTable(
  "ministry_skills",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ministry_skills_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: text().notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("ministry_skills_name_unique").on(table.name)]
);

export const ministerSeminarsConferences = pgTable(
  "minister_seminars_conferences",
  {
    id: serial().primaryKey().notNull(),
    ministerId: serial("minister_id").notNull(),
    title: text().notNull(),
    description: text(),
    place: text(),
    year: text().notNull(),
    numberOfHours: serial("number_of_hours").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ministerId],
      foreignColumns: [ministers.id],
      name: "minister_seminars_conferences_minister_id_ministers_id_fk",
    }),
  ]
);

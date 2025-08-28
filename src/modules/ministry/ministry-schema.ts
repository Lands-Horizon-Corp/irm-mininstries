import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { churches } from "../church/church-schema";
import { ministryRanks } from "../ministry-ranks/ministry-ranks-schema";
import { ministrySkills } from "../ministry-skills/ministry-skills-schema";

export const genderEnum = text("gender", { enum: ["male", "female"] });
export const civilStatusEnum = text("civil_status", {
  enum: ["single", "married", "widowed", "separated", "divorced"],
});

export const ministers = pgTable("ministers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  suffix: text("suffix"),
  nickname: text("nickname"),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  address: text("address").notNull(),
  gender: genderEnum.notNull(),
  heightFeet: text("height_feet").notNull(),
  weightKg: text("weight_kg").notNull(),
  civilStatus: civilStatusEnum.notNull(),
  email: text("email"),
  telephone: text("telephone"),
  passportNumber: text("passport_number"),
  sssNumber: text("sss_number"),
  philhealth: text("philhealth"),
  tin: text("tin"),
  presentAddress: text("present_address").notNull(),
  permanentAddress: text("permanent_address"),

  // Family info
  fatherName: text("father_name").notNull(),
  fatherProvince: text("father_province").notNull(),
  fatherBirthday: timestamp("father_birthday").notNull(),
  fatherOccupation: text("father_occupation").notNull(),
  motherName: text("mother_name").notNull(),
  motherProvince: text("mother_province").notNull(),
  motherBirthday: timestamp("mother_birthday").notNull(),
  motherOccupation: text("mother_occupation").notNull(),
  spouseName: text("spouse_name"),
  spouseProvince: text("spouse_province"),
  spouseBirthday: timestamp("spouse_birthday"),
  spouseOccupation: text("spouse_occupation"),
  weddingDate: timestamp("wedding_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Additional fields
  skills: text("skills"),
  hobbies: text("hobbies"),
  sports: text("sports"),
  otherReligiousSecularTraining: text("other_religious_secular_training"),
  certifiedBy: text("certified_by"),
  signatureImageUrl: text("signature_image_url"),
  signatureByCertifiedImageUrl: text("signature_by_certified_image_url"),
  imageUrl: text("image_url"),
});

export const ministerChildren = pgTable("minister_children", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .notNull()
    .references(() => ministers.id),
  name: text("name").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum.notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ministerEmergencyContacts = pgTable(
  "minister_emergency_contacts",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .notNull()
      .references(() => ministers.id),
    name: text("name").notNull(),
    relationship: text("relationship").notNull(),
    address: text("address").notNull(),
    contactNumber: text("contact_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerEducationBackgrounds = pgTable(
  "minister_education_backgrounds",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .notNull()
      .references(() => ministers.id),
    schoolName: text("school_name").notNull(),
    educationalAttainment: text("educational_attainment").notNull(),
    dateGraduated: timestamp("date_graduated"),
    description: text("description"),
    course: text("course"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerMinistryExperiences = pgTable(
  "minister_ministry_experiences",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .notNull()
      .references(() => ministers.id),
    ministryRankId: integer("ministry_rank_id")
      .notNull()
      .references(() => ministryRanks.id),
    description: text("description"),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerMinistrySkills = pgTable("minister_ministry_skills", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .notNull()
    .references(() => ministers.id),
  ministrySkillId: integer("ministry_skill_id")
    .notNull()
    .references(() => ministrySkills.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ministerMinistryRecords = pgTable("minister_ministry_records", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .notNull()
    .references(() => ministers.id),
  churchLocationId: integer("church_location_id")
    .notNull()
    .references(() => churches.id),
  fromYear: text("from_year").notNull(),
  toYear: text("to_year"),
  contribution: text("contribution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ministerAwardsRecognitions = pgTable(
  "minister_awards_recognitions",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .notNull()
      .references(() => ministers.id),
    year: text("year").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerEmploymentRecords = pgTable(
  "minister_employment_records",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .notNull()
      .references(() => ministers.id),
    companyName: text("company_name").notNull(),
    fromYear: text("from_year").notNull(),
    toYear: text("to_year"),
    position: text("position").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerSeminarsConferences = pgTable(
  "minister_seminars_conferences",
  {
    id: serial("id").primaryKey(),
    ministerId: serial("minister_id")
      .notNull()
      .references(() => ministers.id),
    title: text("title").notNull(),
    description: text("description"),
    place: text("place"),
    year: text("year").notNull(),
    numberOfHours: serial("number_of_hours").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const ministerCaseReports = pgTable("minister_case_reports", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .notNull()
    .references(() => ministers.id),
  description: text("description").notNull(),
  year: text("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

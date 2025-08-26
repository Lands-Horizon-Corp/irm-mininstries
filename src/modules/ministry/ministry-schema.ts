import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Main Ministers Table (matching actual database structure)
export const ministers = pgTable("ministers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  civilStatus: varchar("civil_status", { length: 50 }).notNull(),
  citizenship: varchar("citizenship", { length: 100 }).notNull(),
  fatherName: varchar("father_name", { length: 255 }),
  fatherOccupation: varchar("father_occupation", { length: 255 }),
  motherName: varchar("mother_name", { length: 255 }),
  motherOccupation: varchar("mother_occupation", { length: 255 }),
  spouseName: varchar("spouse_name", { length: 255 }),
  spouseOccupation: varchar("spouse_occupation", { length: 255 }),
  spouseDateOfBirth: date("spouse_date_of_birth"),
  spousePlaceOfBirth: varchar("spouse_place_of_birth", { length: 255 }),
  spouseNationality: varchar("spouse_nationality", { length: 100 }),
  spouseCitizenship: varchar("spouse_citizenship", { length: 100 }),
  spouseContactNumber: varchar("spouse_contact_number", { length: 50 }),
  spouseEmail: varchar("spouse_email", { length: 255 }),
  ministryStatus: varchar("ministry_status", { length: 100 }).notNull(),
  roleInChurch: varchar("role_in_church", { length: 255 }),
  currentChurch: varchar("current_church", { length: 255 }),
  homeChurch: varchar("home_church", { length: 255 }),
  conversionDate: date("conversion_date"),
  waterBaptismDate: date("water_baptism_date"),
  holyGhostBaptismDate: date("holy_ghost_baptism_date"),
  occupation: varchar("occupation", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  yearStarted: varchar("year_started", { length: 10 }),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); // Children Table
export const ministerChildren = pgTable("minister_children", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .references(() => ministers.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // 'male' or 'female'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Emergency Contacts Table
export const ministerEmergencyContacts = pgTable(
  "minister_emergency_contacts",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    relationship: varchar("relationship", { length: 100 }).notNull(),
    address: varchar("address", { length: 500 }).notNull(),
    contactNumber: varchar("contact_number", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Education Backgrounds Table
export const ministerEducationBackgrounds = pgTable(
  "minister_education_backgrounds",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    schoolName: varchar("school_name", { length: 255 }).notNull(),
    educationalAttainment: varchar("educational_attainment", {
      length: 255,
    }).notNull(),
    dateGraduated: date("date_graduated"),
    description: text("description"),
    course: varchar("course", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Ministry Experiences Table
export const ministerMinistryExperiences = pgTable(
  "minister_ministry_experiences",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    fromYear: varchar("from_year", { length: 10 }).notNull(),
    toYear: varchar("to_year", { length: 10 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Minister Ministry Skills Junction Table
export const ministerMinistrySkills = pgTable("minister_ministry_skills", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .references(() => ministers.id)
    .notNull(),
  ministrySkillId: integer("ministry_skill_id").notNull(), // References ministrySkills table
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ministry Records Table
export const ministerMinistryRecords = pgTable("minister_ministry_records", {
  id: serial("id").primaryKey(),
  ministerId: integer("minister_id")
    .references(() => ministers.id)
    .notNull(),
  churchLocationId: integer("church_location_id").notNull(), // References churches table
  fromYear: varchar("from_year", { length: 10 }).notNull(),
  toYear: varchar("to_year", { length: 10 }),
  contribution: text("contribution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Awards and Recognitions Table
export const ministerAwardsRecognitions = pgTable(
  "minister_awards_recognitions",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    year: varchar("year", { length: 10 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Employment Records Table
export const ministerEmploymentRecords = pgTable(
  "minister_employment_records",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    fromYear: varchar("from_year", { length: 10 }).notNull(),
    toYear: varchar("to_year", { length: 10 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Seminars and Conferences Table
export const ministerSeminarsConferences = pgTable(
  "minister_seminars_conferences",
  {
    id: serial("id").primaryKey(),
    ministerId: integer("minister_id")
      .references(() => ministers.id)
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    place: varchar("place", { length: 255 }),
    year: varchar("year", { length: 10 }).notNull(),
    numberOfHours: integer("number_of_hours").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Relations
export const ministersRelations = relations(ministers, ({ many }) => ({
  children: many(ministerChildren),
  emergencyContacts: many(ministerEmergencyContacts),
  educationBackgrounds: many(ministerEducationBackgrounds),
  ministryExperiences: many(ministerMinistryExperiences),
  ministrySkills: many(ministerMinistrySkills),
  ministryRecords: many(ministerMinistryRecords),
  awardsRecognitions: many(ministerAwardsRecognitions),
  employmentRecords: many(ministerEmploymentRecords),
  seminarsConferences: many(ministerSeminarsConferences),
}));

export const ministerChildrenRelations = relations(
  ministerChildren,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerChildren.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEmergencyContactsRelations = relations(
  ministerEmergencyContacts,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEmergencyContacts.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEducationBackgroundsRelations = relations(
  ministerEducationBackgrounds,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEducationBackgrounds.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerMinistryExperiencesRelations = relations(
  ministerMinistryExperiences,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistryExperiences.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerMinistrySkillsRelations = relations(
  ministerMinistrySkills,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistrySkills.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerMinistryRecordsRelations = relations(
  ministerMinistryRecords,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistryRecords.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerAwardsRecognitionsRelations = relations(
  ministerAwardsRecognitions,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerAwardsRecognitions.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEmploymentRecordsRelations = relations(
  ministerEmploymentRecords,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEmploymentRecords.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerSeminarsConferencesRelations = relations(
  ministerSeminarsConferences,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerSeminarsConferences.ministerId],
      references: [ministers.id],
    }),
  })
);

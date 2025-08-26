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

// Main Members Table
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // 'male' or 'female'

  // Contact Information
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),

  // Personal Information
  nationality: varchar("nationality", { length: 100 }).notNull(),
  civilStatus: varchar("civil_status", { length: 50 }).notNull(),
  citizenship: varchar("citizenship", { length: 100 }).notNull(),

  // Parents Information
  fatherName: varchar("father_name", { length: 255 }),
  fatherOccupation: varchar("father_occupation", { length: 255 }),
  motherName: varchar("mother_name", { length: 255 }),
  motherOccupation: varchar("mother_occupation", { length: 255 }),

  // Spouse Information (if married)
  spouseName: varchar("spouse_name", { length: 255 }),
  spouseOccupation: varchar("spouse_occupation", { length: 255 }),
  spouseDateOfBirth: date("spouse_date_of_birth"),
  spousePlaceOfBirth: varchar("spouse_place_of_birth", { length: 255 }),
  spouseNationality: varchar("spouse_nationality", { length: 100 }),
  spouseCitizenship: varchar("spouse_citizenship", { length: 100 }),
  spouseContactNumber: varchar("spouse_contact_number", { length: 50 }),
  spouseEmail: varchar("spouse_email", { length: 255 }),

  // Ministry Information
  ministryStatus: varchar("ministry_status", { length: 100 }).notNull(),
  roleInChurch: varchar("role_in_church", { length: 255 }),
  currentChurch: varchar("current_church", { length: 255 }),
  homeChurch: varchar("home_church", { length: 255 }),
  conversionDate: date("conversion_date"),
  waterBaptismDate: date("water_baptism_date"),
  holyGhostBaptismDate: date("holy_ghost_baptism_date"),

  // Professional Information
  occupation: varchar("occupation", { length: 255 }),
  companyName: varchar("company_name", { length: 255 }),
  yearStarted: varchar("year_started", { length: 10 }),

  // Additional Information
  imageUrl: varchar("image_url", { length: 500 }),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Children Table
export const memberChildren = pgTable("member_children", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // 'male' or 'female'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Emergency Contacts Table
export const memberEmergencyContacts = pgTable("member_emergency_contacts", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  contactNumber: varchar("contact_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Education Backgrounds Table
export const memberEducationBackgrounds = pgTable(
  "member_education_backgrounds",
  {
    id: serial("id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.id)
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
export const memberMinistryExperiences = pgTable(
  "member_ministry_experiences",
  {
    id: serial("id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.id)
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    fromYear: varchar("from_year", { length: 10 }).notNull(),
    toYear: varchar("to_year", { length: 10 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Member Ministry Skills Junction Table
export const memberMinistrySkills = pgTable("member_ministry_skills", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  ministrySkillId: integer("ministry_skill_id").notNull(), // References ministrySkills table
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ministry Records Table
export const memberMinistryRecords = pgTable("member_ministry_records", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  churchLocationId: integer("church_location_id").notNull(), // References churches table
  fromYear: varchar("from_year", { length: 10 }).notNull(),
  toYear: varchar("to_year", { length: 10 }),
  contribution: text("contribution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Awards and Recognitions Table
export const memberAwardsRecognitions = pgTable("member_awards_recognitions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Employment Records Table
export const memberEmploymentRecords = pgTable("member_employment_records", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  fromYear: varchar("from_year", { length: 10 }).notNull(),
  toYear: varchar("to_year", { length: 10 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Seminars and Conferences Table
export const memberSeminarsConferences = pgTable(
  "member_seminars_conferences",
  {
    id: serial("id").primaryKey(),
    memberId: integer("member_id")
      .references(() => members.id)
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
export const membersRelations = relations(members, ({ many }) => ({
  children: many(memberChildren),
  emergencyContacts: many(memberEmergencyContacts),
  educationBackgrounds: many(memberEducationBackgrounds),
  ministryExperiences: many(memberMinistryExperiences),
  ministrySkills: many(memberMinistrySkills),
  ministryRecords: many(memberMinistryRecords),
  awardsRecognitions: many(memberAwardsRecognitions),
  employmentRecords: many(memberEmploymentRecords),
  seminarsConferences: many(memberSeminarsConferences),
}));

export const memberChildrenRelations = relations(memberChildren, ({ one }) => ({
  member: one(members, {
    fields: [memberChildren.memberId],
    references: [members.id],
  }),
}));

export const memberEmergencyContactsRelations = relations(
  memberEmergencyContacts,
  ({ one }) => ({
    member: one(members, {
      fields: [memberEmergencyContacts.memberId],
      references: [members.id],
    }),
  })
);

export const memberEducationBackgroundsRelations = relations(
  memberEducationBackgrounds,
  ({ one }) => ({
    member: one(members, {
      fields: [memberEducationBackgrounds.memberId],
      references: [members.id],
    }),
  })
);

export const memberMinistryExperiencesRelations = relations(
  memberMinistryExperiences,
  ({ one }) => ({
    member: one(members, {
      fields: [memberMinistryExperiences.memberId],
      references: [members.id],
    }),
  })
);

export const memberMinistrySkillsRelations = relations(
  memberMinistrySkills,
  ({ one }) => ({
    member: one(members, {
      fields: [memberMinistrySkills.memberId],
      references: [members.id],
    }),
  })
);

export const memberMinistryRecordsRelations = relations(
  memberMinistryRecords,
  ({ one }) => ({
    member: one(members, {
      fields: [memberMinistryRecords.memberId],
      references: [members.id],
    }),
  })
);

export const memberAwardsRecognitionsRelations = relations(
  memberAwardsRecognitions,
  ({ one }) => ({
    member: one(members, {
      fields: [memberAwardsRecognitions.memberId],
      references: [members.id],
    }),
  })
);

export const memberEmploymentRecordsRelations = relations(
  memberEmploymentRecords,
  ({ one }) => ({
    member: one(members, {
      fields: [memberEmploymentRecords.memberId],
      references: [members.id],
    }),
  })
);

export const memberSeminarsConferencesRelations = relations(
  memberSeminarsConferences,
  ({ one }) => ({
    member: one(members, {
      fields: [memberSeminarsConferences.memberId],
      references: [members.id],
    }),
  })
);

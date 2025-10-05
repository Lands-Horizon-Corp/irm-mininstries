import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { churches } from "../church/church-schema";

export const members = pgTable("members", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

  // Church Association
  churchId: integer("church_id")
    .references(() => churches.id)
    .notNull(),

  // Profile Information
  profilePicture: text("profile_picture"), // URL to profile image (recommended) or base64 data
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  birthdate: date("birthdate").notNull(),
  yearJoined: integer("year_joined").notNull(),

  // Ministry & Work Information
  ministryInvolvement: text("ministry_involvement"), // Description
  occupation: text("occupation"),

  // Educational Information
  educationalAttainment: text("educational_attainment"), // Highest level achieved
  school: text("school"),
  degree: text("degree"),

  // Contact Information
  mobileNumber: text("mobile_number"),
  email: text("email"),
  homeAddress: text("home_address"),

  // Social Media Links
  facebookLink: text("facebook_link"), // Can be URL or username
  xLink: text("x_link"), // Can be URL or username
  instagramLink: text("instagram_link"), // Can be URL or username

  // Additional Information
  notes: text("notes"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

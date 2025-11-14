import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  maritalStatus: text("marital_status", {
    enum: ["single", "married", "separated", "widowed"],
  })
    .default("single")
    .notNull(),

  // Ministry & Work Information
  ministryInvolvement: text("ministry_involvement"), // Description
  occupation: text("occupation"),
  organization: text("organization"),

  // Life Group Information
  isLifegroupLeader: boolean("is_lifegroup_leader").default(false).notNull(),
  lifegroupLeaderId: integer("lifegroup_leader_id"),

  // Educational Informationca
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
  tiktokLink: text("tiktok_link"), // Can be URL or username

  // Additional Information
  notes: text("notes"),

  // Status
  isActive: boolean("is_active").default(true).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

// Relations
export const membersRelations = relations(members, ({ one, many }) => ({
  church: one(churches, {
    fields: [members.churchId],
    references: [churches.id],
  }),
  lifegroupLeader: one(members, {
    fields: [members.lifegroupLeaderId],
    references: [members.id],
  }),
  lifegroupMembers: many(members),
}));

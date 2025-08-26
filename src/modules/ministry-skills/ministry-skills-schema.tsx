import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ministrySkills = pgTable("ministry_skills", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MinistrySkill = typeof ministrySkills.$inferSelect;
export type NewMinistrySkill = typeof ministrySkills.$inferInsert;

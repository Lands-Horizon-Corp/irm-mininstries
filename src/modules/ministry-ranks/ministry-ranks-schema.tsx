import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ministryRanks = pgTable("ministry_ranks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MinistryRank = typeof ministryRanks.$inferSelect;
export type NewMinistryRank = typeof ministryRanks.$inferInsert;

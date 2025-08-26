import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const churches = pgTable("churches", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  imageUrl: text("image_url").notNull(),
  longitude: text("longitude").notNull(),
  latitude: text("latitude").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Church = typeof churches.$inferSelect;
export type NewChurch = typeof churches.$inferInsert;

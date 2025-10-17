import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const churches = pgTable("churches", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").unique().notNull(),
  imageUrl: text("image_url"),
  longitude: text("longitude"),
  latitude: text("latitude"),
  address: text("address"),
  email: text("email"),
  description: text("description"),
  link: varchar("link", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Church = typeof churches.$inferSelect;
export type NewChurch = typeof churches.$inferInsert;

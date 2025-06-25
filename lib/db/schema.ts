import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const churchCoverPhotos = pgTable("church_cover_photos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

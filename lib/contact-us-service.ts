import { eq } from "drizzle-orm"

import type { ContactUs } from "@/types/common"
import { contactUs, db } from "@/lib/db"

export class ContactUsService {
  static async getAll(): Promise<ContactUs[]> {
    const results = await db.select().from(contactUs)
    return results
  }

  static async getById(id: number): Promise<ContactUs | null> {
    const result = await db.select().from(contactUs).where(eq(contactUs.id, id))
    return result[0] || null
  }

  static async create(
    data: Omit<ContactUs, "id" | "createdAt" | "updatedAt">
  ): Promise<ContactUs> {
    const result = await db.insert(contactUs).values(data).returning()
    return result[0]
  }

  static async update(
    id: number,
    data: Partial<Omit<ContactUs, "id" | "createdAt" | "updatedAt">>
  ): Promise<ContactUs | null> {
    const result = await db
      .update(contactUs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contactUs.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(contactUs)
      .where(eq(contactUs.id, id))
      .returning()
    return result.length > 0
  }
}

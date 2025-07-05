import { eq } from "drizzle-orm"

import type { MinistryRanks } from "@/types/common"
import { db, ministryRanks } from "@/lib/db"

export class MinistryRanksService {
  static async getAll(): Promise<MinistryRanks[]> {
    const results = await db.select().from(ministryRanks)
    return results
  }

  static async getById(id: number): Promise<MinistryRanks | null> {
    const result = await db
      .select()
      .from(ministryRanks)
      .where(eq(ministryRanks.id, id))
    return result[0] || null
  }

  static async create(
    data: Omit<MinistryRanks, "id" | "createdAt" | "updatedAt">
  ): Promise<MinistryRanks> {
    const result = await db.insert(ministryRanks).values(data).returning()
    return result[0]
  }

  static async update(
    id: number,
    data: Partial<Omit<MinistryRanks, "id" | "createdAt" | "updatedAt">>
  ): Promise<MinistryRanks | null> {
    const result = await db
      .update(ministryRanks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ministryRanks.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(ministryRanks)
      .where(eq(ministryRanks.id, id))
      .returning()
    return result.length > 0
  }
}

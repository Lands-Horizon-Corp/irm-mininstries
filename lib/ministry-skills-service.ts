import { eq } from "drizzle-orm"

import type { MinistrySkills } from "@/types/common"
import { db, ministrySkills } from "@/lib/db"

export class MinistrySkillsService {
  static async getAll(): Promise<MinistrySkills[]> {
    const results = await db.select().from(ministrySkills)
    return results
  }

  static async getById(id: number): Promise<MinistrySkills | null> {
    const result = await db
      .select()
      .from(ministrySkills)
      .where(eq(ministrySkills.id, id))
    return result[0] || null
  }

  static async create(
    data: Omit<MinistrySkills, "id" | "createdAt" | "updatedAt">
  ): Promise<MinistrySkills> {
    const result = await db.insert(ministrySkills).values(data).returning()
    return result[0]
  }

  static async update(
    id: number,
    data: Partial<Omit<MinistrySkills, "id" | "createdAt" | "updatedAt">>
  ): Promise<MinistrySkills | null> {
    const result = await db
      .update(ministrySkills)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ministrySkills.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(ministrySkills)
      .where(eq(ministrySkills.id, id))
      .returning()
    return result.length > 0
  }
}

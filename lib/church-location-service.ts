import { eq } from "drizzle-orm"

import type { ChurchLocation } from "@/types/common"
import { churchLocations, db } from "@/lib/db"

export class ChurchLocationService {
  static async getAll(): Promise<ChurchLocation[]> {
    return await db
      .select()
      .from(churchLocations)
      .orderBy(churchLocations.createdAt)
  }

  static async getById(id: number): Promise<ChurchLocation | null> {
    const result = await db
      .select()
      .from(churchLocations)
      .where(eq(churchLocations.id, id))
    return result[0] || null
  }

  static async create(
    data: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchLocation> {
    const result = await db.insert(churchLocations).values(data).returning()
    return result[0]
  }

  static async update(
    id: number,
    data: Partial<Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">>
  ): Promise<ChurchLocation | null> {
    const result = await db
      .update(churchLocations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(churchLocations.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(churchLocations)
      .where(eq(churchLocations.id, id))
      .returning()
    return result.length > 0
  }
}

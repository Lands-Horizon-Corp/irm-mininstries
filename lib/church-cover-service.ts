import { eq } from "drizzle-orm"

import type { ChurchCoverPhoto } from "@/types/common"
import { churchCoverPhotos, db } from "@/lib/db"

export class ChurchCoverService {
  static async getAll(): Promise<ChurchCoverPhoto[]> {
    return await db.select().from(churchCoverPhotos)
  }

  static async getById(id: number): Promise<ChurchCoverPhoto | null> {
    const result = await db
      .select()
      .from(churchCoverPhotos)
      .where(eq(churchCoverPhotos.id, id))
    return result[0] || null
  }

  static async create(
    data: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchCoverPhoto> {
    const result = await db.insert(churchCoverPhotos).values(data).returning()
    return result[0]
  }

  static async update(
    id: number,
    data: Partial<Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">>
  ): Promise<ChurchCoverPhoto | null> {
    const result = await db
      .update(churchCoverPhotos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(churchCoverPhotos.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(churchCoverPhotos)
      .where(eq(churchCoverPhotos.id, id))
      .returning()
    return result.length > 0
  }
}

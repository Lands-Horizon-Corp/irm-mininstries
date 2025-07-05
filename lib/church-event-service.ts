import { eq } from "drizzle-orm"

import type { ChurchEvent } from "@/types/common"
import { churchEvents, db } from "@/lib/db"

export class ChurchEventService {
  static async getAll(): Promise<ChurchEvent[]> {
    const results = await db
      .select()
      .from(churchEvents)
      .orderBy(churchEvents.datetime)
    return results.map(event => ({
      ...event,
      imageUrl: event.imageUrl ?? undefined,
    }))
  }

  static async getById(id: number): Promise<ChurchEvent | null> {
    const result = await db
      .select()
      .from(churchEvents)
      .where(eq(churchEvents.id, id))
    if (!result[0]) return null
    const event = { ...result[0], imageUrl: result[0].imageUrl ?? undefined }
    return event
  }

  static async create(
    data: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchEvent> {
    const result = await db.insert(churchEvents).values(data).returning()
    return { ...result[0], imageUrl: result[0].imageUrl ?? undefined }
  }

  static async update(
    id: number,
    data: Partial<Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">>
  ): Promise<ChurchEvent | null> {
    const result = await db
      .update(churchEvents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(churchEvents.id, id))
      .returning()
    return result[0]
      ? { ...result[0], imageUrl: result[0].imageUrl ?? undefined }
      : null
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(churchEvents)
      .where(eq(churchEvents.id, id))
      .returning()
    return result.length > 0
  }
}

import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { churchEvents, db } from "@/lib/db"

// GET /api/church-events/[id] - Get a specific church event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const event = await db
      .select()
      .from(churchEvents)
      .where(eq(churchEvents.id, id))

    if (event.length === 0) {
      return NextResponse.json(
        { error: "Church event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(event[0])
  } catch (error) {
    console.error("Error fetching church event:", error)
    return NextResponse.json(
      { error: "Failed to fetch church event" },
      { status: 500 }
    )
  }
}

// PUT /api/church-events/[id] - Update a church event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, place, datetime, imageUrl } = body

    if (!name || !description || !place || !datetime) {
      return NextResponse.json(
        { error: "Name, description, place, and datetime are required" },
        { status: 400 }
      )
    }

    // Validate datetime
    const eventDate = new Date(datetime)
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid datetime format" },
        { status: 400 }
      )
    }

    const updatedEvent = await db
      .update(churchEvents)
      .set({
        name,
        description,
        place,
        datetime: eventDate,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(churchEvents.id, id))
      .returning()

    if (updatedEvent.length === 0) {
      return NextResponse.json(
        { error: "Church event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedEvent[0])
  } catch (error) {
    console.error("Error updating church event:", error)
    return NextResponse.json(
      { error: "Failed to update church event" },
      { status: 500 }
    )
  }
}

// DELETE /api/church-events/[id] - Delete a church event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const deletedEvent = await db
      .delete(churchEvents)
      .where(eq(churchEvents.id, id))
      .returning()

    if (deletedEvent.length === 0) {
      return NextResponse.json(
        { error: "Church event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Church event deleted successfully" })
  } catch (error) {
    console.error("Error deleting church event:", error)
    return NextResponse.json(
      { error: "Failed to delete church event" },
      { status: 500 }
    )
  }
}

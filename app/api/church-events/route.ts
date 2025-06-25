import { NextRequest, NextResponse } from "next/server"

import { churchEvents, db } from "@/lib/db"

// GET /api/church-events - Get all church events
export async function GET() {
  try {
    const events = await db
      .select()
      .from(churchEvents)
      .orderBy(churchEvents.datetime)
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching church events:", error)
    return NextResponse.json(
      { error: "Failed to fetch church events" },
      { status: 500 }
    )
  }
}

// POST /api/church-events - Create a new church event
export async function POST(request: NextRequest) {
  try {
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

    const newEvent = await db
      .insert(churchEvents)
      .values({
        name,
        description,
        place,
        datetime: eventDate,
        imageUrl,
      })
      .returning()

    return NextResponse.json(newEvent[0], { status: 201 })
  } catch (error) {
    console.error("Error creating church event:", error)
    return NextResponse.json(
      { error: "Failed to create church event" },
      { status: 500 }
    )
  }
}

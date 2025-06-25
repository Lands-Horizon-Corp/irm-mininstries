import { NextRequest, NextResponse } from "next/server"
import { db, churchCoverPhotos } from "@/lib/db"

// GET /api/church-covers - Get all church covers
export async function GET() {
  try {
    const covers = await db.select().from(churchCoverPhotos)
    return NextResponse.json(covers)
  } catch (error) {
    console.error("Error fetching church covers:", error)
    return NextResponse.json(
      { error: "Failed to fetch church covers" },
      { status: 500 }
    )
  }
}

// POST /api/church-covers - Create a new church cover
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, coverImage } = body

    if (!name || !description || !coverImage) {
      return NextResponse.json(
        { error: "Name, description, and coverImage are required" },
        { status: 400 }
      )
    }

    const newCover = await db.insert(churchCoverPhotos).values({
      name,
      description,
      coverImage,
    }).returning()

    return NextResponse.json(newCover[0], { status: 201 })
  } catch (error) {
    console.error("Error creating church cover:", error)
    return NextResponse.json(
      { error: "Failed to create church cover" },
      { status: 500 }
    )
  }
}

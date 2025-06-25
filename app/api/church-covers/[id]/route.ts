import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { churchCoverPhotos, db } from "@/lib/db"

// GET /api/church-covers/[id] - Get a specific church cover
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const cover = await db
      .select()
      .from(churchCoverPhotos)
      .where(eq(churchCoverPhotos.id, id))

    if (cover.length === 0) {
      return NextResponse.json(
        { error: "Church cover not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(cover[0])
  } catch (error) {
    console.error("Error fetching church cover:", error)
    return NextResponse.json(
      { error: "Failed to fetch church cover" },
      { status: 500 }
    )
  }
}

// PUT /api/church-covers/[id] - Update a church cover
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, coverImage } = body

    if (!name || !description || !coverImage) {
      return NextResponse.json(
        { error: "Name, description, and coverImage are required" },
        { status: 400 }
      )
    }

    const updatedCover = await db
      .update(churchCoverPhotos)
      .set({
        name,
        description,
        coverImage,
        updatedAt: new Date(),
      })
      .where(eq(churchCoverPhotos.id, id))
      .returning()

    if (updatedCover.length === 0) {
      return NextResponse.json(
        { error: "Church cover not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedCover[0])
  } catch (error) {
    console.error("Error updating church cover:", error)
    return NextResponse.json(
      { error: "Failed to update church cover" },
      { status: 500 }
    )
  }
}

// DELETE /api/church-covers/[id] - Delete a church cover
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const deletedCover = await db
      .delete(churchCoverPhotos)
      .where(eq(churchCoverPhotos.id, id))
      .returning()

    if (deletedCover.length === 0) {
      return NextResponse.json(
        { error: "Church cover not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Church cover deleted successfully" })
  } catch (error) {
    console.error("Error deleting church cover:", error)
    return NextResponse.json(
      { error: "Failed to delete church cover" },
      { status: 500 }
    )
  }
}

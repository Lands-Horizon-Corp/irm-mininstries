import { NextRequest, NextResponse } from "next/server"

import { ministryRanksSchema } from "@/lib/ministry-ranks-schema"
import { MinistryRanksService } from "@/lib/ministry-ranks-service"

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
    const deleted = await MinistryRanksService.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Ministry rank not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ message: "Ministry rank deleted" })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete ministry rank" },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const parse = ministryRanksSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.flatten() },
        { status: 400 }
      )
    }
    const updated = await MinistryRanksService.update(id, parse.data)
    if (!updated) {
      return NextResponse.json(
        { error: "Ministry rank not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: "Failed to update ministry rank" },
      { status: 500 }
    )
  }
}

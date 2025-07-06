import { NextRequest, NextResponse } from "next/server"

import { memberService } from "@/lib/member-service"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
  }
  const member = await memberService.getById(id)
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(member)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
  }
  const data = await req.json()
  const updated = await memberService.update(id, data)
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
  }
  const deleted = await memberService.delete(id)
  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(deleted)
}

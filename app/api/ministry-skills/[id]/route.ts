import { NextRequest, NextResponse } from "next/server"

import { MinistrySkillsService } from "@/lib/ministry-skills-service"

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
  const skill = await MinistrySkillsService.update(id, data)
  return NextResponse.json(skill)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
  }
  const deleted = await MinistrySkillsService.delete(id)
  return NextResponse.json({ success: deleted })
}

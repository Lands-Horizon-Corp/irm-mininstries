import { NextRequest, NextResponse } from "next/server"

import { MinistrySkillsService } from "@/lib/ministry-skills-service"

export async function GET() {
  const skills = await MinistrySkillsService.getAll()
  return NextResponse.json(skills)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const skill = await MinistrySkillsService.create(data)
  return NextResponse.json(skill)
}

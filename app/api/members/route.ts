import { NextRequest, NextResponse } from "next/server"

import { memberService } from "@/lib/member-service"

export async function GET() {
  const members = await memberService.getAll()
  return NextResponse.json(members)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const member = await memberService.create(data)
  return NextResponse.json(member)
}

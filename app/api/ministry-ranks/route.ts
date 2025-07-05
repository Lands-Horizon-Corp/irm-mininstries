import { NextRequest, NextResponse } from "next/server"

import { ministryRanksSchema } from "@/lib/ministry-ranks-schema"
import { MinistryRanksService } from "@/lib/ministry-ranks-service"

export async function GET() {
  const ranks = await MinistryRanksService.getAll()
  return NextResponse.json(ranks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parse = ministryRanksSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.flatten() },
        { status: 400 }
      )
    }
    const newRank = await MinistryRanksService.create(parse.data)
    return NextResponse.json(newRank, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create ministry rank" },
      { status: 500 }
    )
  }
}

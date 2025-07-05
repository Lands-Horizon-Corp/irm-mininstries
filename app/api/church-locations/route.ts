import { NextRequest, NextResponse } from "next/server"

import { ChurchLocationService } from "@/lib/church-location-service"

export async function GET() {
  const locations = await ChurchLocationService.getAll()
  return NextResponse.json(locations)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const location = await ChurchLocationService.create(data)
  return NextResponse.json(location)
}

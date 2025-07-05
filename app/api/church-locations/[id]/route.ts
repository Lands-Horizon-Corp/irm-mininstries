import { NextRequest, NextResponse } from "next/server"

import { ChurchLocationService } from "@/lib/church-location-service"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const location = await ChurchLocationService.getById(Number(params.id))
  if (!location)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(location)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json()
  const location = await ChurchLocationService.update(Number(params.id), data)
  if (!location)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(location)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = await ChurchLocationService.delete(Number(params.id))
  if (!success)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}

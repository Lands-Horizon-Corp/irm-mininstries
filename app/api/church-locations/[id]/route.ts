import { NextRequest, NextResponse } from "next/server"

import { ChurchLocationService } from "@/lib/church-location-service"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  const location = await ChurchLocationService.getById(Number(id))
  if (!location)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(location)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  const data = await req.json()
  const location = await ChurchLocationService.update(Number(id), data)
  if (!location)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(location)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params
  const id = parseInt(idString)
  const success = await ChurchLocationService.delete(Number(id))
  if (!success)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}

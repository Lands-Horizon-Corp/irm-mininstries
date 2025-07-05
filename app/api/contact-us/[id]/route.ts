import { NextRequest, NextResponse } from "next/server"

import { ContactUsService } from "@/lib/contact-us-service"

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
    const deleted = await ContactUsService.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ message: "Contact submission deleted" })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete contact submission" },
      { status: 500 }
    )
  }
}

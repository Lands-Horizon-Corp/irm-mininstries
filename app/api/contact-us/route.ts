import { NextRequest, NextResponse } from "next/server"

import { contactUsSchema } from "@/lib/contact-us-schema"
import { ContactUsService } from "@/lib/contact-us-service"

export async function GET() {
  const contacts = await ContactUsService.getAll()
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parse = contactUsSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.flatten() },
        { status: 400 }
      )
    }
    const newContact = await ContactUsService.create(parse.data)
    return NextResponse.json(newContact, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
}

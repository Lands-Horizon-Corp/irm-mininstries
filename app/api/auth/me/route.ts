import { NextRequest, NextResponse } from "next/server"

import { getCurrentUserFromRequest } from "@/lib/user-utils"

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    )

    // Clear the auth token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Immediately expire the cookie
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

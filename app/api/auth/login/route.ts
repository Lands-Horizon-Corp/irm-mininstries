import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { generateToken, verifyPassword } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const foundUser = user[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, foundUser.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    })

    // Create response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      { status: 200 }
    )

    // Set httpOnly cookie with the token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { headers } from "next/headers"
import { NextRequest } from "next/server"

import { UserPayload, verifyToken } from "@/lib/auth-utils"

/**
 * Get current user from request headers (for use in Server Components)
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  const headersList = await headers()
  const userId = headersList.get("x-user-id")
  const userEmail = headersList.get("x-user-email")
  const userRole = headersList.get("x-user-role")

  if (!userId || !userEmail || !userRole) {
    return null
  }

  return {
    id: parseInt(userId),
    email: userEmail,
    role: userRole,
  }
}

/**
 * Get current user from request (for use in API routes)
 */
export function getCurrentUserFromRequest(
  request: NextRequest
): UserPayload | null {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: UserPayload | null): boolean {
  return user?.role === "admin"
}

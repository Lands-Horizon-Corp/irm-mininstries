import { NextRequest, NextResponse } from "next/server"

import { verifyToken } from "@/lib/auth-utils"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes (add more as needed)
  const protectedRoutes = ["/admin", "/dashboard"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify token
    const user = verifyToken(token)

    if (!user) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Add user info to headers for use in pages/API routes
    const response = NextResponse.next()
    response.headers.set("x-user-id", user.id.toString())
    response.headers.set("x-user-email", user.email)
    response.headers.set("x-user-role", user.role)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}

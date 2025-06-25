import { NextRequest, NextResponse } from "next/server"

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

    // For middleware, we'll do a simpler token validation
    // Full validation happens in the API routes
    try {
      // Basic token format check
      if (!token || token.length < 10) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Let the request proceed - the auth hook will handle detailed validation
      const response = NextResponse.next()

      // Don't try to decode JWT in middleware due to potential env var issues
      // The auth hook will handle proper validation
      return response
    } catch (error) {
      console.error("Middleware auth error:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match specific protected routes:
     * - /admin and its sub-routes
     * - /dashboard and its sub-routes
     * Exclude:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/admin/:path*",
    "/dashboard/:path*",
  ],
}

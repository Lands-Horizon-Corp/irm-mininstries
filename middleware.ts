import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(_req) {
    // Add additional middleware logic if needed
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all /admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

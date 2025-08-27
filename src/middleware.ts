import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      // Check if user has admin role for admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};

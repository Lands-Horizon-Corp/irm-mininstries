import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      email?: string | null;
      id: string;
      name?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check against environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          // Return user object for successful authentication
          return {
            email: adminEmail,
            id: "admin",
            name: "IRM Admin",
            role: "admin",
          };
        }

        return null;
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      name: "credentials",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

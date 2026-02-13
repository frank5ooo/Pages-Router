import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/components/prisma";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginUserSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; 
      }
      return true;
    },
  },
});
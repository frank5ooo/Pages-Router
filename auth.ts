import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/components/prisma";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = loginUserSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid inputs");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
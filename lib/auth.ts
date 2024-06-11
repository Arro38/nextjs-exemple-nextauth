import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials, req) {
        if (
          !credentials ||
          typeof credentials.username !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isPasswordValid) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    generateSessionToken: () => {
      return crypto.randomUUID().toString();
    },
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(token);
        token.id = user.id;
        token.name = user.name;
        token.email = user.username; //pcq enregistrer avec username au lieu de email ou name.
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log(token);
        // session.user.id = token.id!;
        session.user.name = token.name!;
        session.user.email = token.email!;
      }
      return session;
    },
  },
});

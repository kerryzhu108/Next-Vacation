import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "@/prisma/PrismaClient"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      return { ...session, user: { id: token.sub } }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing Username or Password")
        }
        const account = await prisma.account.findFirst({
          where: {
            username: credentials.username,
          },
        })
        if (!account) {
          throw new Error("Account does not exist")
        }
        const correctPassword = await bcrypt.compare(credentials.password, account.hashedPassword)

        if (!correctPassword) {
          throw new Error("Invalid credentials")
        }
        return account
      },
    }),
  ],
}

const handler = NextAuth({
  ...authOptions,
})

export { handler as GET, handler as POST }

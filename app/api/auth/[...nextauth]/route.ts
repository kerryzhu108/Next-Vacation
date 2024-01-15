import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "@/prisma/PrismaClient"
import { NextApiRequest, NextApiResponse } from "next"
import { cookies } from "next/headers"

export function nextAuthOptions(req?: NextApiRequest): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        const user = (await prisma.user.findUnique({ where: { id: token.sub } })) ?? {}
        return { ...session, user }
      },
      async signIn({ user, account, profile, email, credentials }) {
        if (account?.provider == "google") {
          // skip if email already links to a user
          if (user.email) {
            const existingUser = await prisma.user.findFirst({
              where: {
                email: user.email,
              },
            })
            if (existingUser) return true
          }
          const cookiesStore = cookies().get("additionalAuthParams")
          if (cookiesStore) {
            const res = JSON.parse(cookiesStore.value)
            if (res?.userId) {
              await prisma.user.update({
                where: {
                  id: res.userId,
                },
                data: {
                  email: user.email ?? Date.now().toString(),
                  image: user.image,
                },
              })
              await prisma.account.create({
                data: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  userId: res.userId,
                },
              })
            }
          }
        }
        return true
      },
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      }),
      CredentialsProvider({
        credentials: {
          email: { label: "email", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing Username or Password")
          }
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          })
          if (!user) {
            throw new Error("Account does not exist")
          }
          const correctPassword = await bcrypt.compare(credentials.password, user.hashedPassword ?? "")

          if (!correctPassword) {
            throw new Error("Invalid credentials")
          }
          return user
        },
      }),
    ],
  }
}
const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, nextAuthOptions(req))
export { handler as GET, handler as POST }

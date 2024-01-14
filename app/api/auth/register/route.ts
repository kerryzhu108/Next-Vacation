import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/prisma/PrismaClient"
import { signIn } from "next-auth/react"

export const POST = async (request: Request) => {
  const body = await request.json()
  let { userId, username, password } = body
  let account = await prisma.account.findFirst({
    where: {
      username: username,
    },
  })
  if (account) return NextResponse.json({ error: "Username taken" })

  if (!userId) {
    const user = await prisma.user.create({})
    userId = user.id
  }
  const hashedPassword = await bcrypt.hash(password, 12)

  account = await prisma.account.create({
    data: {
      userId,
      username,
      hashedPassword,
    },
  })

  signIn("credentials", {
    username,
    password,
  })

  return NextResponse.json(account)
}

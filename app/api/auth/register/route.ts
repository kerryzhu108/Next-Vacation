import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/prisma/PrismaClient"

export const POST = async (request: Request) => {
  const body = await request.json()
  const { userId, email, password } = body

  if (!email) return NextResponse.json({ error: "Missing username" })
  if (!password) return NextResponse.json({ error: "Missing password" })

  let user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  if (user) return NextResponse.json({ error: "Username taken" })

  const hashedPassword = await bcrypt.hash(password, 12)

  if (!userId) {
    // create new user if no "user intent" provided
    user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    })
    return NextResponse.json({ userId: user.id })
  }

  user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      hashedPassword,
    },
  })
  return NextResponse.json({ userId: user.id })
}

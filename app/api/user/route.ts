import { NextResponse } from "next/server"
import prisma from "@/prisma/PrismaClient"

export const GET = async (request: Request, { params }: { params: { userId: string } }) => {
  const recommendations = await prisma.user.findFirst({
    where: {
      id: params.userId,
    },
  })
  return NextResponse.json(recommendations)
}

import { NextApiResponse } from "next"
import { NextResponse } from "next/server"
import prisma from "@/prisma/PrismaClient"

export const GET = async (request: Request, { params }: { params: { userId: string } }) => {
  const recommendations = await prisma.recommendation.findMany({
    where: {
      userId: params.userId,
    },
  })
  return NextResponse.json(recommendations)
}

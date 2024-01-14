import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/PrismaClient"
// { params }: { params: { userId: string }
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("id") ?? ""
  const recommendations = await prisma.recommendation.findMany({
    where: {
      userId,
      favorite: true,
    },
  })
  return NextResponse.json(recommendations)
}

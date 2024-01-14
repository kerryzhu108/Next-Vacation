import { NextResponse } from "next/server"
import prisma from "@/prisma/PrismaClient"

export const POST = async (request: Request) => {
  const { favorite, id } = await request.json()
  console.log(favorite, id)
  if (!id || typeof favorite != "boolean") {
    return NextResponse.json({ error: "Missing 'favorite' or 'id' in body" }, { status: 400 })
  }
  const recommendations = await prisma.recommendation.update({
    where: { id },
    data: {
      favorite,
    },
  })
  return NextResponse.json(recommendations)
}

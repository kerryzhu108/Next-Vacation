import { NextResponse } from "next/server"
import { openai } from "./config"
import prisma from "@/prisma/PrismaClient"
import { randomUUID } from "crypto"
import { cookies } from "next/headers"

interface Recommendations {
  [location: string]: string
}

export const POST = async (request: Request) => {
  const body = await request.json()
  const { message, userId } = body
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing or invalid message" }, { status: 400 })
  }
  if (message.length > 600) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 })
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a travel advisor that outputs JSON. Each key is a 'city, region' while each value is a description.",
      },
      { role: "user", content: message },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  })
  let response = {} as Recommendations
  try {
    response = JSON.parse(completion.choices[0].message.content ?? "") as Recommendations
  } catch {
    return NextResponse.json(
      { error: `OpenAI result not valid JSON: ${completion.choices[0].message.content}` },
      { status: 500 }
    )
  }
  let targetUserId = userId
  if (!targetUserId) {
    const newUser = await prisma.user.create({
      data: {
        email: Date.now().toString(),
      },
    })
    targetUserId = newUser.id
  } else {
    // update trial count
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        trials: {
          increment: 1,
        },
      },
    })
    // remove old recommendations
    await prisma.recommendation.deleteMany({
      where: {
        userId: userId,
        favorite: false,
      },
    })
  }

  const groupId = randomUUID()
  const recommendations = Object.keys(response).map(async (location) => {
    const imageSearch = await fetch(
      "https://www.googleapis.com/customsearch/v1?" +
        `key=${process.env.SEARCH_ENGINE_KEY}` +
        `&cx=${process.env.SEARCH_ENGINE_ID}` +
        `&searchType=image&q=${encodeURI(location)}`
    )
    const searchResults = await imageSearch.json()
    let link = ""
    let highestSquareness = 3000
    searchResults.items.some((item: any) => {
      const squareness = Math.abs(item.image.height - item.image.width)
      if (squareness < highestSquareness) {
        highestSquareness = squareness
        link = item.link
      }
      return squareness == 0
    })
    await prisma.recommendation.create({
      data: { userId: targetUserId, groupId, location, description: response[location], imageUrl: link },
    })
  })
  cookies().set("userId", targetUserId)
  await Promise.all(recommendations)
  return NextResponse.json({ userId: targetUserId })
}

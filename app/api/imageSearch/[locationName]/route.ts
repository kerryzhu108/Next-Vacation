import { NextResponse } from "next/server"

// https://www.googleapis.com/customsearch/v1?key=AIzaSyCA9FYhADieEPgTsJHw-c6SgtJaK121q6c&cx=45260182bdd354cba&q=hanoi&searchType=image
interface IParams {
  locationName?: string
}

export const GET = async (request: Request, { params }: { params: IParams }) => {
  const { locationName } = params

  if (!locationName || typeof locationName !== "string") {
    return NextResponse.json({ error: "Missing or invalid location name" }, { status: 400 })
  }

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?
    key=${process.env.SEARCH_ENGINE_KEY}
    &cx=${process.env.SEARCH_ENGINE_ID}
    &searchType=image&q=${locationName}`
  )
}

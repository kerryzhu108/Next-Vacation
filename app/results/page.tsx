import prisma from "@/prisma/PrismaClient"
import { faSearch, faCircleUser, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"

const getRecommendations = async (userId: string) => {
  return await prisma.recommendation.findMany({
    where: { userId },
  })
}

export default async function Results({ params, searchParams }: { params: any; searchParams: { id: string } }) {
  const recommendations = await getRecommendations(searchParams.id)
  return (
    <div className="ml-3">
      <div className="flex flex-row mt-2 text-sm font-semibold px-3 flex-wrap">
        <div>
          <h1>Free Genereations</h1>
        </div>
        <div className="flex flex-row flex-grow justify-center">
          <h1 className="mx-3">Your Picks</h1>
          <h1 className="mx-3">Modify Preferences</h1>
          <div className="mx-3 border-2 pl-3">
            <input placeholder="Look Up" size={10} />
            <FontAwesomeIcon icon={faSearch} size="xs" />
          </div>
        </div>
        <div className="mr-2">Account</div>
        <FontAwesomeIcon icon={faCircleUser} size="xl" />
      </div>

      <div className="mt-10 flex flex-row">
        {recommendations.map((rec) => {
          return (
            <div key={rec.id} className="mt-5 mx-3 relative">
              <FontAwesomeIcon
                icon={faStar}
                size="sm"
                className="absolute right-1 top-1 fa-stars"
                color="yellow"
                style={{
                  stroke: "black",
                  strokeWidth: 30,
                }}
              />
              <Image
                src={rec.imageUrl}
                alt={rec.location}
                width={0}
                height={0}
                layout="responsive"
                className="max-w-60 rounded-lg"
              />
              <h2 className="font-semibold">{rec.location}</h2>
              <h3 className="text-xs">Learn More</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

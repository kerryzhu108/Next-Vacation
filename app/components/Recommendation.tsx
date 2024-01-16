"use client"
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Recommendation } from "@prisma/client"
import Image from "next/image"
import useRecommendationStore from "../stores/useRecommendationStore"
import { useRouter } from "next/navigation"

export default function Result({
  rec,
  showDesc = true,
  className,
}: {
  rec: Recommendation
  showDesc?: boolean
  className?: string
}) {
  const recommendationStore = useRecommendationStore()
  const router = useRouter()

  return (
    <div className={`mt-6 mx-4 relative inline-block text-wrap w-60 ${className}`}>
      <FontAwesomeIcon
        icon={faHeart}
        className="absolute right-1 top-0 p-3 pb-6 pl-6"
        color={rec.favorite ? "#e84184" : "grey"}
        style={{
          stroke: "white",
          strokeWidth: 40,
        }}
        onClick={async () => {
          await fetch(`/api/recommendations/${rec.id}`, {
            method: "POST",
            body: JSON.stringify({ id: rec.id, favorite: !rec.favorite }),
          })
          router.refresh()
        }}
      />
      <Image
        src={rec.imageUrl}
        alt={rec.location}
        width={200}
        height={200}
        className={`rounded-xl select-none object-cover w-60 h-60 mb-2`}
        draggable={false}
        onClick={() => {
          recommendationStore.setRecommendationState({
            isVisible: true,
            targetRecommendation: rec,
          })
        }}
      />
      {showDesc && (
        <>
          {" "}
          <h2 className="font-semibold">{rec.location}</h2>
          <h3 className="text-sm text-gray-500">Learn More</h3>
        </>
      )}
    </div>
  )
}

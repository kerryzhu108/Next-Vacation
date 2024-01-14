"use client"
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Recommendation } from "@prisma/client"
import Image from "next/image"
import { useState } from "react"

export default function Result({ rec }: { rec: Recommendation }) {
  const [isFavorite, setFavorite] = useState(rec.favorite)
  return (
    <div className={`mt-6 mx-4 relative inline-block text-wrap w-60`}>
      <FontAwesomeIcon
        icon={faHeart}
        className="absolute right-1 top-0 p-3 pb-6 pl-6"
        color={isFavorite ? "#e84184" : "grey"}
        style={{
          stroke: "white",
          strokeWidth: 40,
        }}
        onClick={() => {
          fetch(`/api/recommendations/${rec.id}`, {
            method: "POST",
            body: JSON.stringify({ id: rec.id, favorite: !rec.favorite }),
          })
          setFavorite(!isFavorite)
        }}
      />
      <Image
        src={rec.imageUrl}
        alt={rec.location}
        width={200}
        height={200}
        className={`rounded-xl select-none object-cover w-60 h-60 mb-2`}
      />
      <h2 className="font-semibold">{rec.location}</h2>
      <h3 className="text-sm text-gray-500">Learn More</h3>
    </div>
  )
}

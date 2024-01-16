"use client"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Recommendation } from "@prisma/client"
import { useEffect, useState } from "react"
import Result from "../components/Recommendation"
import { useSession } from "next-auth/react"
import Cookie from "js-cookie"

export default function Favorites() {
  const [favorites, setFavorites] = useState([] as Recommendation[])
  const [filter, setFiler] = useState("")
  const session = useSession()
  useEffect(() => {
    const userId = session.data?.user.id ?? Cookie.get("userId")
    if (!userId) return
    fetch(`/api/recommendations/fav?id=${userId}`).then(async (res) => {
      setFavorites(await res.json())
    })
  }, [session, Cookie.get("userId")])

  if (!favorites || !favorites.length) {
    return (
      <div className="h-full flex justify-center items-center mx-3 text-gray-600">
        You currently have no favorites, press the heart icon on an image to add it here.
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center sm:block sm:ml-7">
      <div className="text-center sm:text-left mt-10 mx-1">
        A collection of all the places you&apos;ve stared, amongst all the suveys you&apos;ve done!
      </div>
      <div className="border inline-block rounded-lg p-2 ml-2.5 sm:ml-0 py-1 mt-2">
        <FontAwesomeIcon icon={faSearch} size="sm" />
        <input
          className="ml-2 outline-none"
          placeholder="Japan"
          onChange={(e) => {
            setFiler(e.target.value)
          }}
        />
      </div>
      <div className="flex flex-col items-center sm:flex-row">
        {favorites.map((fav: Recommendation) => {
          return fav.location.toLocaleLowerCase().includes(filter) ? (
            <Result rec={fav} key={fav.id} className="sm:mx-0 sm:mr-10" />
          ) : null
        })}
      </div>
    </div>
  )
}

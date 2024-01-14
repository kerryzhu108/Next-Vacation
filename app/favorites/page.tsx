"use client"
import { faArrowLeft, faMagnifyingGlass, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import prisma from "@/prisma/PrismaClient"
import { Recommendation } from "@prisma/client"
import Result from "../components/Recommendation"
import Link from "next/link"
import Navbar from "../components/Navbar"
import { MenuOptions } from "../constants"
import { useEffect, useState } from "react"

export default function Favorites({ params, searchParams }: { params: {}; searchParams: { id: string } }) {
  const [favorites, setFavorites] = useState([] as Recommendation[])
  const [filter, setFiler] = useState("")
  useEffect(() => {
    fetch(`/api/recommendations/fav?id=${searchParams.id}`).then(async (res) => {
      setFavorites(await res.json())
    })
  }, [])
  if (!favorites || !favorites.length) {
    return (
      <div className="h-full text-center flex items-center mx-3 text-gray-600">
        <Link href={`/questions?id=${searchParams.id}`} className="absolute top-2 left-2 pr-10 pb-10">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </Link>
        You currently have no favorites, press the star on the top right of a picture to add it here.
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center sm:block">
      <Navbar id={searchParams.id} selected={MenuOptions.FAVORTIES} />
      <div className="text-center sm:text-left sm:ml-3 mt-10 mx-1">
        A collection of all the places you stared, among all the suveys you&apos;ve done!
      </div>
      <div className="border inline-block rounded-lg p-2 ml-2.5 py-1 mt-2">
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
          return fav.location.toLocaleLowerCase().includes(filter) ? <Result rec={fav} key={fav.id} /> : null
        })}
      </div>
    </div>
  )
}

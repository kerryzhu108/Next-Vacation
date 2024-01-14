import prisma from "@/prisma/PrismaClient"
import { faSearch, faCircleUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Result from "../components/Recommendation"
import { Recommendation } from "@prisma/client"
import AdviceLimit from "../components/AdviceLimit"
import Link from "next/link"
import Navbar from "../components/Navbar"
import { MenuOptions } from "../constants"
import { useState } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

const getRecommendations = async (userId: string) => {
  return await prisma.recommendation.findMany({
    where: { userId },
  })
}

const getUserInfo = async (userId?: string) => {
  if (!userId) return null

  const res = await prisma.user.findFirst({
    where: { id: userId },
  })
  console.log(userId)
  return res
}

export default async function Results({ params, searchParams }: { params: {}; searchParams: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = await getUserInfo(session?.user.id ?? searchParams.id)
  const recommendations = await getRecommendations(session?.user.id ?? searchParams.id)

  if (!user) {
    return (
      <>
        <Navbar selected={MenuOptions.HOME} />
        <Link href="/questions" className="h-full flex items-center justify-center -mt-10 underline">
          Error loading page, please click this link to take the survey again.
        </Link>
      </>
    )
  }
  return (
    <div className="ml-3">
      <Navbar selected={MenuOptions.HOME} />
      <div className="mt-10 flex flex-row flex-wrap justify-center pb-60">
        {recommendations.map((rec: Recommendation) => {
          return <Result rec={rec} key={rec.id} />
        })}
        <AdviceLimit style="invisible sm:visible" adviceUsed={user.trials} freeAdvice={user.limit} />
      </div>
    </div>
  )
}

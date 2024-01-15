import prisma from "@/prisma/PrismaClient"
import { faSearch, faCircleUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Result from "../components/Recommendation"
import { Recommendation } from "@prisma/client"
import AdviceLimit from "../components/AdviceLimit"
import Link from "next/link"
import { MenuOptions } from "../constants"
import { useState } from "react"
import { getServerSession } from "next-auth"
import { nextAuthOptions } from "../api/auth/[...nextauth]/route"

const getRecommendations = async (userId?: string) => {
  if (!userId) return []
  return await prisma.recommendation.findMany({
    where: { userId },
  })
}

export default async function Results({ params, searchParams }: { params: {}; searchParams: { id: string } }) {
  const session = await getServerSession(nextAuthOptions())
  // console.log(user) // ON SIGN IN, ADD AN ADDITIONAL PARAM "intentId" which all recommendations reference
  // when submitting survey, instead of creating a user, create a user_intent that maps to all reommendations
  const recommendations = await getRecommendations(session?.user.id ?? searchParams.id)

  if (!session?.user || !recommendations.length) {
    return (
      <>
        <div className="h-full flex items-center justify-center -mt-10">
          <Link href="/questions" className="mx-4">
            {!session?.user ? "Please login or " : "No recommendations for this account. Please "}
            <span className="underline">click this link</span>&nbsp;to take the survey again.
          </Link>
        </div>
      </>
    )
  }
  return (
    <div className="ml-3">
      <div className="mt-10 flex flex-row flex-wrap justify-center pb-60">
        {recommendations.map((rec: Recommendation) => {
          return <Result rec={rec} key={rec.id} />
        })}
        <AdviceLimit classname="invisible sm:visible bottom-1 right-1" />
      </div>
    </div>
  )
}

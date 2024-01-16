"use client"
import { useSession } from "next-auth/react"
import { Status } from "@prisma/client"
import UpgradeButton from "./UpgradeButton"

export default function AdviceLimit({ classname }: { classname?: string }) {
  const session = useSession()
  const user = session.data?.user
  if (!user || user.status == Status.PAID) {
    return null
  }
  return (
    <div className={`fixed text-center border rounded-xl bg-gray-800 text-white py-8 px-7 -z-20 ${classname}`}>
      <div className="text-sm sm:px-10 mb-3">
        Free Recommendations: {user.trials}/{user.limit}
      </div>
      <div className="relative">
        <div
          className="absolute rounded-lg bg-green-600 h-3 top-0 -z-10"
          style={{ width: `${(100 * user.trials) / user.limit ?? 1}%` }}
        />
        <div className="absolute rounded-lg bg-white h-3 top-0 w-full -z-20" />
      </div>
      <div className="mx-5 mt-10">
        <UpgradeButton />
      </div>
    </div>
  )
}

"use client"
import { faBars, faCircleUser, faSearch, faUnlock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState } from "react"
import AdviceLimit from "./AdviceLimit"
import { MenuOptions } from "../constants"
import useLoginStore from "../stores/useLoginStore"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import useUserStore from "../stores/useUserStore"
import { Status } from "@prisma/client"

const locationMap = new Map(
  Object.entries({
    "/results": MenuOptions.HOME,
    "/favorites": MenuOptions.FAVORTIES,
    "/questions": MenuOptions.PREFERENCES,
  })
)

export default function Navbar() {
  const [showNav, setShowNav] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const loginStore = useLoginStore()
  const session = useSession()
  const userId = session.data?.user.id
  const router = useRouter()
  const location = locationMap.get(usePathname()) ?? MenuOptions.HOME
  return (
    <div>
      <div className="hidden sm:block">
        <div className="flex flex-row justify-between mt-2 font-semibold mx-3 flex-wrap">
          <div className="flex">
            <Link
              className={`mx-3 ${location == MenuOptions.HOME ? "border-b-2" : ""} border-gray-400`}
              href={`/results`}
            >
              Home
            </Link>
            <Link
              className={`mx-3 ${location == MenuOptions.FAVORTIES ? "border-b-2" : ""} border-gray-400`}
              href={`/favorites`}
            >
              Your Favorites
            </Link>
            <Link
              className={`mx-3 ${location == MenuOptions.PREFERENCES ? "border-b-2" : ""} border-gray-400`}
              href={`/questions`}
            >
              Retake Survey
            </Link>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => {
                if (userId) {
                  return setShowLogout(!showLogout)
                }
                loginStore.toggleVisible()
              }}
              className="flex relative items-center"
            >
              {userId ? (
                <Image
                  src={`${session.data?.user.image ?? `/avatar${userId.charCodeAt(userId.length - 1) % 10}.svg`}`}
                  alt={"avatar"}
                  width={30}
                  height={30}
                  className="rounded-2xl"
                />
              ) : (
                <FontAwesomeIcon icon={faCircleUser} size="lg" className="mr-1" />
              )}
              <div className="ml-1">{session.data?.user.status == Status.PAID ? "Premium" : "Account"}</div>
              {showLogout && (
                <div className="absolute  top-7 right-0 text-center shadow-lg py-1 px-4 rounded-lg mt-2">
                  <div
                    className="hover:bg-slate-300"
                    onClick={async () => {
                      await signOut({ redirect: false })
                      router.push("/results")
                    }}
                  >
                    Log out
                  </div>
                  {session.data?.user.status == Status.PAID && (
                    <div
                      className="hover:bg-slate-300 text-nowrap"
                      onClick={async () => {
                        await fetch("/api/stripe", {
                          method: "DELETE",
                        })
                        router.refresh()
                      }}
                    >
                      Cancel Premium
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile screen below */}
      <div className="absolute left-0 top-0 sm:invisible">
        <FontAwesomeIcon
          icon={faBars}
          size="lg"
          onClick={() => {
            setShowNav(!showNav)
          }}
          className="relative z-30 ml-3 mt-3"
        />
        {showNav && (
          <div className="fixed h-full w-full z-20 top-0" onClick={() => setShowNav(false)}>
            <div className="bg-slate-500 bg-opacity-70 absolute w-full h-full"></div>
            <div className="bg-white absolute z-10 w-4/5 h-full rounded-r-2xl ">
              <div className="mx-3 pt-8 mt-5 border-b-2 border-black hover:bg-slate-200">
                <button
                  onClick={() => {
                    loginStore.toggleVisible()
                  }}
                >
                  Account
                </button>
              </div>
              <div className="mx-3 pt-8 mt-5 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/results`}>Home</Link>
              </div>
              <div className="mx-3 mt-3 pt-8 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/favorites`}>Favorites</Link>
              </div>
              <div className="mx-3 mt-3 pt-8 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/questions`}>Retake Survey</Link>
              </div>
              <AdviceLimit classname="w-4/5 left-0 bottom-0 right-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

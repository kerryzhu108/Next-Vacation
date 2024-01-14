"use client"
import { faBars, faCircleUser, faSearch, faUnlock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useEffect, useState } from "react"
import AdviceLimit from "./AdviceLimit"
import { MenuOptions } from "../constants"
import useLoginStore from "../stores/useLoginStore"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import useUserStore from "../stores/useUserStore"

export default function Navbar({ selected }: { selected: MenuOptions }) {
  const [showNav, setShowNav] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const loginStore = useLoginStore()
  const userStore = useUserStore()
  const session = useSession()
  const userId = session.data?.user.id

  return (
    <div>
      <div className="hidden sm:block">
        <div className="flex flex-row justify-between mt-2 font-semibold mx-3 flex-wrap">
          <div className="flex">
            <Link
              className={`mx-3 ${selected == MenuOptions.HOME ? "border-b-2" : ""} border-gray-400`}
              href={`/results`}
            >
              Home
            </Link>
            <Link
              className={`mx-3 ${selected == MenuOptions.FAVORTIES ? "border-b-2" : ""} border-gray-400`}
              href={`/favorites`}
            >
              Your Favorites
            </Link>
            <h1 className="mx-3">Modify Preferences</h1>
          </div>
          <div className="flex flex-col">
            <div
              onClick={() => {
                if (session.data?.user.id) {
                  return setShowLogout(!showLogout)
                }
                loginStore.toggleVisible()
              }}
              className="flex relative items-center"
            >
              {userId ? (
                <Image
                  src={`/avatar${userId.charCodeAt(userId.length - 1) % 10}.svg`}
                  alt={"avatar"}
                  width={30}
                  height={30}
                />
              ) : (
                <FontAwesomeIcon icon={faCircleUser} size="lg" className="mr-1" />
              )}
              <div className="ml-1">Account</div>
              {showLogout && (
                <div
                  className="absolute hover:bg-slate-300 top-7 right-0 text-center shadow-lg py-1 px-4 rounded-lg mt-2"
                  onClick={() => {
                    userStore.setUserState({ userId: "" })
                    signOut()
                  }}
                >
                  Log out
                </div>
              )}
            </div>
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
              <div className="mx-3 mt-12 pt-8 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/favorites`}>Favorites</Link>
              </div>
              <div className="mx-3 mt-2 pt-8 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/favorites}`}>Preferences</Link>
              </div>
              <div className="mx-3 pt-8 mt-2 border-b-2 border-black hover:bg-slate-200">
                <Link href={`/favorites`}>Account</Link>
              </div>
              <AdviceLimit adviceUsed={1} freeAdvice={3} style="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

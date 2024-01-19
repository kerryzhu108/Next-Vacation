"use client"

import { Dispatch, SetStateAction, useState } from "react"
import useLoginStore from "../stores/useLoginStore"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Cookie from "js-cookie"

export function LoginModal() {
  const loginStore = useLoginStore()
  const [isLogin, setIsLogin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const input = (label: string, updater: Dispatch<SetStateAction<string>>) => {
    return (
      <div className="w-full text-gray-500 focus-within:text-blue-600 mt-5 mb-2 ">
        <div className="mb-1 text-sm font-semibold">{label}</div>
        <input
          onChange={(e) => updater(e.target.value)}
          className="rounded-sm pl-2 h-8 w-full border-1.5 outline-none caret-transparent border-gray-300 focus:border-blue-600"
        />
      </div>
    )
  }

  const handleRegister = () => {
    fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        userId: searchParams.get("id"),
        email: username,
        password,
      }),
    }).then(async (res) => {
      const response = await res.json()
      if (response?.error) {
        return setErrors(response.error)
      }
      if (!response?.userId) {
        return setErrors("An unexpected error occurred")
      }
      signIn("credentials", {
        email: username,
        password,
      })
      router.refresh()
      loginStore.toggleVisible()
    })
  }

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email: username,
      password,
      redirect: false,
    })
    if (res?.error) {
      return setErrors(res.error)
    }
    router.refresh()
    loginStore.toggleVisible()
  }

  return (
    <div
      className={`fixed flex justify-center items-center w-full h-full top-0 z-50 ml-0 ${
        loginStore.isVisible ? "" : "hidden"
      }`}
      style={{ backgroundColor: `rgba(70, 80, 100, 0.9)` }}
      onClick={(e) => {
        if (e.currentTarget == e.target) {
          loginStore.toggleVisible()
        }
      }}
    >
      <div className="bg-white inline-block pb-10 rounded-t-xl rounded-b-md opacity-100 w-full max-w-lg mx-2">
        <div className="flex justify-around text-center">
          <div
            onClick={() => {
              setIsLogin(false)
              setErrors("")
            }}
            className={`w-full p-2 py-3 rounded-t-sm border-gray-200 ${
              !isLogin ? "bg-white rounded-tl-2xl" : "bg-gray-300 rounded-tr-none"
            }`}
          >
            Sign Up
          </div>
          <div
            onClick={() => {
              setIsLogin(true)
              setErrors("")
            }}
            className={`w-full p-2 py-3 rounded-t-sm border-gray-200 ${
              isLogin ? "bg-white rounded-tr-2xl" : "bg-gray-300 rounded-tl-none"
            }`}
          >
            Login
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="text-sm text-gray-400 text-left mt-3 w-2/3">
            Create an account to save your recommendations and upgrade plans.
          </div>
          <div className="flex flex-col items-center w-2/3">
            {input("Username", setUsername)}
            {input("Password", setPassword)}
            <div className="text-red-500 text-sm text-left w-full">{errors}</div>
          </div>
          <button
            className="w-2/3 py-2 mt-5 rounded-sm text-sm text-white bg-gradient-to-r from-blue-600 to-teal-400"
            onClick={() => {
              setErrors("")
              isLogin ? handleLogin() : handleRegister()
            }}
          >
            {isLogin ? "LOGIN" : "SIGN UP"}
          </button>
          <div className="w-2/3 h-0.5 mt-5 bg-gray-100" />
          <button
            className="flex items-center text-xs text-gray-400 mt-5"
            onClick={async () => {
              Cookie.set(
                "additionalAuthParams",
                JSON.stringify({
                  userId: Cookie.get("userId"),
                })
              )
              await signIn("google")
            }}
          >
            <Image src={"/google.svg"} alt={"Google"} width={30} height={30} />
            &nbsp; Alternatively, {isLogin ? "log in" : "sign up"} with Google
          </button>
        </div>
      </div>
    </div>
  )
}

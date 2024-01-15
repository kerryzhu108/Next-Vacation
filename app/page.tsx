import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="h-full flex flex-col px-3 justify-center items-center ">
      <h1 className="text-center">Cant decide on where to go for your next travel destination?</h1>
      <h1 className="text-center mt-5">
        I can help! Just answer a few questions and I'll giving you some recommendations.
      </h1>
      <Link href="/questions" title="continue" className="mt-10">
        continue
      </Link>
    </div>
  )
}

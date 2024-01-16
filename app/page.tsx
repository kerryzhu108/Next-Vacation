import Image from "next/image"
import Link from "next/link"
import styles from "./styles/animations.module.css"

export default function Home() {
  const addUnderline = (element: HTMLElement) => {
    element.style.textDecoration = "underline"
    element.style.transition = "text-decoration 0.3s ease"
  }
  return (
    <div className="h-3/4 flex flex-col px-3 justify-center items-center sm:text-xl">
      <h1 className="text-center animate-fadeIn">Cant decide on where to go for your next travel destination?</h1>
      <h1 className="text-center animate-fadeIn opacity-0 mt-3" style={{ animationDelay: "2s" }}>
        I can help! Just answer a few questions and I'll give you my recommendations.
      </h1>
      <Link href="/questions" className="mt-10 opacity-0 animate-fadeIn" style={{ animationDelay: "3.5s" }}>
        <div className={styles.underline}>Get Started</div>
      </Link>
    </div>
  )
}

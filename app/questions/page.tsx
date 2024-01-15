"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import UpgradeButton from "../components/UpgradeButton"

interface questionBank {}

interface Question {
  type: string
  question: string
  answers: string[]
}

// prettier-ignore
const questionBank: Question[] = [
  { type: 'single', question: "What type of climate do you prefer?", answers: ["Tropical and warm", "Mild and temperate", "Cold and snowy"] },
  { type: 'mc', question: "What environment are you looking for?", answers: ["Bustling urban cities", "Coastal beaches", "Historical architecture", "Scenic nature"] },
  { type: 'single', question: "What is your budget range?", answers: ["Budget-friendly", "Moderate spending", "Luxury experience", "No preference"] },
  { type: 'single', question: "How far are you looking to travel?", answers: ["Driving distance from my city", "Within my country", "Anywhere around the world"] },
  { type: 'open', question: "Do you have any dietary or accessiblity restrictions?", answers: [""] },
];

export default function Questions() {
  const [index, setIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState(new Set<string>())
  const [openAnswers, setOpenAnswers] = useState<Map<number, string>>(new Map())
  const router = useRouter()
  const session = useSession()
  const user = session.data?.user

  useEffect(() => {
    console.log("in")
  }, [])

  // Adds answer to set if it's present, removes answer if it's already in set
  const updateselectedAnswers = (answer: string) => {
    const copySet = new Set(selectedAnswers)
    copySet.delete(answer) ? setSelectedAnswers(copySet) : setSelectedAnswers(copySet.add(answer))
  }
  // Updates open answers
  const updatedOpenAnswer = (answer: string) => {
    const copyMap = new Map(openAnswers)
    copyMap.set(index, answer)
    setOpenAnswers(copyMap)
  }
  // Formats data into prompt for AI
  const handleSubmit = async () => {
    let prompt = "Can you recommend a few travel destinations based on these preferences: "
    Array.from(selectedAnswers).map((answer) => {
      prompt = prompt.concat(answer + ", ")
    })
    openAnswers.forEach((answer) => {
      prompt = prompt.concat(answer + ", ")
    })
    const res = await fetch("/api/openAI", {
      method: "POST",
      body: JSON.stringify({
        message: prompt,
        user: session.data?.user.id,
      }),
    })
    const user = await res.json()
    router.push(`/results?id=${user.userId ?? ""}`)
  }

  if (user && user.trials >= user.limit) {
    return (
      <div className="flex flex-col px-5 justify-center items-center ">
        <div className="mt-20 text-center">Limit reached, upgrade to premium to unlock more preferences.</div>
        <UpgradeButton className="mt-5" />
      </div>
    )
  }

  return (
    <div className="h-full flex justify-center items-center ">
      <div
        className="fixed top-10 left-0 rounded-sm bg-blue-500 w-full h-3"
        style={{ width: `${(100 * (index + 1)) / (questionBank.length + 1)}%` }}
      />
      <div>
        {questionBank[index].question}
        {questionBank[index].answers.map((answer: string) => {
          return (
            <div
              key={answer}
              onClick={() => {
                updateselectedAnswers(answer)
                if (questionBank[index].type == "single" && index < questionBank.length - 1) setIndex(index + 1)
              }}
              className={`border m-2 ${selectedAnswers.has(answer) ? "border-black" : "bg-gray-50"}`}
            >
              {answer}
            </div>
          )
        })}
        {index > 0 && <button onClick={() => setIndex(index - 1)}>Back</button>}
        {questionBank[index].type == "open" && (
          <input
            value={openAnswers.get(index) ?? ""}
            onChange={(t) => {
              updatedOpenAnswer(t.target.value)
            }}
          />
        )}
        {index < questionBank.length - 1 && "mc | open".includes(questionBank[index].type) && (
          <button onClick={() => setIndex(index + 1)}>Next</button>
        )}
        {index == questionBank.length - 1 && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  )
}

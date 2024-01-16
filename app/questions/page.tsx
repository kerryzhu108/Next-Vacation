"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import UpgradeButton from "../components/UpgradeButton"
import ProgressBar from "../components/ProgressBar"
import styles from "../styles/animations.module.css"
import { QuestionTypes, questionSet } from "../constants/constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import Cookie from "js-cookie"
import { Status } from "@prisma/client"

export default function Questions() {
  const [allowProceed, setAllowProceed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cookieUserId, setCookieUserId] = useState("")
  const [index, setIndex] = useState(0)
  const [indexHistory, setIndexHistory] = useState([0])
  const router = useRouter()
  const session = useSession()
  const user = session.data?.user
  const [questionBank, setQuestionBank] = useState(questionSet)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    // allow if (first time user) or not (an unpaid user gone over free limit)
    setAllowProceed((!user && !Cookie.get("userId")) || !(user?.status == Status.UNPAID && user.trials >= user.limit))
    setCookieUserId(Cookie.get("userId") ?? "")
  }, [user])

  // bc some questions can be skipped, use index history to support backwards navigation
  const goBack = () => {
    if (indexHistory.length <= 1) return 0
    const newIndex = indexHistory[indexHistory[indexHistory.length - 2]]
    setIndex(newIndex)
    setIndexHistory(indexHistory.splice(0, indexHistory.length - 1))
    setInputValue(questionBank[newIndex].answer)
  }

  const goForward = (targetIndex?: number) => {
    const newIndex = targetIndex ?? index + 1
    setIndexHistory(indexHistory.concat([newIndex]))
    setIndex(newIndex)
    setInputValue(questionBank[newIndex].answer)
  }

  const updateAnswer = (answer: string) => {
    questionBank[index].answer = answer
    setQuestionBank(questionBank)
  }

  // Formats data into prompt for AI
  const handleSubmit = async () => {
    let prompt = "Recommend 6 travel destinations and make references to these preferences. "
    questionBank.map((item) => {
      prompt = prompt.concat(item.promptQuestion + item.answer + ". ")
    })
    setLoading(true)
    await fetch("/api/openAI", {
      method: "POST",
      body: JSON.stringify({
        message: prompt,
        userId: session.data?.user.id,
      }),
    })
    router.push(`/results`)
    router.refresh()
  }

  // Limit user if a cookie has been set or an unpaid account has reached their account limit

  if (!allowProceed) {
    return (
      <div className="flex flex-col h-full px-5 justify-center items-center ">
        <div className="-mt-32 text-center">
          Limit reached, {!user && cookieUserId ? "create an account" : "upgrade to premium"} to unlock more
          recommendations.
        </div>
        {user && <UpgradeButton className="mt-5 max-w-96" />}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <div className={styles.spinner} /> Finding Recommendations
      </div>
    )
  }

  return (
    <div className="h-4/5 flex justify-center items-center p-10">
      <ProgressBar percentage={((index + 1) / (questionBank.length + 1)) * 100} />
      <div>
        <div className="text-xl mb-3">{questionBank[index].question}</div>
        {questionBank[index].options.map((option: string) => {
          return (
            <div
              key={option}
              onClick={() => {
                updateAnswer(option)
                if (questionBank[index].type == QuestionTypes.SINGLE && index < questionBank.length - 1) {
                  const customMap = questionBank[index].customMapping
                  if (customMap) {
                    return goForward(customMap[option])
                  }
                  goForward()
                }
              }}
              className={`border-black m-2  ${styles.underline}`}
            >
              {option}
            </div>
          )
        })}
        {questionBank[index].type == QuestionTypes.OPEN && (
          <input
            className="flex w-full border-2 p-2 rounded-xl mb-3 mr-3"
            placeholder={questionBank[index].placeHolder}
            value={inputValue}
            onChange={(t) => {
              setInputValue(t.target.value)
              updateAnswer(t.target.value)
            }}
          />
        )}

        <div className="flex justify-between mt-3">
          {index > 0 && (
            <button
              onClick={() => {
                goBack()
              }}
              className="border border-gray-400 p-3 rounded-md"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </button>
          )}
          {index == questionBank.length - 1 ? (
            <button onClick={handleSubmit}>Submit</button>
          ) : (
            questionBank[index].type != QuestionTypes.SINGLE && (
              <button
                className="border border-gray-400 p-3 rounded-md"
                onClick={() => {
                  goForward()
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} size="lg" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

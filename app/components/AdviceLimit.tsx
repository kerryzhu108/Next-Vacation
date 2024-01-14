import { faUnlock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function AdviceLimit({
  adviceUsed,
  freeAdvice,
  style,
}: {
  adviceUsed: number
  freeAdvice: number
  style?: string
}) {
  return (
    <div
      className={`fixed bottom-0 right-0 z-10 text-center border rounded-xl bg-gray-800 text-white py-8 px-7 -z-20 ${style}`}
    >
      <div className="text-sm px-10 mb-3">
        {adviceUsed}/{freeAdvice} Free Recommendations
      </div>
      <div className="relative">
        <div
          className="absolute rounded-lg bg-green-600 h-3 top-0 -z-10"
          style={{ width: `${(100 * adviceUsed) / freeAdvice}%` }}
        />
        <div className="absolute rounded-lg bg-white h-3 top-0 w-full -z-20" />
      </div>
      <div className="mx-5 mt-10">
        <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 py-3 w-full rounded-md ">
          Upgrade <FontAwesomeIcon icon={faUnlock} className="ml-1" />
        </button>
      </div>
    </div>
  )
}

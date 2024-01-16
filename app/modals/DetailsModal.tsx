"use client"
import Image from "next/image"
import useRecommendationStore from "../stores/useRecommendationStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Result from "../components/Recommendation"

export function DetailsModal() {
  const recommendationStore = useRecommendationStore()
  const rec = recommendationStore.targetRecommendation
  if (!rec) return
  return (
    <div
      className={`fixed flex justify-center items-center top-0 w-full h-full z-50 ${
        recommendationStore.isVisible ? "" : "hidden"
      }`}
      style={{ backgroundColor: `rgba(70, 80, 100, 0.9)` }}
      onClick={(e) => {
        if (e.currentTarget == e.target) {
          recommendationStore.toggleVisible()
        }
      }}
    >
      <div
        className={`bg-white h-full sm:h-fit sm:items-start px-10 sm:pl-10 sm:pb-10 sm:rounded-md`}
        style={{ maxWidth: 900 }}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="absolute left-0 p-3 sm:invisible"
          onClick={() => {
            recommendationStore.toggleVisible()
          }}
        />
        <div className="mt-10 text-lg">{rec.location}</div>
        <div className="sm:flex">
          <div>
            <Result rec={rec} showDesc={false} className="ml-0" />
            <a
              target="_blank"
              href={`https://www.tripadvisor.ca/Search?q=${encodeURIComponent(rec.location)}`}
              rel="noopener noreferrer"
            >
              <div className="flex text-sm text-gray-600 mt-1 ml-4">
                Learn more on Tripadvisor&nbsp;
                <Image src={"/tripadvisor.svg"} alt={"Trip advisor"} width={20} height={20} />
              </div>
            </a>
          </div>
          <div className="mt-5 sm:mx-4"> {rec?.description}</div>
        </div>
      </div>
    </div>
  )
}

import { Recommendation } from "@prisma/client"
import { create } from "zustand"

interface RecommendationState {
  isVisible: boolean
  targetRecommendation?: Recommendation
  toggleVisible: () => void
  setRecommendationState: (newState: Partial<RecommendationState>) => void
}

const useRecommendationStore = create<RecommendationState>((set) => ({
  isVisible: false,
  targetRecommendation: undefined,
  toggleVisible: () =>
    set((state) => ({
      isVisible: !state.isVisible,
    })),
  setRecommendationState: (newState) =>
    set((state) => ({
      ...state,
      ...newState,
    })),
}))

export default useRecommendationStore

import { create } from "zustand"

interface LoginState {
  isVisible: boolean
  toggleVisible: () => void
}

const useLoginStore = create<LoginState>((set) => ({
  isVisible: false,
  toggleVisible: () =>
    set((state) => ({
      isVisible: !state.isVisible,
    })),
}))

export default useLoginStore

import { create } from "zustand"

interface UserState {
  userId: string
  setUserState: (newState: Partial<UserState>) => void
}

const useUserStore = create<UserState>((set) => ({
  userId: "",
  setUserState: (newState) =>
    set((state) => ({
      ...state,
      ...newState,
    })),
}))

export default useUserStore

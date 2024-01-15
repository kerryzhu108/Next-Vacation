import { create } from "zustand"
import { MenuOptions } from "../constants"

interface UserState {
  location: MenuOptions
  setLocation: (location: MenuOptions) => void
}

const useUserStore = create<UserState>((set) => ({
  location: MenuOptions.HOME,
  setLocation: (location: MenuOptions) =>
    set((state) => ({
      ...state,
      location,
    })),
}))

export default useUserStore

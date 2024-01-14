"use client"

import { Dispatch, SetStateAction, createContext, useState } from "react"

interface IGlobalState {
  recommendations: {
    [location: string]: string
  }
}

export const GlobalStateContext = createContext({
  state: {} as Partial<IGlobalState>,
  setState: {} as Dispatch<SetStateAction<Partial<IGlobalState>>>,
})

export const GlobalStateProvider = ({
  children,
  value = {} as IGlobalState,
}: {
  children: React.ReactNode
  value?: Partial<IGlobalState>
}) => {
  const [state, setState] = useState(value)
  return <GlobalStateContext.Provider value={{ state, setState }}>{children}</GlobalStateContext.Provider>
}

import { useContext } from "react"
import { GlobalStateContext } from "../GlobalStateProvider"

export default function Result() {
  const globalState = useContext(GlobalStateContext)

  console.log(globalState.state.recommendations)
  return <div>results page</div>
}

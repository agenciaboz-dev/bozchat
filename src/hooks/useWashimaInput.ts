import { useContext } from "react"
import WashimaInputContext from "../contexts/washimaInputContext"

export const useWashimaInput = () => {
    const context = useContext(WashimaInputContext)

    return { ...context }
}

import { useContext } from "react"
import ThemeContext from "../contexts/themeContext"

export const useTheme = () => {
    const themeContext = useContext(ThemeContext)

    return { ...themeContext }
}

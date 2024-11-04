import { useContext } from "react"
import ThemeContext from "../contexts/themeContext"

export const useColors = () => {
    const themeContext = useContext(ThemeContext)

    return { ...themeContext.current_theme }
}

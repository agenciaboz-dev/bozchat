import { createTheme } from "@mui/material"
import { useDarkMode } from "./useDarkMode"
// import { useMemo } from "react"
import { useColors } from "./useColors"
import { useMemo } from "react"
import { ptBR } from "@mui/x-data-grid/locales"

export const useMuiTheme = () => {
    const { darkMode } = useDarkMode()
    const colors = useColors()

    const THEME = useMemo(
        () =>
            createTheme(
                {
                    typography: {
                        fontFamily: ["Montserrat", "Futura Medium BT"].join(","),
                    },
                    palette: {
                        mode: darkMode ? "dark" : "light",

                        primary: {
                            main: colors.primary,
                        },
                        secondary: {
                            main: colors.secondary,
                        },

                        background: {
                            default: colors.background.primary,
                            paper: colors.background.secondary,
                        },

                        text: {
                            primary: colors.text.primary,
                            secondary: colors.text.secondary,
                        },

                        success: {
                            main: colors.success,
                        },

                        warning: {
                            main: colors.warning,
                        },
                    },
                    components: {
                        MuiMenuList: { defaultProps: { sx: { bgcolor: colors.background.primary } } },
                        MuiList: { defaultProps: { sx: { bgcolor: colors.background.primary } } },
                    },
                },
                ptBR
            ),
        [colors, darkMode]
    )

    return THEME
}

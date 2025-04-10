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
                        fontFamily: ["Futura Medium BT"].join(","),
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
                            disabled: colors.text.terciary,
                        },

                        success: {
                            main: colors.success,
                        },

                        warning: {
                            main: colors.warning,
                        },
                    },
                    components: {
                        MuiMenuList: { defaultProps: { sx: { backgroundColor: colors.background.primary } } },
                        MuiList: { defaultProps: { sx: { backgroundColor: colors.background.primary } } },
                        MuiDataGrid: {
                            styleOverrides: {
                                columnHeader: {
                                    backgroundColor: darkMode ? undefined : "#e9e9e9",
                                    color: colors.text.secondary,
                                },
                                cell: {
                                    color: colors.text.secondary,
                                },
                            },
                        },
                        MuiAutocomplete: {
                            styleOverrides: {
                                listbox: { width: "100%", backgroundColor: colors.background.primary },
                            },
                        },
                        MuiButton: { styleOverrides: { contained: { color: colors.secondary } } },
                        MuiCircularProgress: { defaultProps: { size: "1.5rem", color: "secondary" } },
                    },
                },
                ptBR
            ),
        [colors, darkMode]
    )

    return THEME
}

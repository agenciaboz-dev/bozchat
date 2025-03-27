import React from 'react'
import { Box, Switch, SxProps, Theme } from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { useDarkMode } from "../../hooks/useDarkMode"

interface ThemeSwitchProps {
    sx?: SxProps<Theme>
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ sx }) => {
    const { darkMode, toogleDarkMode } = useDarkMode()

    return (
        <Box sx={{ marginTop: "auto", alignItems: "center", padding: "1vw", ...sx }}>
            <LightMode color={darkMode ? "disabled" : "primary"} />
            <Switch checked={darkMode} onChange={() => toogleDarkMode()} />
            <DarkMode color={darkMode ? "secondary" : "disabled"} />
        </Box>
    )
}
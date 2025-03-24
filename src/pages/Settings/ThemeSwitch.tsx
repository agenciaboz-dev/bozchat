import React from 'react'
import {Box, Switch} from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useDarkMode } from '../../hooks/useDarkMode'

interface ThemeSwitchProps {
    
}

export const ThemeSwitch:React.FC<ThemeSwitchProps> = ({  }) => {
    const {darkMode, toogleDarkMode} = useDarkMode()
    
    return (
        <Box sx={{ marginTop: "auto", alignItems: "center", padding: "1vw" }}>
            <LightMode color={darkMode ? "disabled" : "primary"} />
            <Switch checked={darkMode} onChange={() => toogleDarkMode()} />
            <DarkMode color={darkMode ? "secondary" : "disabled"} />
        </Box>
    )
}
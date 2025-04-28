import React, { Dispatch, SetStateAction } from "react"
import { MenuItem, useMediaQuery } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import colors, { default_colors } from "../style/colors"
import { useDarkMode } from "../hooks/useDarkMode"

interface ToolButtonProps {
    label: React.ReactNode
    parentRoute: string
    route: string
    setShowInformations?: Dispatch<SetStateAction<boolean>>
    payload?: any
}

export const ToolButton: React.FC<ToolButtonProps> = ({ label, parentRoute, route, setShowInformations, payload }) => {
    const { darkMode } = useDarkMode()
    const navigate = useNavigate()
    const splited_pathname = useLocation().pathname.split(parentRoute)
    const isMobile = useMediaQuery("(orientation: portrait)")
    const active = !isMobile && splited_pathname.length > 1 ? splited_pathname[1] == route : false

    return (
        <MenuItem
            sx={{
                bgcolor: active ? colors.primary : "",
                color: active ? "white" : darkMode ? "" : default_colors.text.secondary,
                fontWeight: active ? "bold" : "normal",
                pointerEvents: active ? "none" : "",
                padding: isMobile ? "3vw 5vw" : "",
            }}
            onClick={() => {
                navigate(`/${parentRoute}${route}`, { state: payload })
                if (isMobile && setShowInformations) {
                    setShowInformations(true)
                }
            }}
        >
            {label}
        </MenuItem>
    )
}

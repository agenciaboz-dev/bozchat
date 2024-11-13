import React, { Dispatch, SetStateAction } from "react"
import { MenuItem, useMediaQuery } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import colors from "../../style/colors"

interface ToolButtonProps {
    label: string
    route: string
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const ToolButton: React.FC<ToolButtonProps> = ({ label, route, setShowInformations }) => {
    const navigate = useNavigate()
    const splited_pathname = useLocation().pathname.split("nagazap")
    const isMobile = useMediaQuery("(orientation: portrait)")
    const active = !isMobile && splited_pathname.length > 1 ? splited_pathname[1] == route : false

    return (
        <MenuItem
            sx={{
                bgcolor: active ? colors.primaryLight : "",
                color: active ? "white" : "",
                fontWeight: active ? "bold" : "normal",
                pointerEvents: active ? "none" : "",
            }}
            onClick={() => {
                navigate(`/nagazap${route}`)
                if (isMobile) {
                    setShowInformations(true)
                }
            }}
        >
            {label}
        </MenuItem>
    )
}

import React from "react"
import { Box, MenuItem } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import colors from "../../style/colors"

interface ToolButtonProps {
    label: string
    route: string
}

export const ToolButton: React.FC<ToolButtonProps> = ({ label, route }) => {
    const navigate = useNavigate()
    const splited_pathname = useLocation().pathname.split("nagazap")
    const active = splited_pathname.length > 1 ? splited_pathname[1] == route : false

    return (
        <MenuItem
            sx={{
                bgcolor: active ? colors.primaryLight : "",
                color: active ? "white" : "",
                fontWeight: active ? "bold" : "normal",
                pointerEvents: active ? "none" : "",
            }}
            onClick={() => navigate(`/nagazap${route}`)}
        >
            {label}
        </MenuItem>
    )
}

import React from "react"
import { Box, Paper, useMediaQuery } from "@mui/material"
import { Title2 } from "../../components/Title"

interface SubrouteProps {
    children?: React.ReactNode
    title: string
    right?: React.ReactNode
    left?: React.ReactNode
    space?: boolean
    elevation?: number
}

export const Subroute: React.FC<SubrouteProps> = ({ children, title, right, left, space, elevation }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Paper
            elevation={elevation}
            sx={{
                flexDirection: "column",
                gap: "2vw",
                padding: "2vw",
                width: "99%",
                bgcolor: "background.paper",
                borderRadius: isMobile ? "2vw" : "0 4px 4px 0",
                overflowY: "auto",
            }}
        >
            <Title2 name={title} right={right ? right : undefined} left={left ? left : undefined} space={space} />
            {children}
        </Paper>
    )
}

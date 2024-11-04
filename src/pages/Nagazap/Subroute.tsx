import React from "react"
import { Box, Paper } from "@mui/material"
import { Title2 } from "../../components/Title"

interface SubrouteProps {
    children?: React.ReactNode
    title: string
    right?: React.ReactNode
}

export const Subroute: React.FC<SubrouteProps> = ({ children, title, right }) => {
    return (
        <Paper
            sx={{
                flexDirection: "column",
                gap: "2vw",
                padding: "2vw",
                width: "99%",
                bgcolor: "background.default",
                borderTopRightRadius: "2vw",
                overflowY: "auto",
            }}
        >
            <Title2 name={title} right={right} />
            {children}
        </Paper>
    )
}

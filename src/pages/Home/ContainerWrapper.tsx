import React from "react"
import { Box, Grid, Paper } from "@mui/material"

interface ContainerWrapperProps {
    children: React.ReactNode
}

export const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
    return (
        <Paper
            sx={{
                height: "39vh",
                width: "100%",
                bgcolor: "background.default",
                color: "primary.main",
                // borderRadius: "0 3vw",
                padding: "2vw",
                flexDirection: "column",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderBottom: "solid 3px",
                borderBottomColor: "primary.main",
                overflowY: "auto",
                gap: "1vw",
            }}
        >
            {children}
        </Paper>
    )
}

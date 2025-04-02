import React from "react"
import { Box, CircularProgress, LinearProgress, useMediaQuery } from "@mui/material"
import { useDarkMode } from "../hooks/useDarkMode"

interface WagaLoadingProps {}

export const WagaLoading: React.FC<WagaLoadingProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", position: "relative", justifyContent: "center", alignItems: "center" }}>
            <img src={"/logos/1.png"} style={{ width: isMobile ? "25vw" : "13vw", position: "absolute" }} draggable={false} />
            <CircularProgress size={isMobile ? "40vw" : "20vw"} sx={{ color: "primary.main" }} />
            {/* <LinearProgress sx={{ width: "30vw" }} /> */}
        </Box>
    )
}

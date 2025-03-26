import React from "react"
import { Box, CircularProgress, LinearProgress, useMediaQuery } from "@mui/material"

interface WagaLoadingProps {}

export const WagaLoading: React.FC<WagaLoadingProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", position: "relative", justifyContent: "center", alignItems: "center" }}>
            <img src={"/logos/1.png"} style={{ width: isMobile ? "25vw" : "13vw", position: "absolute" }} draggable={false} />
            <CircularProgress size={"20vw"} sx={{}} />
            {/* <LinearProgress sx={{ width: "30vw" }} /> */}
        </Box>
    )
}

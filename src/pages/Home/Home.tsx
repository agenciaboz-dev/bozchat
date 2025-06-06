import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { Header } from "../../components/Header/Header"
import { backgroundStyle } from "../../style/background"
import { WashimaStatistics } from "./WashimaStatistics"
import { NagazapStatistics } from "./NagazapStatistics"

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box
                sx={{
                    flex: 1,
                    gap: isMobile ? "5vw" : "2vw",
                    padding: isMobile ? "5vw" : "2vw",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                <WashimaStatistics />
                <NagazapStatistics />
            </Box>
        </Box>
    )
}

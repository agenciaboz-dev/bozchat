import React from "react"
import { Box, Grid, useMediaQuery } from "@mui/material"
import { Header } from "../../components/Header"
import { backgroundStyle } from "../../style/background"
import { WashimaStatistics } from "./WashimaStatistics"
import { NagazapStatistics } from "./NagazapStatistics"

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={backgroundStyle}>
            <Header />
            <Box
                sx={{
                    flex: 1,
                    gap: "2vw",
                    padding: "2vw",
                    flexDirection: isMobile ? "column" : "row",
                    // overflow: "auto",
                }}
            >
                <WashimaStatistics />
                <NagazapStatistics />
            </Box>
        </Box>
    )
}

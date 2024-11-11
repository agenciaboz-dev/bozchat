import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { Header } from "../../components/Header"
import { backgroundStyle } from "../../style/background"
import { WashimaStatistics } from "./WashimaStatistics"
import { NagazapStatistics } from "./NagazapStatistics"

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={{ ...backgroundStyle, overflow: "auto" }}>
            <Header />
            <Box
                sx={{
                    flex: 1,
                    gap: "2vw",
                    padding: "2vw",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                <WashimaStatistics />
                <NagazapStatistics />
            </Box>
        </Box>
    )
}

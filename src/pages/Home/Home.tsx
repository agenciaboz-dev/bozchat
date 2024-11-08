import React from "react"
import { Box, Grid } from "@mui/material"
import { Header } from "../../components/Header"
import { backgroundStyle } from "../../style/background"
import { WashimaStatistics } from "./WashimaStatistics"
import { NagazapStatistics } from "./NagazapStatistics"

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
    return (
        <Box sx={backgroundStyle}>
            <Header />
            <Box sx={{ flex: 1, gap: "2vw", padding: "2vw" }}>
                <WashimaStatistics />
                <NagazapStatistics />
            </Box>
        </Box>
    )
}

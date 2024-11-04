import React from "react"
import { Box, Grid } from "@mui/material"
import { Header } from "../../components/Header"
import { backgroundStyle } from "../../style/background"

interface HomeProps {
}

export const Home: React.FC<HomeProps> = ({  }) => {
    return (
        <Box sx={backgroundStyle} className='home'>
        </Box>
    )
}

import React from "react"
import { Box, Typography } from "@mui/material"
import { Bot } from "../../types/server/class/Bot/Bot"
import { Subroute } from "../Nagazap/Subroute"

interface HomeProps {
    bots: Bot[]
}

export const Home: React.FC<HomeProps> = ({ bots }) => {
    return (
        <Subroute title="Início">
            <Typography>{bots.length} bots</Typography>
        </Subroute>
    )
}

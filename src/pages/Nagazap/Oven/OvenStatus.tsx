import React from "react"
import { Box, Tooltip, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { HourglassFull, WifiTethering } from "@mui/icons-material"
import Lottie from "lottie-react"
import animation from "../../../lotties/foguinho.json"

interface OvenStatusProps {
    nagazap: Nagazap
    small_icon?: boolean
}

export const OvenStatus: React.FC<OvenStatusProps> = ({ nagazap, small_icon }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        !nagazap.paused && (
            <Lottie animationData={animation} loop={true} style={{ width: small_icon ? (isMobile ? "3vw" : "0.9vw") : isMobile ? "8vw" : "2.6vw" }} />
        )
    )
}

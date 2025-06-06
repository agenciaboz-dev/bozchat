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
            <Lottie
                animationData={animation}
                loop={true}
                style={{
                    width: small_icon ? (isMobile ? "8vw" : "2vw") : isMobile ? "8vw" : "3vw",
                    position: small_icon ? "absolute" : undefined,
                    top: small_icon ? (isMobile ? "-1vw" : "-0.5vw") : 0,
                    left: small_icon ? (isMobile ? 0 : "-0.25vw") : undefined,
                }}
            />
        )
    )
}

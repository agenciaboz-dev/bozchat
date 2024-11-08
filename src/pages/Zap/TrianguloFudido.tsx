import React from "react"
import { Box, useMediaQuery } from "@mui/material"

interface TriaguloFudidoProps {
    color: string
    alignment: "left" | "right"
}

export const TrianguloFudido: React.FC<TriaguloFudidoProps> = ({ color, alignment }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const size = isMobile ? "2.8vw" : "0.6vw"
    const offset = isMobile ? "2.5vw" : "0.55vw"

    return (
        <Box
            sx={{
                width: 0,
                height: 0,
                borderLeft: alignment === "left" ? `${size} solid transparent` : undefined,
                borderRight: alignment === "right" ? `${size} solid transparent` : undefined,
                borderTop: `${size} solid ${color}`,
                position: "absolute",
                top: 0,
                [alignment]: `-${offset}`,
                borderTopRightRadius: alignment === "right" ? size : undefined,
                borderBottomRightRadius: alignment === "right" ? size : undefined,

                borderTopLeftRadius: alignment === "left" ? size : undefined,
                borderBottomLeftRadius: alignment === "left" ? size : undefined,
            }}
        />
    )
}

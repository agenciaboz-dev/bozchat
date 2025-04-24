import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { Warning } from "@mui/icons-material"

interface PhoneOnlyProps {}

export const PhoneOnly: React.FC<PhoneOnlyProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={{ alignItems: "center", gap: isMobile ? "3vw" : "0.5vw", fontSize: isMobile ? "1rem" : "0.8rem", color: "text.secondary" }}>
            <Warning fontSize={isMobile ? "medium" : "small"} />
            Mensagem disponível apenas no telefone
        </Box>
    )
}

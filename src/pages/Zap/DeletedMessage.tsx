import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { DoNotDisturb } from "@mui/icons-material"

interface DeletedMessageProps {
    customText?: string
}

export const DeletedMessage: React.FC<DeletedMessageProps> = ({ customText }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={{ alignItems: "center", gap: isMobile ? "2vw" : "0.5vw", fontSize: "0.8rem", color: "text.secondary" }}>
            <DoNotDisturb fontSize="small" />
            {customText || "Mensagem deletada"}
        </Box>
    )
}

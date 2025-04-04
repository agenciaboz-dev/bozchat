import React from "react"
import { Box } from "@mui/material"
import { Warning } from "@mui/icons-material"

interface PhoneOnlyProps {}

export const PhoneOnly: React.FC<PhoneOnlyProps> = (props) => {
    return (
        <Box sx={{ alignItems: "center", gap: "0.25vw", fontSize: "0.8rem", color: "text.secondary" }}>
            <Warning fontSize="small" />
            Mensagem disponível apenas no telefone
        </Box>
    )
}

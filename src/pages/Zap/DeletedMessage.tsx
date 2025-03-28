import React from "react"
import { Box } from "@mui/material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { DoNotDisturb } from "@mui/icons-material"

interface DeletedMessageProps {
    customText?: string
}

export const DeletedMessage: React.FC<DeletedMessageProps> = ({ customText }) => {
    return (
        <Box sx={{ alignItems: "center", gap: "0.25vw", fontSize: "0.8rem" }}>
            <DoNotDisturb fontSize="small" />
            {customText || "Mensagem deletada"}
        </Box>
    )
}

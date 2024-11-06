import React from "react"
import { Box } from "@mui/material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface DeletedMessageProps {
    message: WashimaMessage
}

export const DeletedMessage: React.FC<DeletedMessageProps> = ({ message }) => {
    return <Box sx={{}}>Mensagem deletada</Box>
}

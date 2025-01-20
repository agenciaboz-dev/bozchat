import React from "react"
import { Box, IconButton, Paper, Typography } from "@mui/material"
import { useWashimaInput } from "../../hooks/useWashimaInput"
import { Close } from "@mui/icons-material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface QuotedMessageProps {
    message?: WashimaMessage
}

export const QuotedMessage: React.FC<QuotedMessageProps> = ({ message }) => {
    const washimaInput = useWashimaInput()

    return (
        <Paper
            sx={{
                flex: 1,
                borderLeft: "4px solid",
                borderColor: "primary.main",
                padding: "0.5vw",
                color: "secondary.main",
                maxHeight: "7.9vh",
                overflow: "auto",
                textAlign: "left",
                bgcolor: "#00000055",
            }}
        >
            <Box sx={{ flexDirection: "column", flex: 1 }}>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>Respondendo:</Typography>
                <Typography sx={{ fontSize: "0.8rem" }}>
                    {message ? (message.hasMedia ? "media" : message.body) : washimaInput.replyMessage?.body}
                </Typography>
            </Box>
            {!message && (
                <IconButton sx={{ padding: "0.3vw", margin: "0.3vw" }} onClick={() => washimaInput.setReplyMessage(null)}>
                    <Close fontSize="small" />
                </IconButton>
            )}
        </Paper>
    )
}

import React, { useState } from "react"
import { Box, IconButton, Paper, Typography } from "@mui/material"
import { useWashimaInput } from "../../hooks/useWashimaInput"
import { Close } from "@mui/icons-material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { MediaChip } from "../../components/MediaChip"
import { api } from "../../api"
import { useVisibleCallback } from "burgos-use-visible-callback"

interface QuotedMessageProps {
    message?: WashimaMessage
}

export const QuotedMessage: React.FC<QuotedMessageProps> = ({ message }) => {
    const washimaInput = useWashimaInput()
    const current_message = message || washimaInput.replyMessage
    const ref = useVisibleCallback(() => {
        if (current_message?.hasMedia) {
            fetchMediaMetadata()
        }
    }, {})

    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()

    const fetchMediaMetadata = async () => {
        try {
            const response = await api.get("/washima/media-metadata", {
                params: { washima_id: current_message?.washima_id, message_id: current_message?.sid },
            })
            setMediaMetaData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

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
            ref={ref}
        >
            <Box sx={{ flexDirection: "column", flex: 1, gap: "0.2vw" }}>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>Respondendo:</Typography>
                <Typography sx={{ fontSize: "0.8rem" }}>
                    {mediaMetaData?.mimetype ? <MediaChip mimetype={mediaMetaData?.mimetype} /> : current_message?.body}
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

import React from "react"
import { Box } from "@mui/material"
import { MessageAck } from "./MessageAck"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface MessageDateContainerProps {
    message: WashimaMessage
    is_audio?: boolean
    is_image?: boolean
    is_document: boolean
}

export const MessageDateContainer: React.FC<MessageDateContainerProps> = ({ message, is_audio, is_image, is_document }) => {
    return (
        <Box
            sx={{
                position: is_audio || is_document ? "absolute" : undefined,
                bottom: "0.5vw",
                right: "0.5vw",
                fontSize: "0.6vw",
                marginTop: is_audio ? "0.5vw" : undefined,
                padding: is_image ? "0 0.25vw" : undefined,
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0.2vw",
            }}
        >
            <p>{new Date(message.timestamp * 1000).toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })}</p>
            <MessageAck message={message} />
        </Box>
    )
}

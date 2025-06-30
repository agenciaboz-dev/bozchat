import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { MessageAck } from "./MessageAck"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface MessageDateContainerProps {
    message: WashimaMessage
    is_audio?: boolean
    is_image?: boolean
    is_document: boolean
    from_me?: boolean
}

export const MessageDateContainer: React.FC<MessageDateContainerProps> = ({ message, is_audio, is_image, is_document, from_me }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Box
            sx={{
                position: is_audio || is_document ? "absolute" : undefined,
                bottom: isMobile ? "2vw" : "0.5vw",
                right: isMobile ? "3vw" : "0.5vw",
                fontSize: isMobile ? "3vw" : "0.6vw",
                marginTop: is_audio ? "0.5vw" : undefined,
                padding: is_image ? "0.25vw 0.25vw 0 0.25vw" : undefined,
                justifyContent: "flex-end",
                alignItems: "center",
                gap: isMobile ? "1vw" : "0.2vw",
            }}
        >
            {message.edited && <Box>Editado</Box>}
            <p>{new Date(message.timestamp * 1000).toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })}</p>
            {from_me && <MessageAck message={message} />}
        </Box>
    )
}

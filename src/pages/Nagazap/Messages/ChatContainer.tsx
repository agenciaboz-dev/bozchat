import React from "react"
import { Box, IconButton, Paper, useMediaQuery } from "@mui/material"
import { NagaChat } from "../../../types/NagaChat"
import { MessageContainer } from "./MessageContainer"
import { Cancel } from "@mui/icons-material"
import { MessageAuthor } from "../../Zap/MessageAuthor"

interface ChatContainerProps {
    chat: NagaChat
    onClose: () => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onClose }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Paper
            elevation={15}
            sx={{
                flex: 1,
                // justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: "background.paper",
                // height: isMobile ? "77vh" : "90vh",
                padding: isMobile ? "2vw" : "0.5vw 1vw",
                color: "secondary.main",
                gap: "0.5vw",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    gap: isMobile ? "3vw" : "2vw",
                    alignItems: "center",
                    // height: isMobile ? "7vh" : "5vh",
                    padding: isMobile ? "2vw" : "",
                }}
            >
                <MessageAuthor author={chat.lastMessage.name + " - " + chat.lastMessage.from} />
                <Box sx={{ marginLeft: "auto" }}>
                    <IconButton sx={{ color: "white", padding: isMobile ? "0" : "" }} onClick={onClose}>
                        <Cancel />
                    </IconButton>
                </Box>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    height: "22vw",
                    bgcolor: "background.default",
                    overflowY: "scroll",
                    borderRadius: isMobile ? "0 3vw 0 3vw" : "0 1.5vw 0 1.5vw",
                    padding: isMobile ? "4vw" : "2vw",
                    color: "text.secondary",
                    flexDirection: "column-reverse",
                    gap: isMobile ? "1vw" : "0.5vw",
                    position: "relative",

                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                    },
                }}
            >
                {chat.messages.map((message) => (
                    <MessageContainer key={message.id} message={message} />
                ))}
            </Box>
            {/* <WashimaInput onSubmit={onSubmit} disabled={!chat} washima={washima} chat_id={chat.id._serialized} /> */}
        </Paper>
    )
}

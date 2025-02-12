import React from "react"
import { Box, IconButton, Paper, useMediaQuery } from "@mui/material"
import { NagaChat } from "../../../types/NagaChat"
import { MessageContainer } from "./MessageContainer"
import { Cancel } from "@mui/icons-material"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { NagazapInput } from "./NagazapInput"

interface ChatContainerProps {
    chat: NagaChat
    onClose: () => void
    nagazap: Nagazap
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onClose, nagazap }) => {
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
                marginBottom: "-1vw",
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
                <MessageAuthor author={chat.name + " - " + chat.from} />
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
                    <MessageContainer key={message.id} message={message} nagazap={nagazap} />
                ))}
            </Box>
            <NagazapInput nagazap={nagazap} chat={chat} />
        </Paper>
    )
}

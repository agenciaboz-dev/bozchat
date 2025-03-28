import React from "react"
import { Box, IconButton, Paper, useMediaQuery } from "@mui/material"
import { MessageContainer } from "./MessageContainer"
import { Cancel } from "@mui/icons-material"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { NagaChat, Nagazap } from "../../../types/server/class/Nagazap"
import { NagazapInput } from "./NagazapInput"
import { DateChip } from "../../Washima/WashimaChat/DateChip"

interface ChatContainerProps {
    chat: NagaChat
    onClose: () => void
    nagazap: Nagazap
    inBoards?: boolean
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onClose, nagazap, inBoards }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Paper
            elevation={inBoards ? 0 : 5}
            sx={{
                flex: 1,
                // justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: inBoards ? "transparent" : "background.paper",
                // height: isMobile ? "77vh" : "90vh",
                padding: inBoards ? 0 : isMobile ? "2vw" : "0.5vw 1vw",
                color: "secondary.main",
                gap: inBoards ? "1vw" : "0.5vw",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                marginBottom: inBoards ? undefined : "-1vw",
                width: inBoards ? "0vw" : undefined,
            }}
        >
            {!inBoards && (
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
                        <IconButton sx={{ color: "text.secondary", padding: isMobile ? "0" : "" }} onClick={onClose}>
                            <Cancel />
                        </IconButton>
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    width: "100%",
                    height: inBoards ? "20vw" : "27vw",
                    bgcolor: "background.default",
                    overflowY: "scroll",
                    borderRadius: isMobile ? "2vw" : "4px",
                    padding: inBoards ? "1vw" : isMobile ? "4vw" : "2vw",
                    color: "text.secondary",
                    flexDirection: "column-reverse",
                    gap: isMobile ? "1vw" : "0.5vw",
                    position: "relative",

                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                    },
                }}
            >
                {chat.messages.map((message, index) => {
                    const previous_message = chat.messages[index + 1]
                    const changing_day =
                        !previous_message ||
                        new Date(Number(previous_message.timestamp)).toLocaleDateString() !== new Date(Number(message.timestamp)).toLocaleDateString()
                    return (
                        <>
                            <MessageContainer key={message.id} message={message} nagazap={nagazap} inBoards={inBoards} />
                            {changing_day && <DateChip timestamp={Number(message.timestamp)} />}
                        </>
                    )
                })}
            </Box>
            <NagazapInput nagazap={nagazap} chat={chat} />
        </Paper>
    )
}

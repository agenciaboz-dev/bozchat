import React, { useMemo } from "react"
import { Box, IconButton, Paper, useMediaQuery } from "@mui/material"
import { MessageContainer } from "./MessageContainer"
import { Cancel } from "@mui/icons-material"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { NagaChat, Nagazap } from "../../../types/server/class/Nagazap"
import { NagazapInput } from "./NagazapInput"
import { DateChip } from "../../Washima/WashimaChat/DateChip"
import { DeletedMessage } from "../../Zap/DeletedMessage"
import { canRespondNagaChat } from "../../../tools/canRespondNagaChat"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { custom_colors } from "../../../style/colors"

interface ChatContainerProps {
    chat: NagaChat
    onClose: () => void
    nagazap: Nagazap
    inBoards?: boolean
    disabledResponse?: boolean
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onClose, nagazap, inBoards, disabledResponse }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const can_respond = useMemo(() => canRespondNagaChat(chat, nagazap), [chat])

    console.log(chat)

    return (
        <Paper
            elevation={inBoards ? 0 : 5}
            sx={{
                flex: 1,
                // justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: inBoards ? "transparent" : darkMode ? "background.paper" : custom_colors.lightMode_chatWrapper,
                // height: isMobile ? "77vh" : "90vh",
                padding: inBoards ? 0 : isMobile ? "5vw" : "0.5vw 1vw",
                gap: inBoards ? "1vw" : isMobile ? "5vw" : "0.5vw",
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
                        // gap: isMobile ? "3vw" : "2vw",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // height: isMobile ? "7vh" : "5vh",
                        // padding: isMobile ? "2vw" : "",
                    }}
                >
                    <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
                        <MessageAuthor author={chat.name} phone={chat.from} />
                    </Box>
                    <IconButton sx={{ color: "text.secondary", padding: isMobile ? "0" : "" }} onClick={onClose}>
                        <Cancel />
                    </IconButton>
                </Box>
            )}

            <Box
                sx={{
                    width: "100%",
                    height: inBoards ? (disabledResponse ? "21.5vw" : "20vw") : isMobile ? undefined : "27vw",
                    flex: isMobile ? 1 : undefined,
                    bgcolor: darkMode ? "background.default" : custom_colors.lightMode_chatBackground,
                    border: darkMode ? `1px solid ${custom_colors.darkMode_border}` : `1px solid ${custom_colors.lightMode_border}`,
                    boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    borderRadius: isMobile ? "2vw" : "4px",
                    padding: inBoards ? "1vw" : isMobile ? "4vw" : "2vw",
                    color: "text.secondary",
                    flexDirection: "column-reverse",
                    gap: isMobile ? "1vw" : "0.5vw",
                    position: "relative",
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
            {can_respond ? <NagazapInput nagazap={nagazap} chat={chat} /> : <DeletedMessage customText="Tempo de resposta excedido (24 horas)" />}
        </Paper>
    )
}

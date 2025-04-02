import React, { useMemo } from "react"
import { Box, Chip, IconButton, Paper, Tooltip, useMediaQuery } from "@mui/material"
import { MessageContainer } from "./MessageContainer"
import { Cancel, Hub } from "@mui/icons-material"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { NagaChat, Nagazap } from "../../../types/server/class/Nagazap"
import { NagazapInput } from "./NagazapInput"
import { DateChip } from "../../Washima/WashimaChat/DateChip"
import { DeletedMessage } from "../../Zap/DeletedMessage"
import { canRespondNagaChat } from "../../../tools/canRespondNagaChat"

interface ChatContainerProps {
    chat: NagaChat
    onClose: () => void
    nagazap: Nagazap
    inBoards?: boolean
    disabledResponse?: boolean
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onClose, nagazap, inBoards, disabledResponse }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const can_respond = useMemo(() => canRespondNagaChat(chat, nagazap), [chat])

    const last_template = useMemo(
        () =>
            nagazap.sentMessages
                .filter((item) => item.data.contacts[0].wa_id.slice(2) === chat.from)
                .reduce((last, log) => (last.timestamp > log.timestamp ? last : log)).template_name,
        [nagazap, chat]
    )

    return (
        <Paper
            elevation={inBoards ? 0 : 5}
            sx={{
                flex: 1,
                // justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: inBoards ? "transparent" : "background.paper",
                // height: isMobile ? "77vh" : "90vh",
                padding: inBoards ? 0 : isMobile ? "5vw" : "0.5vw 1vw",
                // color: "secondary.main",
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
                        <MessageAuthor author={chat.name + " - " + chat.from} />
                        <Tooltip title="último template enviado para este contato" arrow>
                            <Chip icon={<Hub color="primary" />} label={last_template} size="small" />
                        </Tooltip>
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
                    bgcolor: "background.default",
                    overflowY: "scroll",
                    overflowX: "hidden",
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
            {can_respond ? <NagazapInput nagazap={nagazap} chat={chat} /> : <DeletedMessage customText="Tempo de resposta excedido (24 horas)" />}
        </Paper>
    )
}

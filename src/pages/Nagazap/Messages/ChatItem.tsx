import React from "react"
import { Avatar, Box, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { TemplatePreview } from "../TemplateForm/TemplatePreview"
import { NagaChat } from "../../../types/server/class/Nagazap"
import { custom_colors } from "../../../style/colors"

interface ChatItemProps {
    chat: NagaChat
    onChatClick: (chat: NagaChat) => void
    active?: boolean
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, onChatClick, active }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const formatTime = useFormatMessageTime()

    return (
        <MenuItem
            sx={{
                padding: 0,
                margin: 0,
                whiteSpace: "normal",
                borderRadius: "0 4px 4px 4px",
            }}
            onClick={() => onChatClick(chat)}
        >
            <Paper
                elevation={active ? 5 : undefined}
                sx={{
                    flexDirection: "column",
                    gap: isMobile ? "2vw" : "0.5vw",
                    padding: isMobile ? "4vw" : "0.5vw",
                    position: "relative",
                    borderRadius: "0 4px 4px 4px",
                    borderTopLeftRadius: 0,
                    color: "text.secondary",
                    flex: 1,
                }}
            >
                <MessageAuthor author={chat.name} phone={chat.from} />
                {(chat.lastMessage.type === "image" || chat.lastMessage.type === "sticker") && (
                    <Avatar
                        variant="rounded"
                        sx={{
                            width: "3vw",
                            height: "auto",
                            maxHeight: isMobile ? "80vw" : "20vw",
                            margin: "0 auto",
                        }}
                        src={chat.lastMessage.text}
                    />
                )}
                {(chat.lastMessage.type === "text" ||
                    chat.lastMessage.type === "button" ||
                    chat.lastMessage.type === "reaction" ||
                    chat.lastMessage.type === "interactive") && (
                    <Typography
                        sx={{
                            wordBreak: "break-word",
                            color: "text.secondary",
                            fontSize: chat.lastMessage.type === "reaction" ? "3rem" : undefined,
                            alignSelf: chat.lastMessage.type === "reaction" ? "center" : undefined,
                            maxHeight: isMobile ? "10vh" : "3vw",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        }}
                    >
                        {chat.lastMessage.text}
                    </Typography>
                )}

                {chat.lastMessage.type === "template" && <TemplatePreview components={chat.lastMessage.template?.components || []} realMessage />}

                {chat.lastMessage.type === "audio" && (
                    <AudioPlayer
                        containerSx={{ width: undefined, height: isMobile ? undefined : "3vw", paddingBottom: isMobile ? "4vw" : undefined }}
                        media={{ source: chat.lastMessage.text, ext: chat.lastMessage.text.split(".")[chat.lastMessage.text.split(".").length - 1] }}
                    />
                )}

                <Box
                    sx={{
                        fontSize: isMobile ? "3vw" : "0.6vw",
                        marginLeft: "auto",
                        position:
                            chat.lastMessage.type === "audio" || chat.lastMessage.type === "sticker" || chat.lastMessage.type === "reaction"
                                ? "absolute"
                                : undefined,
                        right: "0.5vw",
                        bottom: "0.5vw",
                        color: "text.secondary",
                    }}
                >
                    {formatTime(new Date(Number(chat.lastMessage.timestamp)))}
                </Box>
                <TrianguloFudido
                    alignment="left"
                    color={
                        darkMode
                            ? active
                                ? custom_colors.darkMode_chatItemTriangleActive
                                : custom_colors.darkMode_chatItemTriangleInactive
                            : custom_colors.lightMode_chatItemTriangle
                    }
                />
            </Paper>
        </MenuItem>
    )
}

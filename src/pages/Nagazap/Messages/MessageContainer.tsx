import React, { useMemo } from "react"
import { Avatar, Box, Grid, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { Title2 } from "../../../components/Title"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { DeletedMessage } from "../../Zap/DeletedMessage"

interface MessageContainerProps {
    message: NagaMessage
    nagazap: Nagazap
    inBoards?: boolean
    disabledIcon?: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, nagazap, inBoards, disabledIcon }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const formatTime = useFormatMessageTime()
    const lightModePrimary = "#99dff9"
    const lightModeSecondary = "#D9D9D9"
    const primary = "#0F6787"
    const secondary = "#2a323c"

    const from_me = useMemo(() => message.name === nagazap.displayPhone, [message])

    return (
        <Paper
            elevation={0}
            sx={{
                flexDirection: "column",
                gap: isMobile ? "2vw" : "0.5vw",
                padding: isMobile ? "4vw" : "0.5vw",
                position: "relative",
                borderRadius: "0.5vw",
                borderTopLeftRadius: from_me ? undefined : 0,
                borderTopRightRadius: from_me ? 0 : undefined,
                color: "secondary.main",
                paddingBottom: inBoards ? undefined : message.type === "audio" ? "1vw" : undefined,
                width: "fit-content",
                minWidth: "5vw",
                minHeight: "2vw",
                alignSelf: from_me ? "flex-end" : undefined,
                bgcolor:
                    message.type === "sticker"
                        ? "transparent"
                        : from_me
                        ? darkMode
                            ? primary
                            : lightModePrimary
                        : darkMode
                        ? secondary
                        : lightModeSecondary,
                maxWidth: inBoards ? "17vw" : undefined,
                marginBottom: message.type === "sticker" ? "0.5vw" : undefined,
            }}
        >
            {disabledIcon && <DeletedMessage customText="Tempo de resposta excedido (24 horas)" />}
            {(message.type === "image" || message.type === "sticker") && (
                <PhotoView src={message.text}>
                    <MenuItem sx={{ padding: 0, justifyContent: "center", pointerEvents: message.type === "sticker" ? "none" : undefined }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: message.type === "image" ? (inBoards ? "15vw" : "20vw") : inBoards ? "5vw" : "10vw",
                                height: "auto",
                                maxHeight: inBoards ? "15vw" : isMobile ? "80vw" : "20vw",
                                borderRadius: message.type === "sticker" ? "0.75vw" : undefined,
                            }}
                            src={message.text}
                        />
                    </MenuItem>
                </PhotoView>
            )}
            {(message.type === "text" || message.type === "button" || message.type === "reaction") && (
                <Typography
                    color="#fff"
                    sx={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                        color: "text.secondary",
                        fontSize: message.type === "reaction" ? "3rem" : undefined,
                        alignSelf: message.type === "reaction" ? "center" : undefined,
                        maxWidth: "15vw",
                    }}
                >
                    {message.text}
                </Typography>
            )}

            {message.type === "audio" && (
                <AudioPlayer
                    containerSx={{
                        height: isMobile ? undefined : "3vw",
                        paddingBottom: isMobile ? "4vw" : undefined,
                    }}
                    media={{ source: message.text, ext: message.text.split(".")[message.text.split(".").length - 1] }}
                    inBoards={inBoards}
                />
            )}

            <Box
                sx={{
                    fontSize: isMobile ? "3vw" : "0.6vw",
                    marginLeft: "auto",
                    position: message.type === "audio" || message.type === "sticker" || message.type === "reaction" ? "absolute" : undefined,
                    right: "0.5vw",
                    bottom: message.type === "sticker" ? "-0.5vw" : "0.5vw",
                    color: "text.secondary",
                }}
            >
                {new Date(Number(message.timestamp)).toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })}
            </Box>
            {message.type !== "sticker" && (
                <TrianguloFudido
                    alignment={from_me ? "right" : "left"}
                    color={from_me ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary}
                />
            )}
        </Paper>
    )
}

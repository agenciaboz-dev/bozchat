import React, { useMemo } from "react"
import { Avatar, Box, Grid, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { Title2 } from "../../../components/Title"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"
import { MessageAuthor } from "../../Zap/MessageAuthor"

interface MessageContainerProps {
    message: NagaMessage
    nagazap: Nagazap
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, nagazap }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formatTime = useFormatMessageTime()
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
                paddingBottom: message.type === "audio" ? "1vw" : undefined,
                width: "fit-content",
                minWidth: "5vw",
                minHeight: "2vw",
                alignSelf: from_me ? "flex-end" : undefined,
                bgcolor: from_me ? primary : secondary,
            }}
        >
            {(message.type === "image" || message.type === "sticker") && (
                <PhotoView src={message.text}>
                    <MenuItem sx={{ padding: 0, justifyContent: "center", pointerEvents: message.type === "sticker" ? "none" : undefined }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width: message.type === "image" ? "20vw" : "10vw",
                                height: "auto",
                                maxHeight: isMobile ? "80vw" : "20vw",
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
                        // wordBreak: "break-all",
                        whiteSpace: "pre-line",
                        color: "text.secondary",
                        fontSize: message.type === "reaction" ? "3rem" : undefined,
                        alignSelf: message.type === "reaction" ? "center" : undefined,
                    }}
                >
                    {message.text}
                </Typography>
            )}

            {message.type === "audio" && (
                <AudioPlayer
                    containerSx={{ height: isMobile ? undefined : "3vw", paddingBottom: isMobile ? "4vw" : undefined }}
                    media={{ source: message.text, ext: message.text.split(".")[message.text.split(".").length - 1] }}
                />
            )}

            <Box
                sx={{
                    fontSize: isMobile ? "3vw" : "0.6vw",
                    marginLeft: "auto",
                    position: message.type === "audio" || message.type === "sticker" || message.type === "reaction" ? "absolute" : undefined,
                    right: "0.5vw",
                    bottom: "0.5vw",
                }}
            >
                {formatTime(new Date(Number(message.timestamp)))}
            </Box>
            <TrianguloFudido alignment={from_me ? "right" : "left"} color={from_me ? primary : secondary} />
        </Paper>
    )
}

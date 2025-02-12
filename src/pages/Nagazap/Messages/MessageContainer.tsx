import React from "react"
import { Avatar, Box, Grid, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { NagaMessage } from "../../../types/server/class/Nagazap"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { Title2 } from "../../../components/Title"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"
import { MessageAuthor } from "../../Zap/MessageAuthor"

interface MessageContainerProps {
    message: NagaMessage
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formatTime = useFormatMessageTime()

    return (
        <Paper
            elevation={4}
            sx={{
                flexDirection: "column",
                gap: isMobile ? "2vw" : "0.5vw",
                padding: isMobile ? "4vw" : "0.5vw",
                position: "relative",
                borderRadius: "0.5vw",
                borderTopLeftRadius: 0,
                color: "secondary.main",
                paddingBottom: message.type === "audio" ? "1vw" : undefined,
                width: "fit-content",
                minWidth: "5vw",
                minHeight: "2vw",
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
            <TrianguloFudido alignment="left" color="#2a323c" />
        </Paper>
    )
}

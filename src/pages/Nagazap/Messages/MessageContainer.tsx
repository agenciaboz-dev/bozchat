import React from "react"
import { Avatar, Box, Grid, Paper, Typography, useMediaQuery } from "@mui/material"
import { NagaMessage } from "../../../types/server/class/Nagazap"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { Title2 } from "../../../components/Title"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"

interface MessageContainerProps {
    message: NagaMessage
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formatTime = useFormatMessageTime()
    console.log(message)

    return (
        <Grid item xs={1}>
            <Box
                sx={{
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* <Box style={{ wordBreak: "break-all", whiteSpace: "pre-line", color: "text.secondary" }}>{message.text}</Box> */}

                <Grid container columns={3}>
                    <Grid item xs={1}>
                        <Paper
                            sx={{
                                // width: "object-fit",
                                // maxWidth: isMobile ? undefined : "30vw",
                                flexDirection: "column",
                                gap: isMobile ? "5vw" : "1vw",
                                padding: isMobile ? "4vw" : "0.5vw",
                                position: "relative",
                                borderRadius: "0.5vw",
                                borderTopLeftRadius: 0,
                                color: "secondary.main",
                                // margin: "0 auto",
                            }}
                        >
                            <Title2 name={`${message.name}`} right={<Box sx={{ color: "primary.main" }}>{message.from}</Box>} />
                            {(message.type === "image" || message.type === "sticker") && (
                                <PhotoView src={message.text}>
                                    <Avatar variant="rounded" sx={{ width: "100%", height: "auto", maxHeight: "20vw" }} src={message.text} />
                                </PhotoView>
                            )}
                            {(message.type === "text" || message.type === "button" || message.type === "reaction") && (
                                <Typography color="#fff" sx={{ wordBreak: "break-all", whiteSpace: "pre-line", color: "text.secondary" }}>
                                    {message.text}
                                </Typography>
                            )}

                            {message.type === "audio" && (
                                <AudioPlayer media={{ source: message.text, ext: message.text.split(".")[message.text.split(".").length - 1] }} />
                            )}

                            <Box style={{ fontSize: "0.6vw", marginLeft: "auto" }}>{formatTime(new Date(Number(message.timestamp)))}</Box>
                            <TrianguloFudido alignment="left" color="#2a323c" />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

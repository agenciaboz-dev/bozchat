import React from "react"
import { Box, Grid, Paper } from "@mui/material"
import { NagaMessage } from "../../../types/server/class/Nagazap"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"
import { Title2 } from "../../../components/Title"

interface MessageContainerProps {
    message: NagaMessage
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message }) => {
    const formatTime = useFormatMessageTime()

    return (
        <Grid item xs={1}>
            <Paper
                sx={{
                    padding: "1vw",
                    flexDirection: "column",
                    height: "100%",
                    gap: "0.75vw",
                    color: "secondary.main",
                    bgcolor: "background.default",
                }}
            >
                <Title2 name={`${message.name}`} right={<Box sx={{ color: "primary.main" }}>{message.from}</Box>} />
                <Box style={{ wordBreak: "break-all", whiteSpace: "pre-line", color: "text.secondary" }}>{message.text}</Box>
                <Box style={{ fontSize: "0.6vw", marginTop: "auto" }}>{formatTime(new Date(Number(message.timestamp)))}</Box>
            </Paper>
        </Grid>
    )
}

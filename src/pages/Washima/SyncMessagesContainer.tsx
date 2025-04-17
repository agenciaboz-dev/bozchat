import React, { useEffect, useState } from "react"
import { Box, Button, LinearProgress, Typography } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useIo } from "../../hooks/useIo"

interface SyncMessagesContainerProps {
    washima: Washima
    type: "messages" | "chat"
}

interface ProgressDto {
    message?: number
    total_messages?: number
    chat: number
    total_chats: number
}

export const SyncMessagesContainer: React.FC<SyncMessagesContainerProps> = ({ washima, type }) => {
    const io = useIo()

    const [syncedProgress, setSyncedProgress] = useState(0)
    const [totalProgress, setTotalProgress] = useState(0)

    const messages_progress_value = (syncedProgress * 100) / (totalProgress || 1)

    useEffect(() => {
        io.on(`washima:${washima.id}:sync:progress`, (data: ProgressDto) => {
            setSyncedProgress(type === "chat" ? data.chat : data.message || 0)
            setTotalProgress(type === "chat" ? data.total_chats : data.total_messages || 0)
        })

        return () => {
            io.off(`washima:${washima.id}:sync:progress`)
        }
    }, [washima])

    return (
        <Box sx={{ gap: "0.5vw", color: "primary.main", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.8rem" }}>
                {syncedProgress}/{totalProgress} ({messages_progress_value.toFixed(2)}%)
            </Typography>
            <LinearProgress variant="determinate" value={messages_progress_value} sx={{ width: "5vw" }} />
        </Box>
    )
}

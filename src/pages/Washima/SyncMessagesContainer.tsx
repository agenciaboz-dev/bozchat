import React, { useEffect, useState } from "react"
import { Box, Button, LinearProgress } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useIo } from "../../hooks/useIo"

interface SyncMessagesContainerProps {
    washima: Washima
    syncing: boolean
    onSyncPress: () => void
}

export const SyncMessagesContainer: React.FC<SyncMessagesContainerProps> = ({ washima, syncing, onSyncPress }) => {
    const io = useIo()

    const [currentChatSyncProgress, setCurrentChatSyncProgress] = useState(0)
    const [totalChatSyncProgress, setTotalChatSyncProgress] = useState(0)
    const [currentMessagesSyncProgress, setCurrentMessagesSyncProgress] = useState(0)
    const [totalMessagesSyncProgress, setTotalMessagesSyncProgress] = useState(0)

    const chat_progress_value = (currentChatSyncProgress * 100) / (totalChatSyncProgress || 1)
    const messages_progress_value = (currentMessagesSyncProgress * 100) / (totalMessagesSyncProgress || 1)

    useEffect(() => {
        io.on(`washima:${washima.id}:sync:chat`, (current: number, total: number) => {
            setCurrentChatSyncProgress(current)
            setTotalChatSyncProgress(total)
        })

        io.on(`washima:${washima.id}:sync:messages`, (current: number, total: number) => {
            setCurrentMessagesSyncProgress(current)
            setTotalMessagesSyncProgress(total)
        })

        return () => {
            io.off(`washima:${washima.id}:sync:chat`)
            io.off(`washima:${washima.id}:sync:messages`)
        }
    }, [])

    return syncing ? (
        <Box sx={{ flexDirection: "column", gap: "1vw", color: "primary.main" }}>
            Mensagens: {currentMessagesSyncProgress}/{totalMessagesSyncProgress} ({messages_progress_value.toFixed(2)}%)
            <LinearProgress variant="determinate" value={messages_progress_value} />
            Chats: {currentChatSyncProgress}/{totalChatSyncProgress} ({chat_progress_value.toFixed(2)}%)
            <LinearProgress variant="determinate" value={chat_progress_value} />
        </Box>
    ) : (
        <Button variant="outlined" onClick={onSyncPress} sx={{ fontWeight: "bold" }}>
            Sincronizar
        </Button>
    )
}

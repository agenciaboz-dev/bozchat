import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress } from "@mui/material"
import { Washima, WashimaDiskMetrics } from "../../types/server/class/Washima/Washima"
import { DiskMetricContainer } from "./DiskMetricContainer"
import { api } from "../../api"
import { SyncMessagesContainer } from "./SyncMessagesContainer"

interface WashimaToolsProps {
    washima: Washima
    fetchingMessages: boolean
    onSyncMessages: () => void
}

export const WashimaTools: React.FC<WashimaToolsProps> = ({ washima, fetchingMessages, onSyncMessages }) => {
    const [diskMetrics, setDiskMetrics] = useState<WashimaDiskMetrics | null>(null)
    const [deletingMedia, setDeletingMedia] = useState(false)
    const [deletingMessages, setDeletingMessages] = useState(false)

    const fetchMetrics = async () => {
        if (!washima) return

        try {
            const response = await api.get("/washima/tools/disk-usage", { params: { washima_id: washima.id } })
            console.log(response.data)
            setDiskMetrics(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteMedia = async () => {
        if (deletingMedia || !washima) return

        setDeletingMedia(true)
        try {
            const response = await api.delete("/washima/tools/media", { data: { washima_id: washima.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            fetchMetrics()
            setDeletingMedia(false)
        }
    }

    const deleteMessages = async () => {
        if (deletingMessages || !washima) return

        setDeletingMessages(true)
        try {
            const response = await api.delete("/washima/tools/messages", { data: { washima_id: washima.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            fetchMetrics()
            setDeletingMessages(false)
        }
    }

    useEffect(() => {
        fetchMetrics()
    }, [washima])

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1, width: "100%", padding: "2vw" }}>
            Uso de disco
            <Box sx={{ gap: "1vw" }}>
                <DiskMetricContainer label="Mensagens" value={diskMetrics?.messages} onDeletePress={deleteMessages} deleting={deletingMessages} />
                <DiskMetricContainer label="Mídia" value={diskMetrics?.media} onDeletePress={deleteMedia} deleting={deletingMedia} />
            </Box>
            Sincronizar mensagens
            <SyncMessagesContainer washima={washima} syncing={fetchingMessages} onSyncPress={onSyncMessages} />
        </Box>
    )
}

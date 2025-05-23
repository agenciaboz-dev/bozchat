import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Typography, useMediaQuery } from "@mui/material"
import { Washima, WashimaDiskMetrics } from "../../types/server/class/Washima/Washima"
import { DiskMetricContainer } from "./DiskMetricContainer"
import { api } from "../../api"
import { SyncMessagesContainer } from "./SyncMessagesContainer"
import { useUser } from "../../hooks/useUser"

interface WashimaToolsProps {
    washima: Washima
    fetchingMessages: boolean
    onSyncMessages: () => void
}

export const WashimaTools: React.FC<WashimaToolsProps> = ({ washima, fetchingMessages, onSyncMessages }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

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
            const response = await api.delete("/washima/tools/media", { data: { washima_id: washima.id }, params: { user_id: user?.id } })
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
            const response = await api.delete("/washima/tools/messages", { data: { washima_id: washima.id }, params: { user_id: user?.id } })
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
        <Box
            sx={{
                flexDirection: "column",
                gap: isMobile ? "5vw" : "1vw",
                flex: 1,
                width: "100%",
                padding: isMobile ? "5vw" : "2vw",
                color: "text.secondary",
            }}
        >
            Uso de disco
            <Box sx={{ gap: isMobile ? "5vw" : "1vw", flexDirection: isMobile ? "column" : "row" }}>
                <DiskMetricContainer
                    label="Mensagens"
                    value={diskMetrics?.messages}
                    onDeletePress={deleteMessages}
                    deleting={deletingMessages}
                    disabled={fetchingMessages}
                />
                <DiskMetricContainer
                    label="Mídia"
                    value={diskMetrics?.media}
                    onDeletePress={deleteMedia}
                    deleting={deletingMedia}
                    disabled={fetchingMessages}
                />
            </Box>
            <Box sx={{ gap: "1vw", alignItems: "center" }}>
                <Typography>Sincronizar mensagens</Typography>
                {fetchingMessages && <CircularProgress color="inherit" />}
            </Box>
            <SyncMessagesContainer washima={washima} syncing={fetchingMessages} onSyncPress={onSyncMessages} />
        </Box>
    )
}

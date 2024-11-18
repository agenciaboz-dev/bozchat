import React, { useEffect, useState } from "react"
import { Box, IconButton, useMediaQuery } from "@mui/material"
import { Title2 } from "../../components/Title"
import { GeneralStat } from "../../types/GeneralStat"
import { GeneralStatsList } from "./GeneralStatsList"
import { Announcement, Backup, Check, Loop, Replay } from "@mui/icons-material"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"

interface WashimaStatisticsProps {}

export const WashimaStatistics: React.FC<WashimaStatisticsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    const [connectedWashimas, setConnectedWashimas] = useState(0)
    const [pendingWashimas, setPendingWashimas] = useState(0)
    const [washimasCountLoading, setWashimasCountLoading] = useState(true)
    const [unrepliedCount, setUnrepliedCount] = useState(0)
    const [unrepliedLoading, setUnrepliedLoading] = useState(true)
    const [storageUse, setStorageUse] = useState("")
    const [storageLoading, setStorageLoading] = useState(true)

    const generalStatistics: GeneralStat[] = [
        { title: "Contas conectadas", icon: Check, value: connectedWashimas, loading: washimasCountLoading },
        { title: "Contas aguardando", icon: Loop, value: pendingWashimas, loading: washimasCountLoading },
        { title: "Conversas não respondidas", icon: Announcement, value: unrepliedCount, loading: unrepliedLoading },
        { title: "Armazenamento consumido", icon: Backup, value: storageUse, loading: storageLoading },
    ]

    const fetchWashimasCount = async () => {
        if (!user) return

        setWashimasCountLoading(true)

        try {
            const response = await api.get("/user/stats/washima", { params: { user_id: user.id } })
            const data = response.data as { connected: number; pending: number }
            setConnectedWashimas(data.connected)
            setPendingWashimas(data.pending)
        } catch (error) {
            console.log(error)
        } finally {
            setWashimasCountLoading(false)
        }
    }

    const fetchUnreplied = async () => {
        if (!user) return

        setUnrepliedLoading(true)

        try {
            const response = await api.get("/user/stats/unreplied", { params: { user_id: user.id } })
            setUnrepliedCount(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setUnrepliedLoading(false)
        }
    }

    const fetchStorage = async () => {
        if (!user) return

        setStorageLoading(true)

        try {
            const response = await api.get("/user/stats/storage", { params: { user_id: user.id } })
            setStorageUse(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setStorageLoading(false)
        }
    }

    const fetchStats = async () => {
        fetchWashimasCount()
        fetchUnreplied()
        // fetchStorage()
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return (
        <Box sx={{ flex: isMobile ? undefined : 1, flexDirection: "column", gap: "1vw" }}>
            <Title2
                name="Washima"
                right={
                    <IconButton onClick={fetchStats}>
                        <Replay />
                    </IconButton>
                }
            />

            <GeneralStatsList list={generalStatistics} />
        </Box>
    )
}

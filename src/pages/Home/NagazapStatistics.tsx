import React, { useEffect, useState } from "react"
import { Box, IconButton, useMediaQuery } from "@mui/material"
import { Title2 } from "../../components/Title"
import { AlarmOnSharp, Block, Check, Close, DocumentScanner, Replay, WhatsApp } from "@mui/icons-material"
import { useUser } from "../../hooks/useUser"
import { GeneralStat } from "../../types/GeneralStat"
import { GeneralStatsList } from "./GeneralStatsList"
import { api } from "../../api"

interface NagazapStatisticsProps {}

export const NagazapStatistics: React.FC<NagazapStatisticsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { company } = useUser()

    const [nagazapsCount, setNagazapsCount] = useState<number>()
    const [templatesCount, setTemplatesCount] = useState<number>()
    const [sucessfulMessages, setSucessfulMessages] = useState<number>()
    const [errorMessages, setErrorMessages] = useState<number>()
    const [ovenMessages, setOvenMessages] = useState<number>()
    const [blacklistCount, setBlacklistCount] = useState<number>()

    const generalStatistics: GeneralStat[] = [
        { title: "Contas conectadas", icon: WhatsApp, value: nagazapsCount, loading: nagazapsCount === undefined },
        { title: "Templates", icon: DocumentScanner, value: templatesCount, loading: templatesCount === undefined },
        { title: "Mensagens enviadas com sucesso", icon: Check, value: sucessfulMessages, loading: sucessfulMessages === undefined },
        { title: "Mensagens não enviadas", icon: Close, value: errorMessages, loading: errorMessages === undefined },
        { title: "Mensagens no forno", icon: AlarmOnSharp, value: ovenMessages, loading: ovenMessages === undefined },
        { title: "Números na lista negra", icon: Block, value: blacklistCount, loading: blacklistCount === undefined },
    ]

    const fetchNagazaps = async () => {
        try {
            const response = await api.get("/nagazap/stats/count", { params: { company_id: company?.id } })
            setNagazapsCount(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTemplates = async () => {
        try {
            const response = await api.get("/nagazap/stats/templates", { params: { company_id: company?.id } })
            setTemplatesCount(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMessages = async () => {
        try {
            const response = await api.get("/nagazap/stats/messages", { params: { company_id: company?.id } })
            setSucessfulMessages(response.data.success)
            setErrorMessages(response.data.error)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchOven = async () => {
        try {
            const response = await api.get("/nagazap/stats/oven", { params: { company_id: company?.id } })
            setOvenMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchBlacklist = async () => {
        try {
            const response = await api.get("/nagazap/stats/blacklist", { params: { company_id: company?.id } })
            setBlacklistCount(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStats = async () => {
        fetchNagazaps()
        fetchTemplates()
        fetchMessages()
        fetchOven()
        fetchBlacklist()
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return (
        <Box sx={{ flex: isMobile ? undefined : 1, flexDirection: "column", gap: isMobile ? 0 : "1vw" }}>
            <Title2
                name="Broadcast"
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

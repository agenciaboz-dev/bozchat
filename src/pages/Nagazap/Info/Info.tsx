import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper, Tooltip, useMediaQuery } from "@mui/material"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { AccountBox, ArrowBack, Business, Facebook, Fingerprint, HealthAndSafety, LocalPhone, Refresh, Security, WhatsApp } from "@mui/icons-material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { BusinessInfo } from "../../../types/server/Meta/WhatsappBusiness/BusinessInfo"
import { GeneralStat } from "../../../types/GeneralStat"
import { InfoDataContainer } from "./InfoDataContainer"
import { GeneralStatistics } from "./GeneralStatistics"
import { MessagesChart } from "./MessagesChart"
import { BlacklistChart } from "./BlacklistChart"
import { useUser } from "../../../hooks/useUser"

interface InfoProps {
    nagazap: Nagazap
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const Info: React.FC<InfoProps> = ({ nagazap, setShowInformations }) => {
    const { user } = useUser()

    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState<BusinessInfo | null>(null)
    const isMobile = useMediaQuery("(orientation: portrait)")

    const getMuiColor = (value?: string) => {
        const colors = [
            { text: "green", value: "success.main" },
            { text: "yellow", value: "warning.main" },
            { text: "red", value: "error.main" },
        ]
        return colors.find((item) => item.text === value)?.value
    }

    const infos: (GeneralStat & { copy?: boolean })[] = [
        { title: "Business Account", value: info?.name, icon: AccountBox, loading: !info },
        { title: "Nome do Whatsapp Business", value: info?.phone_numbers.data[0].verified_name, icon: WhatsApp, loading: !info },
        {
            title: "Número do Whatsapp Business",
            value: info?.phone_numbers.data[0].display_phone_number,
            icon: LocalPhone,
            loading: !info,
        },
        {
            title: "Confiabilidade do número",
            value: (
                <Box
                    sx={{
                        color: getMuiColor(info?.phone_numbers.data[0].quality_rating.toLowerCase()),
                    }}
                >
                    {info?.phone_numbers.data[0].quality_rating}
                </Box>
            ),
            icon: Security,
            loading: !info,
        },
    ]

    const ids: (GeneralStat & { copy?: boolean })[] = [
        { title: "Business ID", value: nagazap.businessId, icon: Business, copy: true },
        { title: "App ID", value: nagazap.appId, icon: Facebook, copy: true },
        { title: "Phone ID", value: nagazap.phoneId, icon: LocalPhone, copy: true },
        { title: "Boz ID", value: nagazap.id, icon: Fingerprint, copy: true },
    ]

    const fetchInfo = async () => {
        setInfo(null)
        setLoading(true)

        try {
            const response = await api.get("/nagazap/info", { params: { nagazap_id: nagazap.id } })
            const info = response.data as BusinessInfo
            setInfo(info)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [nagazap])

    return (
        <Subroute
            title="Informações"
            right={
                <IconButton
                    onClick={() => {
                        fetchInfo()
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
            left={
                isMobile ? (
                    <IconButton
                        onClick={() => {
                            setShowInformations(false)
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                ) : null
            }
        >
            <Grid container columns={isMobile ? 1 : 4} sx={{ height: "64vh", gap: isMobile ? "3vw" : undefined }}>
                <Grid item xs={1}>
                    <Box
                        sx={{
                            flexDirection: "column",
                            gap: isMobile ? "3vw" : "0.5vw",
                        }}
                    >
                        {infos.map((info) => (
                            <InfoDataContainer key={info.title} data={info} />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{ flexDirection: "column", gap: isMobile ? "3vw" : "0.5vw" }}>
                        {ids.map((info) => (
                            <InfoDataContainer key={info.title} data={info} />
                        ))}
                    </Box>
                </Grid>
                {isMobile ? (
                    <Grid item xs={2}>
                        <GeneralStatistics nagazap={nagazap} />
                    </Grid>
                ) : null}
                <Grid item xs={2}>
                    <MessagesChart messages={nagazap.sentMessages} />
                </Grid>
                {!isMobile ? (
                    <Grid item xs={2}>
                        <GeneralStatistics nagazap={nagazap} />
                    </Grid>
                ) : null}
                <Grid item xs={2}>
                    <BlacklistChart blacklist={nagazap.blacklist} />
                </Grid>
            </Grid>
        </Subroute>
    )
}

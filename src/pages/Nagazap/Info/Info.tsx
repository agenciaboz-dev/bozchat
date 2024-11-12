import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper } from "@mui/material"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { AccountBox, Business, Facebook, LocalPhone, Refresh, Security, WhatsApp } from "@mui/icons-material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { BusinessInfo } from "../../../types/server/Meta/WhatsappBusiness/BusinessInfo"
import { GeneralStat } from "../../../types/GeneralStat"
import { InfoDataContainer } from "./InfoDataContainer"
import { GeneralStatistics } from "./GeneralStatistics"
// import { MessagesChart } from "./MessagesChart"

interface InfoProps {
    nagazap: Nagazap
}

export const Info: React.FC<InfoProps> = ({ nagazap }) => {
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState<BusinessInfo | null>(null)

    const infos: (GeneralStat & { copy?: boolean })[] = [
        { title: "Business Account", value: info?.name, icon: AccountBox, loading: !info },
        { title: "Nome do Whatsapp Business", value: info?.phone_numbers.data[0].verified_name, icon: WhatsApp, loading: !info },
        { title: "Número do Whatsapp Business", value: info?.phone_numbers.data[0].display_phone_number, icon: LocalPhone, loading: !info },
        {
            title: "Confiabilidade do número",
            value: (
                <Paper
                    sx={{
                        borderRadius: "100%",
                        width: "1.5rem",
                        height: "1.5rem",
                        bgcolor: info?.phone_numbers.data[0].quality_rating.toLowerCase(),
                    }}
                />
            ),
            icon: Security,
            loading: !info,
        },
    ]

    const ids: (GeneralStat & { copy?: boolean })[] = [
        { title: "Business ID", value: nagazap.businessId, icon: Business, copy: true },
        { title: "App ID", value: nagazap.appId, icon: Facebook, copy: true },
        { title: "Phone ID", value: nagazap.phoneId, icon: LocalPhone, copy: true },
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
                <IconButton onClick={fetchInfo} disabled={loading}>
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
        >
            <Grid container columns={2}>
                <Grid item xs={1}>
                    <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
                        {infos.map((info) => (
                            <InfoDataContainer key={info.title} data={info} />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
                        {ids.map((info) => (
                            <InfoDataContainer key={info.title} data={info} />
                        ))}
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ gap: "1vw" }}>
                <GeneralStatistics nagazap={nagazap} />
                {/* <MessagesChart messages={nagazap.sentMessages} /> */}
            </Box>
        </Subroute>
    )
}

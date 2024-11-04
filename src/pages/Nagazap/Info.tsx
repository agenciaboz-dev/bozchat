import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper, Skeleton } from "@mui/material"
import { Subroute } from "./Subroute"
import { api } from "../../api"
import { NagazapPhoneNumber } from "../../types/NagazapPhoneNumber"
import { Refresh } from "@mui/icons-material"
import { Nagazap } from "../../types/server/class/Nagazap"
import { Title2 } from "../../components/Title"

interface InfoProps {}

interface PhoneProps {
    nagaPhone: NagazapPhoneNumber
}

const NagaPhone: React.FC<PhoneProps> = ({ nagaPhone }) => {
    const [nagazap, setNagazap] = useState<Nagazap>()

    const refreshNagazap = async () => {
        try {
            const response = await api.get("/whatsapp")
            setNagazap(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        refreshNagazap()
    }, [])

    return (
        <Grid item xs={1}>
            <Paper sx={{ padding: "1vw", flexDirection: "column", gap: "1vw", bgcolor: "background.default" }}>
                <Title2 name={nagaPhone.verified_name} />
                <Box>Número: {nagaPhone.display_phone_number}</Box>
                <Box sx={{ alignItems: "center", gap: "1vw" }}>
                    Confiabilidade:{" "}
                    <Box
                        sx={{
                            borderRadius: "100%",
                            width: "1vw",
                            height: "1vw",
                            bgcolor: nagaPhone.quality_rating.toLowerCase(),
                        }}
                    />
                </Box>
                <Box>App ID: {nagazap?.appId}</Box>
                <Box>Phone ID: {nagazap?.phoneId}</Box>
                <Box>Bussiness ID: {nagazap?.bussinessId}</Box>
            </Paper>
        </Grid>
    )
}

export const Info: React.FC<InfoProps> = ({}) => {
    const [loading, setLoading] = useState(true)
    const [phones, setPhones] = useState<NagazapPhoneNumber[]>([])

    const fetchInfo = async () => {
        setLoading(true)

        try {
            const response = await api.get("/whatsapp/info")
            console.log(response.data)
            setPhones(response.data.phone_numbers.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [])

    return (
        <Subroute
            title="Informações"
            right={
                <IconButton onClick={fetchInfo} disabled={loading}>
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
        >
            <Grid container columns={3} spacing={2}>
                {loading ? (
                    <Grid item xs={1}>
                        <Skeleton variant="rounded" animation="wave" sx={{ width: "100%", height: "17vw" }} />
                    </Grid>
                ) : (
                    phones.map((item) => <NagaPhone key={item.id} nagaPhone={item} />)
                )}
            </Grid>
        </Subroute>
    )
}

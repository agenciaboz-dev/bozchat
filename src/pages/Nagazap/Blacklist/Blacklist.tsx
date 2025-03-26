import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { ArrowBack, DeleteForever, Refresh } from "@mui/icons-material"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { BlacklistLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface BlacklistProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

export const Blacklist: React.FC<BlacklistProps> = ({ nagazap, setNagazap, setShowInformations }) => {
    const { company, user } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const [loading, setLoading] = useState(false)
    const [blacklist, setBlacklist] = useState<BlacklistLog[]>([])

    const handleDelete = async (number: string) => {
        try {
            const response = await api.delete("/nagazap/blacklist", { data: { number }, params: { nagazap_id: nagazap.id, user_id: user?.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refresh = async () => {
        if (!company) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { company_id: company.id, nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        if (!nagazap) return
        setBlacklist(nagazap?.blacklist.filter((phone) => phone.includes(value)))
    }

    useEffect(() => {
        if (nagazap) {
            setBlacklist(nagazap.blacklist)
        }
    }, [nagazap?.blacklist])

    return (
        <Subroute
            title="Lista negra"
            right={
                <IconButton
                    onClick={() => {
                        refresh()
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size="1.5rem" color={darkMode ? "secondary" : "inherit"} /> : <Refresh />}
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
                ) : undefined
            }
        >
            <Grid container columns={isMobile ? 1 : 6} spacing={2}>
                {blacklist.map((item, index) => (
                    <Grid item xs={1} key={index}>
                        <Paper sx={{ padding: "0.5vw", alignItems: "center", justifyContent: "space-between" }}>
                            <Box>{item.number}</Box>
                            <IconButton onClick={() => handleDelete(item.number)}>
                                <DeleteForever />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Subroute>
    )
}

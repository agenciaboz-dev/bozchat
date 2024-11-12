import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { ArrowBack, Refresh } from "@mui/icons-material"
import { LogsList } from "./LogsList"
import { useUser } from "../../../hooks/useUser"

interface LogsProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

export const Logs: React.FC<LogsProps> = ({ nagazap, setNagazap, setShowInformations }) => {
    const { user } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("")

    const refresh = async () => {
        if (!user) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { user_id: user.id, nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => setFilter(value)

    useEffect(() => {
        refresh()
    }, [])

    return nagazap ? (
        <Subroute
            title="Logs"
            right={
                <IconButton
                    onClick={() => {
                        refresh()
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
                ) : undefined
            }
        >
            <Grid container columns={isMobile ? 1 : 2} spacing={3}>
                <LogsList list={nagazap.sentMessages.filter((log) => log.data.contacts[0].wa_id.slice(2).includes(filter))} type="success" />
                <LogsList list={nagazap.failedMessages.filter((log) => log.number.slice(2).includes(filter))} type="error" />
            </Grid>
        </Subroute>
    ) : null
}

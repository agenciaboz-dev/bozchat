import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import { Subroute } from "../Subroute"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { DeleteForever, Pause, PauseCircle, PlayArrow, PlayCircle, Refresh, Save } from "@mui/icons-material"
import { api } from "../../../api"
import { WhatsappForm } from "../../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { Batch } from "./Batch"
import { useIo } from "../../../hooks/useIo"
import { useUser } from "../../../hooks/useUser"

interface OvenProps {
    nagazap?: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
}

export const Oven: React.FC<OvenProps> = ({ nagazap, setNagazap }) => {
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const result: T[][] = []
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk: T[] = array.slice(i, i + chunkSize)
            result.push(chunk)
        }
        return result
    }

    const io = useIo()
    const { user } = useUser()

    const [frequency, setFrequency] = useState(nagazap?.frequency || "")
    const [batchSize, setBatchSize] = useState(nagazap?.batchSize || 0)
    const [loading, setLoading] = useState(false)
    const [batches, setBatches] = useState<WhatsappForm[][]>([])

    const textfield_size = 250

    const refresh = async () => {
        if (!nagazap || !user) return

        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { nagazap_id: nagazap.id, user_id: user.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const save = async (type: "frequency" | "batchSize", value: string | number) => {
        if (loading || !nagazap) return
        setLoading(true)
        try {
            let data: any = {}
            data[type] = value
            const response = await api.patch("/nagazap", data, { params: { nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(batches)
    }, [batches])

    useEffect(() => {
        if (nagazap) {
            setFrequency(nagazap.frequency)
            setBatchSize(nagazap.batchSize)
            setBatches(chunkArray(nagazap.stack, nagazap.batchSize))
        }
    }, [nagazap])

    const onStatusToggleClick = async (option: "start" | "pause") => {
        if (loading || !nagazap) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap/" + option, { params: { nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onClearOvenClick = async () => {
        if (loading || !nagazap) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap/clearOven", { params: { nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    return nagazap ? (
        <Subroute
            title="Forno"
            right={
                <Box sx={{ flex: 1, justifyContent: "space-between", marginLeft: "0.5vw" }}>
                    <Box sx={{ alignItems: "center" }}>
                        <Box sx={{ bgcolor: nagazap.paused ? "warning.main" : "success.main", borderRadius: "100%", width: "1vw", height: "1vw" }} />
                    </Box>
                    <Box sx={{ gap: "1vw" }}>
                        {!!batches.length && (
                            <IconButton sx={{ alignSelf: "center" }} onClick={onClearOvenClick} disabled={loading} color="error">
                                {<DeleteForever />}
                            </IconButton>
                        )}
                        <IconButton sx={{ alignSelf: "center" }} onClick={() => onStatusToggleClick(nagazap.paused ? "start" : "pause")}>
                            {nagazap.paused ? <PlayCircle color="success" /> : <PauseCircle color="warning" />}
                        </IconButton>
                        <TextField
                            label="Intervalo entre fornadas"
                            value={frequency}
                            onChange={(event) => setFrequency(event.target.value)}
                            InputProps={{
                                sx: { width: textfield_size },
                                endAdornment: (
                                    <>
                                        Minutos
                                        <IconButton
                                            disabled={frequency == nagazap?.frequency}
                                            onClick={() => save("frequency", frequency)}
                                            sx={{ alignSelf: "center" }}
                                        >
                                            <Save />
                                        </IconButton>
                                    </>
                                ),
                            }}
                        />
                        <TextField
                            label="Mensagens por fornada"
                            value={batchSize}
                            type="number"
                            onChange={(event) => setBatchSize(Number(event.target.value))}
                            InputProps={{
                                sx: { width: textfield_size },
                                endAdornment: (
                                    <IconButton
                                        disabled={batchSize == nagazap?.batchSize}
                                        onClick={() => save("batchSize", batchSize)}
                                        sx={{ alignSelf: "center" }}
                                    >
                                        <Save />
                                    </IconButton>
                                ),
                            }}
                        />
                        <IconButton onClick={refresh} disabled={loading} sx={{ alignSelf: "center" }}>
                            {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                        </IconButton>
                    </Box>
                </Box>
            }
        >
            <Grid container columns={4} spacing={2}>
                {batches.map((batch, index) => (
                    <Grid item xs={1} key={index}>
                        <Batch batch={batch} nagazap={nagazap} index={index} />
                    </Grid>
                ))}
                <Grid item xs={4}>
                    {!batches.length && <Box sx={{ color: "secondary.main" }}>Nenhuma fornada em preparo</Box>}
                </Grid>
            </Grid>
        </Subroute>
    ) : null
}

import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Grid, Icon, IconButton, MenuItem, TextField, Tooltip, useMediaQuery } from "@mui/material"
import { Subroute } from "../Subroute"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Cake, ArrowBack, DeleteForever, HourglassFull, Pause, PauseCircle, PlayArrow, PlayCircle, Refresh, Save, WifiTethering } from "@mui/icons-material"
import { api } from "../../../api"
import { WhatsappForm } from "../../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { Batch } from "./Batch"
import { useIo } from "../../../hooks/useIo"
import { useUser } from "../../../hooks/useUser"
import { OvenStatus } from "./OvenStatus"

interface OvenProps {
    nagazap?: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

export const Oven: React.FC<OvenProps> = ({ nagazap: initialNagazap, setNagazap: setInitialNagazap, setShowInformations }) => {
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const result: T[][] = []
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk: T[] = array.slice(i, i + chunkSize)
            result.push(chunk)
        }
        return result
    }

    const { company, user } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [nagazap, setNagazap] = useState(initialNagazap)
    const [frequency, setFrequency] = useState(nagazap?.frequency || "")
    const [batchSize, setBatchSize] = useState(nagazap?.batchSize || 0)
    const [loading, setLoading] = useState(false)
    const [batches, setBatches] = useState<WhatsappForm[][]>([])

    const textfield_size = 250

    const refresh = async () => {
        if (!initialNagazap || !company) return

        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { nagazap_id: initialNagazap.id, company_id: company.id } })
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
            const response = await api.patch("/nagazap", data, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
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
            const response = await api.get("/nagazap/" + option, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
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
            const response = await api.get("/nagazap/clearOven", { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [initialNagazap])

    return nagazap ? (
        <Subroute
            title="Forno"
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
            right={
                !isMobile ? (
                    <Box
                        sx={{
                            flex: 1,
                            justifyContent: "space-between",
                            // marginLeft: "0.5vw",
                            // border: "red solid 1px",
                        }}
                    >
                        <Box sx={{ alignItems: "center" }}>
                            <OvenStatus nagazap={nagazap} />
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
                            <IconButton
                                onClick={() => {
                                    refresh()
                                }}
                                disabled={loading}
                                sx={{ alignSelf: "center" }}
                            >
                                {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                            </IconButton>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ alignSelf: "center" }}>
                            <OvenStatus nagazap={nagazap} />
                        </Box>
                        <IconButton
                            onClick={() => {
                                refresh()
                            }}
                            disabled={loading}
                            sx={{ alignSelf: "center" }}
                        >
                            {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                        </IconButton>
                    </Box>
                )
            }
        >
            {isMobile ? (
                <Box sx={{ gap: "2vw", flexDirection: "column", paddingBlock: "5vw" }}>
                    <TextField
                        label="Intervalo entre fornadas"
                        value={frequency}
                        onChange={(event) => setFrequency(event.target.value)}
                        InputProps={{
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
                    <Box sx={{ justifyContent: "space-around", gap: "2vw" }}>
                        {/* {!!batches.length && (
                            <IconButton sx={{ alignSelf: "center" }} onClick={onClearOvenClick} disabled={loading} color="error">
                                {<DeleteForever />}
                            </IconButton>
                        )}
                        <IconButton sx={{ alignSelf: "center" }} onClick={() => onStatusToggleClick(nagazap.paused ? "start" : "pause")}>
                            {nagazap.paused ? <PlayCircle color="success" /> : <PauseCircle color="warning" />}
                        </IconButton> */}
                        {!!batches.length ? (
                            <Button variant="outlined" color="error" onClick={onClearOvenClick} sx={{ flex: 1 }}>
                                {<DeleteForever />}
                            </Button>
                        ) : null}
                        <Button
                            variant="outlined"
                            color={nagazap.paused ? "success" : "warning"}
                            onClick={() => onStatusToggleClick(nagazap.paused ? "start" : "pause")}
                            sx={{ flex: 1 }}
                        >
                            {nagazap.paused ? <PlayCircle color="success" /> : <PauseCircle color="warning" />}{" "}
                        </Button>
                    </Box>
                </Box>
            ) : null}
            <Grid container columns={isMobile ? 1 : 4} spacing={2}>
                {batches.map((batch, index) => (
                    <Grid item xs={1} key={index}>
                        <Batch batch={batch} nagazap={nagazap} index={index} />
                    </Grid>
                ))}
            </Grid>
            {!batches.length && (
                <Box
                    sx={{
                        color: "secondary.main",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "column",
                        fontSize: "2rem",
                    }}
                >
                    <Cake sx={{ width: "15vw", height: "auto" }} />o forno está vazio
                </Box>
            )}
        </Subroute>
    ) : null
}

import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Title2 } from "../../components/Title"
import { Close } from "@mui/icons-material"
import { QRCode } from "react-qrcode-logo"
import { useIo } from "../../hooks/useIo"
import { api } from "../../api"
import MaskedInputComponent from "../../components/MaskedInput"
import { useUser } from "../../hooks/useUser"
import { PairingCode } from "./PairingCode"
import { InlineTypography } from "../../components/InlineTypography"

interface WashimaFormModalProps {
    onSuccess: (washima: Washima) => void
    currentWashima: Washima | null
    open: boolean
    setCurrentWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    onClose: () => void
}

const Loading = () => (
    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
        <Typography>Gerando código</Typography>
        <LinearProgress variant={"indeterminate"} />
    </Box>
)

export const WashimaFormModal: React.FC<WashimaFormModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()
    const { company, user } = useUser()

    const [loading, setLoading] = useState(false)
    const [syncStatus, setSyncStatus] = useState("Iniciando")
    const [syncProgress, setSyncProgress] = useState(0)
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [error, setError] = useState("")

    const handleClose = () => {
        props.onClose()
        setCode("")
        setLoading(false)
        setPhone("")
        setError("")
    }

    const syncMessages = async () => {
        if (!props.currentWashima) return

        const washima_id = props.currentWashima.id
        handleClose()

        try {
            const response = await api.post("/washima/fetch-messages-whatsappweb", { id: washima_id, options: { groupOnly: false } }, { timeout: 0 })
        } catch (error) {
            console.log(error)
        }
    }

    const requestPairingCode = async () => {
        if (loading) return
        setError("")

        if (!phone) {
            setError("Número de telefone é obrigatório para gerar o código numérico")
            return
        }

        if (phone?.length !== 14) {
            setError("Número de telefone inválido.")
            return
        }

        setLoading(true)

        try {
            console.log("requesting pairing code")
            const response = await api.post("/washima", { company_id: company?.id, number: phone }, { params: { user_id: user?.id } })
            props.onSuccess(response.data)
            props.setCurrentWashima(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const requestQrCode = async () => {
        if (loading) return

        setLoading(true)

        try {
            const response = await api.post("/washima", { company_id: company?.id }, { params: { user_id: user?.id } })
            props.onSuccess(response.data)
            props.setCurrentWashima(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (props.currentWashima?.status === "ready" || props.currentWashima?.status === "stopped") {
            handleClose()
        }

        if (props.currentWashima) {
            io.on(`washima:${props.currentWashima.id}:init`, (status: string, progress: number) => {
                handleClose()
                setSyncStatus(status)
                setSyncProgress(progress)
                if (progress === 4) {
                    syncMessages()
                    setTimeout(() => {
                        setSyncStatus("Iniciando")
                        setSyncProgress(0)

                        props.setCurrentWashima(null)
                    }, 1000)
                }
            })

            io.emit("washima:channel:join", props.currentWashima.id)

            io.on("code", (code: string) => {
                setCode(code)
                setLoading(false)
            })

            io.on("initialized", () => {})

            return () => {
                io.off(`washima:${props.currentWashima?.id}:init`)
                io.off("code")
                io.emit("washima:channel:leave", props.currentWashima?.id)
            }
        }
    }, [props.currentWashima])

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <Box
                sx={{
                    flexDirection: "column",
                    padding: isMobile ? "5vw" : "1.5vw",
                    gap: isMobile ? "5vw" : "1vw",
                    bgcolor: "background.default",
                    maxWidth: isMobile ? "90vw" : undefined,
                }}
            >
                <Title2
                    name={props.currentWashima?.name || "Novo Business"}
                    right={
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    }
                />
                <Box sx={{ color: "text.secondary", flexDirection: "column", gap: isMobile ? "5vw" : "0.5vw" }}>
                    <Typography sx={{ marginTop: "-1vw" }}>
                        Digite o número de telefone do whatsapp que deseja conectar e escolha o tipo de autenticação.
                    </Typography>
                    <Typography>
                        Ao gerar um <InlineTypography highlight>código numérico</InlineTypography> você receberá uma notificação no whatsapp para
                        inserir esse código e conectar.
                    </Typography>
                    <Typography sx={{ marginBottom: "1vw" }}>
                        Caso prefira, você pode gerar um <InlineTypography highlight>QR Code</InlineTypography>, mas esse processo pode demorar alguns
                        minutos.
                    </Typography>
                </Box>
                {loading ? (
                    <Loading />
                ) : code ? (
                    <Box sx={{ alignSelf: "center" }}>
                        {props.currentWashima?.status === "qrcode" ? <QRCode size={300} value={code} /> : <PairingCode code={code} />}
                    </Box>
                ) : (
                    <TextField
                        label="Número de telefone (sem o 9)"
                        InputProps={{ inputComponent: MaskedInputComponent, inputProps: { mask: "(00) 0000-0000" } }}
                        value={phone}
                        onChange={(ev) => setPhone(ev.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                )}
                <Box sx={{ justifyContent: "flex-end", gap: isMobile ? "5vw" : "1vw" }}>
                    <Button variant="outlined" onClick={requestQrCode} disabled={!!code || loading}>
                        Gerar QR Code
                    </Button>
                    <Button variant="contained" onClick={requestPairingCode} disabled={!!code || loading}>
                        Gerar código numérico
                    </Button>
                </Box>
            </Box>
        </Dialog>
    )
}

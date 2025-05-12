import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, Paper, TextField, Typography } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Title2 } from "../../components/Title"
import { Close } from "@mui/icons-material"
import { QRCode } from "react-qrcode-logo"
import { useIo } from "../../hooks/useIo"
import { api } from "../../api"

interface WashimaFormModalProps {
    onSuccess: (washima: Washima) => void
    currentWashima: Washima | null
    open: boolean
    setCurrentWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    onClose: () => void
}

export const WashimaFormModal: React.FC<WashimaFormModalProps> = (props) => {
    const io = useIo()

    const [loading, setLoading] = useState(true)
    const [syncStatus, setSyncStatus] = useState("Iniciando")
    const [syncProgress, setSyncProgress] = useState(0)

    const handleClose = () => {
        props.onClose()
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

    useEffect(() => {
        if (props.currentWashima?.qrcode) {
            setLoading(false)
        } else {
            setLoading(true)
        }

        if (props.currentWashima?.status === "ready" || props.currentWashima?.status === "stopped") {
            handleClose()
        }

        if (props.currentWashima) {
            io.on(`washima:${props.currentWashima.id}:init`, (status: string, progress: number) => {
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

            return () => {
                io.off(`washima:${props.currentWashima?.id}:init`)
            }
        }
    }, [props.currentWashima])

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperProps={{ sx: { flexDirection: "column", padding: "1vw", gap: "1vw", bgcolor: "background.default" } }}
        >
            <Title2
                name={props.currentWashima?.name || "Novo Business"}
                right={
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                }
            />
            <Typography sx={{ color: "text.secondary", fontSize: "0.8rem", marginTop: "-1vw" }}>
                A instância será inicializada e um QR Code aparecerá logo abaixo para realizar a autenticação do Whatsapp Web. A primeira
                inicialização pode demorar alguns minutos. Você fechar esta janela e visualizar o QR Code na tabela, sob a coluna "status", ou
                aguardar.
            </Typography>
            {props.currentWashima?.qrcode ? (
                <Box sx={{ alignSelf: "center" }}>
                    <QRCode size={300} value={props.currentWashima.qrcode} />
                </Box>
            ) : (
                <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                    <Typography>{syncStatus}</Typography>
                    <LinearProgress variant={syncProgress ? "determinate" : "indeterminate"} value={(syncProgress * 100) / 4} />
                </Box>
            )}
        </Dialog>
    )
}

import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, Paper, TextField, Typography } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Title2 } from "../../components/Title"
import { Close } from "@mui/icons-material"
import { QRCode } from "react-qrcode-logo"
import { useIo } from "../../hooks/useIo"
import { api } from "../../api"
import MaskedInputComponent from "../../components/MaskedInput"
import { useUser } from "../../hooks/useUser"

interface WashimaFormModalProps {
    onSuccess: (washima: Washima) => void
    currentWashima: Washima | null
    open: boolean
    setCurrentWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    onClose: () => void
}

const Loading = () => (
    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
        <Typography>Inicializando</Typography>
        <LinearProgress variant={"indeterminate"} />
    </Box>
)

export const WashimaFormModal: React.FC<WashimaFormModalProps> = (props) => {
    const io = useIo()
    const { company, user } = useUser()

    const [loading, setLoading] = useState(true)
    const [initializing, setInitializing] = useState(false)
    const [syncStatus, setSyncStatus] = useState("Iniciando")
    const [syncProgress, setSyncProgress] = useState(0)
    const [phone, setPhone] = useState("")
    const [pairingCode, setPairingCode] = useState("")

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

    const requestPairingCode = async () => {
        // if (loading) return
        // setLoading(true)

        try {
            console.log("requesting pairing code")
            const response = await api.get("/washima/pairing-code", {
                params: { user_id: user?.id, phone: phone, washima_id: props.currentWashima?.id },
            })
            // const response = await api.post("/washima", { company_id: company?.id, number: phone }, { params: { user_id: user?.id } })
            // props.onSuccess(response.data)
            // props.setCurrentWashima(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
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

            io.emit("washima:channel:join", props.currentWashima.id)

            io.on("pairing:code", (code: string) => {
                setPairingCode(code)
            })

            io.on("initialized", () => {
                setInitializing(false)
            })

            return () => {
                io.off(`washima:${props.currentWashima?.id}:init`)
                io.off("pairing:code")
                setInitializing(true)
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
                Digite o número de telefone do whatsapp que deseja conectar e escolha o tipo de autenticação.
                <br />O QR Code será gerado automaticamente, mas pode demorar alguns minutos.
                <br />
                Caso prefira, você pode gerar um código numérico para autenticar o whatsapp clicando no botão abaixo.
            </Typography>

            {props.currentWashima?.qrcode && (
                <Box sx={{ alignSelf: "center" }}>
                    <QRCode size={300} value={props.currentWashima.qrcode} />
                </Box>
            )}

            {initializing ? (
                <Loading />
            ) : (
                //     <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                //     <Typography>{syncStatus}</Typography>
                //     <LinearProgress variant={syncProgress ? "determinate" : "indeterminate"} value={(syncProgress * 100) / 4} />
                // </Box>
                <>
                    <TextField
                        label="Número de telefone (sem o 9)"
                        InputProps={{ inputComponent: MaskedInputComponent, inputProps: { mask: "(00) 0000-0000" } }}
                        value={phone}
                        onChange={(ev) => setPhone(ev.target.value)}
                    />
                    <Box sx={{ justifyContent: "flex-end", gap: "1vw" }}>
                        <Button variant="outlined" sx={{ gap: "1vw" }}>
                            Gerando QR Code
                            <CircularProgress size="1rem" color="inherit" />
                        </Button>
                        <Button variant="contained" onClick={requestPairingCode}>
                            Gerar código numérico
                        </Button>
                    </Box>
                </>
            )}
        </Dialog>
    )
}

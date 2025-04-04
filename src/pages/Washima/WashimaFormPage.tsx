import React, { useEffect, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, IconButton, LinearProgress, Paper, Skeleton, TextField, useMediaQuery } from "@mui/material"
import { useFormik } from "formik"
import { Washima, WashimaForm } from "../../types/server/class/Washima/Washima"
import { useUser } from "../../hooks/useUser"
import { useDarkMode } from "../../hooks/useDarkMode"
import * as Yup from "yup"
import MaskedInputComponent from "../../components/MaskedInput"
import { api } from "../../api"
import { QRCode } from "react-qrcode-logo"
import { ArrowBackIos } from "@mui/icons-material"
import { useIo } from "../../hooks/useIo"
import { WashimaTools } from "./WashimaTools"
import { useConfirmDialog } from "burgos-confirm"

interface WashimaFormPageProps {
    currentWashima: Washima | null
    setCurrentWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    showForm: boolean
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const WashimaFormPage: React.FC<WashimaFormPageProps> = ({ currentWashima, setCurrentWashima, showForm, setShowForm }) => {
    const io = useIo()
    const vw = window.innerWidth / 100
    const { darkMode } = useDarkMode()
    const { user, company } = useUser()
    const { confirm } = useConfirmDialog()

    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)
    const [restarting, setRestarting] = useState(false)
    const [fetchingMessages, setFetchingMessages] = useState(currentWashima?.syncing || false)
    const [syncStatus, setSyncStatus] = useState("Inicializando")
    const [syncProgress, setSyncProgress] = useState(0)

    const formik = useFormik<WashimaForm>({
        initialValues: currentWashima
            ? { name: currentWashima.name, number: currentWashima.number, company_id: "" }
            : { name: "", number: "", company_id: "" },
        async onSubmit(values, formikHelpers) {
            if (loading || !company) return

            try {
                setLoading(true)
                const data: WashimaForm = { ...values }
                const response = currentWashima
                    ? await api.patch("/washima", { ...data, id: currentWashima.id }, { params: { user_id: user?.id } })
                    : await api.post("/washima", { ...data, company_id: company.id }, { params: { user_id: user?.id } })
                console.log(response.data)
                setCurrentWashima(response.data)
                formik.resetForm()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("campo obrigatório").min(3, "aí você tá de sacanagem né"),
            number: Yup.string()
                .required("campo obrigatório")
                .test("len", "número inválido", (val) => val?.length === 15 || val?.length === 16),
        }),
        enableReinitialize: true,
        validateOnChange: false,
    })

    const onRestartPress = async () => {
        if (restarting || !currentWashima) return

        try {
            setRestarting(true)
            const response = await api.post("/washima/restart", { washima_id: currentWashima.id }, { params: { user_id: user?.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRestarting(false)
        }
    }

    const onDeletePress = async () => {
        if (!currentWashima) return

        confirm({
            title: "Deletar instância",
            content: "Tem certeza que deseja deletar essa instância? Essa ação é irreversível.",
            onConfirm: async () => {
                try {
                    const response = await api.delete("/washima", { data: { washima_id: currentWashima.id }, params: { user_id: user?.id } })
                    setCurrentWashima(null)
                    formik.resetForm()
                } catch (error) {
                    console.log(error)
                }
            },
        })
    }

    const onSyncMessages = async () => {
        if (fetchingMessages || !currentWashima) return

        try {
            setFetchingMessages(true)
            const response = await api.post(
                "/washima/fetch-messages-whatsappweb",
                { id: currentWashima.id, options: { groupOnly: false } },
                { timeout: 0 }
            )
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setFetchingMessages(false)
        }
    }

    useEffect(() => {
        setFetchingMessages(!!currentWashima?.syncing)
        if (currentWashima) {
            io.on("washima:ready", (id) => {
                if (id === currentWashima.id) {
                }
            })

            io.on(`washima:${currentWashima.id}:init`, (status: string, progress: number) => {
                setSyncStatus(status)
                setSyncProgress(progress)

                if (progress === 4) {
                    setTimeout(() => {
                        currentWashima.ready = true
                        setSyncStatus("Iniciando")
                        setSyncProgress(0)
                    }, 1000)
                }
            })

            io.on(`washima:${currentWashima.id}:sync:messages`, () => {
                setFetchingMessages(true)
            })

            return () => {
                io.off("washima:ready")
                io.off(`washima:${currentWashima.id}:init`)
                io.off(`washima:${currentWashima.id}:sync:messages`)
            }
        }
    }, [currentWashima])

    return (
        <Box
            sx={{
                flex: 1,
                flexDirection: isMobile ? "column" : "row",
            }}
        >
            <Box sx={{ padding: isMobile ? "5vw" : "2vw", flexDirection: "column", gap: isMobile ? "5vw" : "1vw", flex: 0.5 }}>
                <>
                    <Box sx={{ fontSize: "1.5rem", color: "text.secondary", fontWeight: "bold", gap: "1vw" }}>
                        {showForm && (
                            <IconButton onClick={() => setShowForm(false)}>
                                <ArrowBackIos />
                            </IconButton>
                        )}
                        {currentWashima?.name || "Novo whatsapp"}
                    </Box>

                    <Box sx={{ gap: "1vw" }}>
                        <TextField
                            label="Nome"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && !!formik.errors.name}
                            helperText={formik.errors.name}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Número"
                            name="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            error={!!formik.errors.number}
                            helperText={formik.errors.number}
                            InputProps={{ inputComponent: MaskedInputComponent, inputProps: { mask: "(00) 0 0000-0000" } }}
                            required
                            fullWidth
                        />
                    </Box>

                    <Box
                        sx={{
                            marginLeft: isMobile ? undefined : "auto",
                            gap: "1vw",
                        }}
                    >
                        {currentWashima && (
                            <>
                                <Button variant="outlined" color="error" onClick={onDeletePress} disabled={restarting || fetchingMessages}>
                                    Deletar
                                </Button>
                                <Button variant="outlined" color="warning" onClick={onRestartPress} disabled={fetchingMessages}>
                                    {restarting ? <CircularProgress size={"1.5rem"} color="inherit" /> : "reiniciar"}
                                </Button>
                            </>
                        )}
                        <Button
                            style={{ flex: 1, color: "white" }}
                            variant="contained"
                            onClick={() => formik.handleSubmit()}
                            disabled={restarting || fetchingMessages}
                        >
                            {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Salvar"}
                        </Button>
                    </Box>
                </>
            </Box>

            <Paper
                sx={{
                    flex: isMobile ? 1 : 0.5,
                    flexDirection: isMobile ? "row" : "column",
                    justifyContent: "center",
                    alignItems: currentWashima?.ready && isMobile ? "baseline" : "center",
                }}
            >
                {currentWashima ? (
                    currentWashima.ready ? (
                        <WashimaTools washima={currentWashima} fetchingMessages={fetchingMessages} onSyncMessages={onSyncMessages} />
                    ) : currentWashima.qrcode ? (
                        <QRCode value={currentWashima.qrcode} size={isMobile ? 75 * vw : 25 * vw} />
                    ) : (
                        <Paper sx={{ flexDirection: "column", gap: "1vw", width: "80%", padding: "1vw" }}>
                            {syncStatus}
                            <LinearProgress variant={syncProgress ? "determinate" : "indeterminate"} value={(syncProgress * 100) / 4} />
                        </Paper>
                    )
                ) : isMobile ? (
                    <Box sx={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "5vw" }}>
                        <Box>O QRCode aparecerá aqui após cadastrar o número.</Box>
                        <Box>Pode ser que o primeiro carregamento demore.</Box>
                    </Box>
                ) : (
                    <>
                        <Box>O QRCode aparecerá aqui após cadastrar o número.</Box>
                        <Box>Pode ser que o primeiro carregamento demore.</Box>
                    </>
                )}
            </Paper>
        </Box>
    )
}

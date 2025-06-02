import React, { Dispatch, SetStateAction, useState } from "react"
import { Box, Button, CircularProgress, IconButton, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { Token } from "./Token"
import { DeleteNagazap } from "./DeleteNagazap"
import { ArrowBack, InfoOutlined } from "@mui/icons-material"
import { SyncTemplates } from "./SyncTemplates"
import { useSnackbar } from "burgos-snackbar"
import { useFormik } from "formik"
import { useApi } from "../../../hooks/useApi"
import { useUser } from "../../../hooks/useUser"

interface NagazapSettingsProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap | undefined>>
    fetchNagazaps: () => Promise<void>
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const NagazapSettings: React.FC<NagazapSettingsProps> = ({ nagazap, setNagazap, fetchNagazaps, setShowInformations }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { snackbar } = useSnackbar()
    const { loading, patchNagazap } = useApi()

    const formik = useFormik<Partial<Nagazap>>({
        initialValues: { token: nagazap.token, blacklistTrigger: nagazap.blacklistTrigger },
        onSubmit: async (values) => {
            if (loading || !nagazap) return

            const updatedNagazap = await patchNagazap(values, { params: { nagazap_id: nagazap.id } })
            setNagazap(updatedNagazap)
            snackbar({ severity: "success", text: "Salvo" })
        },
        enableReinitialize: true,
    })

    const [tooltipOpen, setTooltipOpen] = useState(false)

    const handleTooltipToggle = () => {
        setTooltipOpen(!tooltipOpen)
    }

    setTimeout(() => {
        if (tooltipOpen) {
            setTooltipOpen(false)
        }
    }, 5000)

    const { user } = useUser()

    return (
        <Subroute
            title="Configurações"
            space={isMobile ? true : undefined}
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
                isMobile ? undefined : (
                    <Box sx={{ gap: "0.5vw" }}>
                        <SyncTemplates nagazap={nagazap} />
                        {user?.admin && <DeleteNagazap nagazap={nagazap} setNagazap={setNagazap} fetchNagazaps={fetchNagazaps} />}
                    </Box>
                )
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw", flex: 1 }}>
                    {isMobile ? (
                        <Box sx={{ gap: "5vw" }}>
                            <Box sx={{ flex: 1 }}>
                                <SyncTemplates nagazap={nagazap} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DeleteNagazap nagazap={nagazap} setNagazap={setNagazap} fetchNagazaps={fetchNagazaps} />
                            </Box>
                        </Box>
                    ) : undefined}
                    <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                        <Token nagazap={nagazap} formik={formik} />
                        <TextField
                            label="Gatilho da lista negra"
                            value={formik.values.blacklistTrigger}
                            onChange={formik.handleChange}
                            name="blacklistTrigger"
                            placeholder="parar mensagens"
                            InputProps={{
                                endAdornment: isMobile ? (
                                    <Tooltip
                                        arrow
                                        title={
                                            <Box sx={{ flexDirection: "column", gap: "5vw" }}>
                                                <Typography>
                                                    Ao receber uma mensagem com esse texto, o número que enviou será adicionado na lista negra
                                                </Typography>
                                                <Typography>Números na lista negra são ignorados ao enviar mensagens no forno</Typography>
                                            </Box>
                                        }
                                        open={tooltipOpen}
                                        disableFocusListener
                                        disableHoverListener
                                        disableTouchListener
                                        onClose={() => setTooltipOpen(false)}
                                    >
                                        <IconButton onClick={handleTooltipToggle}>
                                            <InfoOutlined />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        arrow
                                        title={
                                            <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                                                <Typography>
                                                    Ao receber uma mensagem com esse texto, o número que enviou será adicionado na lista negra
                                                </Typography>
                                                <Typography>Números na lista negra são ignorados ao enviar mensagens no forno</Typography>
                                            </Box>
                                        }
                                    >
                                        <IconButton>
                                            <InfoOutlined />
                                        </IconButton>
                                    </Tooltip>
                                ),
                            }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ alignSelf: "flex-end" }}
                        disabled={Object.entries(formik.values).every(([key, value]) => nagazap[key as keyof Nagazap] === value)}
                    >
                        {loading ? <CircularProgress /> : "salvar"}
                    </Button>
                </Box>
            </form>
        </Subroute>
    )
}

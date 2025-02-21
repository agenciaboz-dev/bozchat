import React, { useEffect, useState } from "react"
import { Box, Button, Checkbox, Chip, CircularProgress, MenuItem, Slider, TextField, Typography } from "@mui/material"
import { Bot, BotForm as BotFormType } from "../../types/server/class/Bot/Bot"
import { Subroute } from "../Nagazap/Subroute"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { IntegrationField } from "./IntegrationField"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Nagazap } from "../../types/server/class/Nagazap"
import { api } from "../../api"
import { useNavigate } from "react-router-dom"
import { useConfirmDialog } from "burgos-confirm"
import { meta_normalize } from "../../tools/normalize"

interface BotFormProps {
    onSubmit: (bot: Bot) => void
    bot?: Bot
    onDelete?: (bot: Bot) => void
}

export const BotForm: React.FC<BotFormProps> = ({ onSubmit, bot, onDelete }) => {
    const { company } = useUser()
    const navigate = useNavigate()
    const { confirm } = useConfirmDialog()

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [nagazaps, setNagazaps] = useState<Nagazap[]>([])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const formik = useFormik<BotFormType>({
        initialValues: {
            company_id: company?.id || "",
            nagazap_ids: bot?.nagazap_ids || [],
            washima_ids: bot?.washima_ids || [],
            name: bot?.name || "",
            trigger: bot?.trigger || "",
            expiry_minutes: bot?.expiry_minutes || 30,
            fuzzy_threshold: bot?.fuzzy_threshold || 0.1,
        },
        async onSubmit(values, formikHelpers) {
            if (loading || !company || deleting) return

            setLoading(true)
            try {
                const response = bot
                    ? await api.patch("/company/bots", values, { params: { company_id: company.id, bot_id: bot.id } })
                    : await api.post("/company/bots", values, { params: { company_id: company.id } })
                onSubmit(response.data)
                navigate(`/bots/${values.name}`, { state: response.data })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: !!bot,
    })

    const deleteBot = async () => {
        if (deleting || !bot || !company || !onDelete) return
        setDeleting(true)

        try {
            const response = await api.delete("/company/bots", { params: { company_id: company.id, bot_id: bot.id } })
            onDelete(bot)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleting(false)
        }
    }

    const fetchWashimas = async () => {
        try {
            const response = await api.get("/washima", { params: { company_id: company?.id } })
            console.log(response.data)
            setWashimas(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNagazaps = async () => {
        try {
            const response = await api.get("/nagazap", { params: { company_id: company?.id } })
            console.log(response.data)
            setNagazaps(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteClick = () => {
        confirm({ title: "Deletar bot", content: "Esta ação é permanente e irreversível. Deseja continuar?", onConfirm: deleteBot })
    }

    useEffect(() => {
        fetchWashimas()
        fetchNagazaps()
    }, [])

    useEffect(() => {
        console.log(formik.values)
    }, [formik.values])

    return (
        <Subroute
            title={bot ? "Configurações" : "Criar Bot"}
            elevation={bot ? 5 : undefined}
            right={
                <Box sx={{ gap: "1vw" }}>
                    {bot && <Button onClick={onDeleteClick}>{deleting ? <CircularProgress size="1.5rem" /> : "Deletar"}</Button>}
                    <Button variant="contained" onClick={() => formik.handleSubmit()}>
                        {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Salvar"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ gap: "1vw" }}>
                <TextField
                    label="Nome"
                    value={formik.values.name}
                    onChange={(ev) => {
                        const event = ev
                        event.target.value = meta_normalize(ev.target.value)
                        formik.handleChange(event)
                    }}
                    name="name"
                    required
                />
                <TextField label="Gatilho" value={formik.values.trigger} onChange={formik.handleChange} name="trigger" required />
            </Box>

            <Box sx={{ gap: "1vw", alignItems: "center" }}>
                <TextField
                    label="Minutos para conversa expirar"
                    value={formik.values.expiry_minutes}
                    onChange={(ev) => {
                        const value = Number(ev.target.value.replace(/\D/g, ""))
                        formik.setFieldValue("expiry_minutes", value)
                    }}
                    name="expiry_minutes"
                    required
                    sx={{ flex: 1 }}
                />
                <Box sx={{ flexDirection: "column", flex: 1 }}>
                    <Typography sx={{ color: "secondary.main" }}>Limiar de diferença entre resposta e gatilhos</Typography>
                    <Slider
                        min={0.05}
                        max={1}
                        step={0.05}
                        value={formik.values.fuzzy_threshold}
                        onChange={(_, value) => {
                            console.log(value)
                            formik.setFieldValue("fuzzy_threshold", value)
                        }}
                        marks
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Box>

            <Box sx={{ gap: "1vw" }}>
                <IntegrationField title="Business" name="washima_ids" formik={formik} list={washimas} />
                <IntegrationField
                    title="Broadcast"
                    name="nagazap_ids"
                    formik={formik}
                    list={nagazaps.map((item) => ({ ...item, name: item.displayName || item.appId }))}
                />
            </Box>
        </Subroute>
    )
}

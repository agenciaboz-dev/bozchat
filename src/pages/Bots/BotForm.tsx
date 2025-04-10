import React, { useEffect, useState } from "react"
import { Box, Button, Checkbox, Chip, CircularProgress, IconButton, MenuItem, Slider, Switch, TextField, Tooltip, Typography } from "@mui/material"
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
import { Info, InfoOutlined } from "@mui/icons-material"
import { useTheme } from "../../hooks/useTheme"
import { Title2 } from "../../components/Title"

interface BotFormProps {
    onSubmit: (bot: Bot) => void
    bot?: Bot
    onDelete?: (bot: Bot) => void
}

export const BotForm: React.FC<BotFormProps> = ({ onSubmit, bot, onDelete }) => {
    const { company, user } = useUser()
    const navigate = useNavigate()
    const theme = useTheme()
    const { confirm } = useConfirmDialog()

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [nagazaps, setNagazaps] = useState<Nagazap[]>([])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [idleness, setIdleness] = useState(!!bot?.idleness_minutes)
    const [expiry, setExpiry] = useState(!!bot?.expiry_minutes)

    const formik = useFormik<BotFormType>({
        initialValues: {
            company_id: company?.id || "",
            nagazap_ids: bot?.nagazap_ids || [],
            washima_ids: bot?.washima_ids || [],
            name: bot?.name || "",
            trigger: bot?.trigger || "",
            fuzzy_threshold: bot ? bot.fuzzy_threshold : 0.1,
            expiry_minutes: bot?.expiry_minutes || 0,
            expiry_message: bot?.expiry_message || "",
            idleness_message: bot?.idleness_message || "",
            idleness_minutes: bot?.idleness_minutes || 0,
        },
        async onSubmit(values, formikHelpers) {
            if (loading || !company || deleting) return

            setLoading(true)
            try {
                const response = bot
                    ? await api.patch("/company/bots", values, { params: { company_id: company.id, bot_id: bot.id, user_id: user?.id } })
                    : await api.post("/company/bots", values, { params: { company_id: company.id, user_id: user?.id } })
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
            const response = await api.delete("/company/bots", { params: { company_id: company.id, bot_id: bot.id, user_id: user?.id } })
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
                    <Button variant="contained" onClick={() => formik.handleSubmit()} disabled={!formik.values.name || !formik.values.expiry_minutes}>
                        {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Salvar"}
                    </Button>
                </Box>
            }
        >
            <Box sx={{ flexDirection: "column", gap: "1vw" }}>
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
                    <TextField
                        label="Gatilho"
                        value={formik.values.trigger}
                        onChange={formik.handleChange}
                        name="trigger"
                        placeholder="Qualquer mensagem"
                        InputProps={{
                            endAdornment: (
                                <Tooltip
                                    title={
                                        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                                            <Typography sx={{ fontSize: "0.8rem" }}>
                                                Você pode especificar múltiplos gatilhos separados por ";"
                                            </Typography>
                                            <Typography sx={{ fontSize: "0.8rem" }}>
                                                Deixe em branco para ativar o bot com qualquer mensagem
                                            </Typography>
                                        </Box>
                                    }
                                >
                                    <IconButton sx={{ padding: 0 }}>
                                        <InfoOutlined />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ gap: "1vw", alignItems: "center" }}>
                    <Box sx={{ flexDirection: "column", flex: 1 }}>
                        <Box sx={{ alignItems: "center", gap: "0.5vw" }}>
                            <Typography sx={{ color: "text.secondary" }}>Limiar de diferença entre resposta e gatilhos</Typography>
                            <Tooltip
                                title={
                                    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                                        <Typography sx={{ fontSize: "0.8rem" }}>
                                            Esse valor determina o quão precisas as respostas devem ser para ativar o bot ou a próxima etapa dele.
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.8rem" }}>
                                            Quanto mais próximo de <span style={{ color: theme.colors.primary, fontWeight: "bold" }}>0</span>, mais
                                            parecida a resposta deve ser do gatilho.
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.8rem" }}>
                                            Quanto mais próximo de <span style={{ color: theme.colors.primary, fontWeight: "bold" }}>1</span>, mais
                                            respostas diferentes serão aceitas.
                                        </Typography>
                                    </Box>
                                }
                            >
                                <IconButton sx={{ padding: 0 }}>
                                    <InfoOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Slider
                            min={0}
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

                <Title2
                    name="Integrações"
                    right={
                        <Tooltip title="Selecione as contas Business e Broadcast as quais o bot será integrado">
                            <IconButton>
                                <InfoOutlined />
                            </IconButton>
                        </Tooltip>
                    }
                />
                <Box sx={{ gap: "1vw" }}>
                    <IntegrationField title="Business" name="washima_ids" formik={formik} list={washimas} />
                    <IntegrationField
                        title="Broadcast"
                        name="nagazap_ids"
                        formik={formik}
                        list={nagazaps.map((item) => ({ ...item, name: item.displayName || item.appId }))}
                    />
                </Box>

                <Box sx={{ gap: "1vw" }}>
                    <Box sx={{ flexDirection: "column", flex: 1 }}>
                        <Title2
                            name="Inatividade"
                            right={
                                <Switch
                                    checked={idleness}
                                    onChange={(_, checked) => {
                                        setIdleness(checked)
                                        if (!checked) {
                                            formik.setFieldValue("idleness_minutes", 0)
                                            formik.setFieldValue("idleness_message", "")
                                        }
                                    }}
                                />
                            }
                        />
                        <Typography color="secondary.main" sx={{ fontSize: "0.9rem" }}>
                            Enviar uma mensagem ao usuário quando passar um tempo especificado sem interação por parte dele.
                        </Typography>
                        {idleness && (
                            <Box sx={{ gap: "1vw", marginTop: "1vw" }}>
                                <TextField
                                    label="Minutos de inatividade"
                                    value={formik.values.idleness_minutes}
                                    onChange={(ev) => {
                                        const value = Number(ev.target.value.replace(/\D/g, ""))
                                        formik.setFieldValue("idleness_minutes", value)
                                    }}
                                    name="idleness_minutes"
                                    required
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="Mensagem de inatividade"
                                    value={formik.values.idleness_message}
                                    onChange={formik.handleChange}
                                    name="idleness_message"
                                    required
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ flexDirection: "column", flex: 1 }}>
                        <Title2
                            name="Expirar conversa"
                            right={
                                <Switch
                                    checked={expiry}
                                    onChange={(_, checked) => {
                                        setExpiry(checked)
                                        if (!checked) {
                                            formik.setFieldValue("expiry_minutes", 0)
                                            formik.setFieldValue("expiry_message", "")
                                        }
                                    }}
                                />
                            }
                        />
                        <Typography color="secondary.main" sx={{ fontSize: "0.9rem" }}>
                            Encerrar a conversa enviando uma mensagem para o usuário caso passe um tempo especificado sem interação
                        </Typography>
                        {expiry && (
                            <Box sx={{ gap: "1vw", marginTop: "1vw" }}>
                                <TextField
                                    label="Minutos para expirar"
                                    value={formik.values.expiry_minutes}
                                    onChange={(ev) => {
                                        const value = Number(ev.target.value.replace(/\D/g, ""))
                                        formik.setFieldValue("expiry_minutes", value)
                                    }}
                                    name="expiry_minutes"
                                    required
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="Mensagem ao expirar"
                                    value={formik.values.expiry_message}
                                    onChange={formik.handleChange}
                                    name="expiry_message"
                                    required
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Subroute>
    )
}

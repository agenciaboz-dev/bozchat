import React, { useEffect, useState } from "react"
import { Box, Button, Checkbox, Chip, CircularProgress, MenuItem, TextField } from "@mui/material"
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

interface BotFormProps {
    onSubmit: (bot: Bot) => void
    bot?: Bot
}

export const BotForm: React.FC<BotFormProps> = ({ onSubmit, bot }) => {
    const { company } = useUser()
    const navigate = useNavigate()

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [nagazaps, setNagazaps] = useState<Nagazap[]>([])
    const [loading, setLoading] = useState(false)

    const formik = useFormik<BotFormType>({
        initialValues: {
            company_id: company?.id || "",
            nagazap_ids: bot?.nagazap_ids || [],
            washima_ids: bot?.washima_ids || [],
            name: bot?.name || "",
            trigger: bot?.trigger || "",
        },
        async onSubmit(values, formikHelpers) {
            if (loading || !company) return

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
        enableReinitialize: true,
    })

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
                <Button variant="contained" onClick={() => formik.handleSubmit()}>
                    {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Salvar"}
                </Button>
            }
        >
            <Box sx={{ gap: "1vw" }}>
                <TextField label="Nome" value={formik.values.name} onChange={formik.handleChange} name="name" required />
                <TextField label="Gatilho" value={formik.values.trigger} onChange={formik.handleChange} name="trigger" required />
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

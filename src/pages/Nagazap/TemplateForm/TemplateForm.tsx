import React, { useState } from "react"
import { Box, Button, CircularProgress, Grid, MenuItem, Paper, Tab, Tabs, TextField, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { useFormik } from "formik"
import {
    TemplateCategory,
    TemplateComponent as TemplateComponentType,
    TemplateForm as TemplateFormType,
} from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { TemplateHeader } from "./TemplateHeader/TemplateHeader"
import { TemplateFooter } from "./TemplateFooter/TemplateFooter"
import { TemplateBody } from "./TemplateBody/TemplateBody"
import { TemplateButtons } from "./TemplateButtons/TemplateButtons"
import { TemplateComponentForm } from "./TemplateComponentForm"
import { api } from "../../../api"
import { AxiosError } from "axios"
import { useSnackbar } from "burgos-snackbar"
import { meta_normalize } from "../../../tools/normalize"
import { useUser } from "../../../hooks/useUser"
import { Title2 } from "../../../components/Title"

interface TemplateFormProps {
    nagazap: Nagazap
    setShowInformations?: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: () => void
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ nagazap, setShowInformations, onSubmit }) => {
    const { snackbar } = useSnackbar()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    const [loading, setLoading] = useState(false)
    const [templateHeader, setTemplateHeader] = useState<TemplateComponentType>({ type: "HEADER", format: "TEXT", text: "Título" })
    const [templateBody, setTemplateBody] = useState<TemplateComponentType>({
        type: "BODY",
        text: "Mensagem principal, corpo do template",
    })
    const [templateFooter, setTemplateFooter] = useState<TemplateComponentType>({
        type: "FOOTER",
        text: "Rodapé da mensagem",
    })
    const [templateButtons, setTemplateButtons] = useState<TemplateComponentType>({
        type: "BUTTONS",
        buttons: [
            { type: "URL", url: "https://wagazap.boz.app.br", text: "Ir para o site" },
            { type: "QUICK_REPLY", text: "Parar promoções" },
        ],
    })

    const [currentType, setCurrentType] = useState<"HEADER" | "FOOTER" | "BODY" | "BUTTONS">("HEADER")
    const currentComponent =
        currentType === "HEADER"
            ? templateHeader
            : currentType === "BODY"
            ? templateBody
            : currentType === "FOOTER"
            ? templateFooter
            : templateButtons
    const currentSetComponent =
        currentType === "HEADER"
            ? setTemplateHeader
            : currentType === "BODY"
            ? setTemplateBody
            : currentType === "FOOTER"
            ? setTemplateFooter
            : setTemplateButtons

    const [bodyVariables, setBodyVariables] = useState<string[]>([])
    const [headerVariables, setHeaderVariables] = useState<string[]>([])

    const categories: { label: string; value: TemplateCategory }[] = [
        { label: "Autenticação", value: "AUTHENTICATION" },
        { label: "Marketing", value: "MARKETING" },
        { label: "Utilidade", value: "UTILITY" },
    ]

    const formik = useFormik<TemplateFormType>({
        initialValues: {
            language: "pt_BR",
            name: "",
            category: "MARKETING",
            allow_category_change: true,
            components: [templateHeader, templateBody, templateFooter, templateButtons],
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)

            const formData = new FormData()
            if (templateHeader.file) {
                formData.append("file", templateHeader.file)
            }

            const data: TemplateFormType = {
                ...values,
                parameter_format: "NAMED",
                components: [{ ...templateHeader, file: undefined }, templateBody, templateFooter, templateButtons],
            }
            console.log(data)
            formData.append("data", JSON.stringify(data))

            try {
                const response = await api.post("/nagazap/template", formData, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
                console.log(response.data)
                snackbar({
                    severity: "success",
                    text: "Criação do template solicitada, aguardar aprovação. Você pode baixar um modelo de planilha.",
                })
                // window.open(`${api.getUri()}/${response.data.csv_model}`, "_new")
                resetForm()
                onSubmit()
            } catch (error) {
                console.log(error)
                if (error instanceof AxiosError && error.response?.data) {
                    snackbar({ severity: "error", text: error.response.data })
                }
            } finally {
                setLoading(false)
            }
        },
    })

    const resetForm = () => {
        setTemplateHeader({ type: "HEADER", format: "TEXT", text: "Título" })
        setTemplateBody({
            type: "BODY",
            text: "Mensagem principal, corpo do template",
        })
        setTemplateFooter({
            type: "FOOTER",
            text: "Rodapé da mensagem",
        })
        setTemplateButtons({
            type: "BUTTONS",
            buttons: [
                { type: "URL", url: "https://wagazap.boz.app.br", text: "Ir para o site" },
                { type: "QUICK_REPLY", text: "Parar promoções" },
            ],
        })
        formik.resetForm()
        setBodyVariables([])
        setHeaderVariables([])
    }

    return (
        <Paper sx={{ flexDirection: "column", bgcolor: "background.default", padding: "2vw", gap: "1vw", height: "70vh", overflow: "auto" }}>
            <Title2
                name="Novo Template"
                right={
                    <Button variant="contained" onClick={() => formik.handleSubmit()} sx={{ alignSelf: "flex-end" }}>
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Concluir"}
                    </Button>
                }
            />
            <form onSubmit={formik.handleSubmit}>
                <Grid container columns={isMobile ? 1 : 3} spacing={"1vw"}>
                    <Grid item xs={isMobile ? 1 : 2}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "3vw" : "1vw",
                                paddingBottom: "2vw",
                                marginTop: "-1vw",
                                paddingTop: "1vw",
                            }}
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
                                <TextField
                                    label="Tipo"
                                    select
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    name="category"
                                    required
                                    SelectProps={{ MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } } }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            <Tabs value={currentType} onChange={(_, value) => setCurrentType(value)} variant="fullWidth">
                                <Tab value={"HEADER"} label="Cabeçalho" />
                                <Tab value={"BODY"} label="Corpo" />
                                <Tab value={"FOOTER"} label="Rodapé" />
                                <Tab value={"BUTTONS"} label="Botões" />
                            </Tabs>
                            <TemplateComponentForm
                                component={currentComponent}
                                setComponent={currentSetComponent}
                                bodyVariables={bodyVariables}
                                setBodyVariables={setBodyVariables}
                                headerVariables={headerVariables}
                                setHeaderVariables={setHeaderVariables}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Paper
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "2vw" : "1vw",
                                padding: isMobile ? "3vw" : "0.5vw",
                                position: "relative",
                                borderRadius: "0.5vw",
                                borderTopLeftRadius: 0,
                                color: "secondary.main",
                                marginBottom: "2vw",
                            }}
                        >
                            <TemplateHeader component={templateHeader} />
                            <TemplateBody component={templateBody} />
                            <TemplateFooter component={templateFooter} />
                            <TemplateButtons component={templateButtons} />
                            <TrianguloFudido alignment="left" color={"#2a323c"} />
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}

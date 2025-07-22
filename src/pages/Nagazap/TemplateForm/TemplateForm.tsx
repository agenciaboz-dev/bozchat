import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Divider, Grid, IconButton, MenuItem, Tab, Tabs, TextField, Typography, useMediaQuery } from "@mui/material"
import { NagaTemplate, Nagazap } from "../../../types/server/class/Nagazap"
import { useFormik } from "formik"
import {
    TemplateCategory,
    TemplateComponent as TemplateComponentType,
    TemplateForm as TemplateFormType,
} from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TemplateComponentForm } from "./TemplateComponentForm"
import { api } from "../../../api"
import { AxiosError } from "axios"
import { useSnackbar } from "burgos-snackbar"
import { meta_normalize } from "../../../tools/normalize"
import { useUser } from "../../../hooks/useUser"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { TemplatePreview } from "./TemplatePreview"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface TemplateFormProps {
    nagazap: Nagazap
    setShowInformations?: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: () => void
    currentTemplate: NagaTemplate | null
    onClose: () => void
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ nagazap, setShowInformations, onSubmit, currentTemplate, onClose }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const { snackbar } = useSnackbar()
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
            name: currentTemplate?.info.name || "",
            category: currentTemplate?.info.category || "MARKETING",
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
                components: [{ ...templateHeader, file: undefined }, templateBody],
            }
            console.log(data)

            if (templateFooter?.text) {
                data.components.push(templateFooter)
            }

            if (!!templateButtons?.buttons?.length) {
                data.components.push(templateButtons)
            }

            formData.append("data", JSON.stringify(data))

            try {
                const response = currentTemplate
                    ? await api.patch("/nagazap/template", formData, {
                          params: { nagazap_id: nagazap.id, user_id: user?.id, template_id: currentTemplate.id },
                      })
                    : await api.post("/nagazap/template", formData, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
                console.log(response.data)
                snackbar({
                    severity: "success",
                    text: `${
                        currentTemplate ? "Alteração" : "Criação"
                    } do template solicitada, aguardar aprovação. Você pode baixar um modelo de planilha.`,
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
        enableReinitialize: !!currentTemplate,
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

    const handleClose = () => {
        onClose()
        setTimeout(() => resetForm(), 500)
    }

    useEffect(() => {
        if (currentTemplate) {
            console.log({ currentTemplate })
            const header = currentTemplate?.info.components.find((item) => item.type === "HEADER")!
            setTemplateHeader(header)
            const header_vars = header.example?.header_text_named_params
            if (header_vars) {
                setHeaderVariables(header_vars.map((variable) => variable.param_name))
            }

            const body = currentTemplate?.info.components.find((item) => item.type === "BODY")!
            setTemplateBody(body)
            const body_vars = body.example?.body_text_named_params
            if (body_vars) {
                setBodyVariables(body_vars.map((variable) => variable.param_name))
            }

            const footer = currentTemplate?.info.components.find((item) => item.type === "FOOTER")!
            setTemplateFooter(footer)

            const buttons = currentTemplate?.info.components.find((item) => item.type === "BUTTONS")!
            setTemplateButtons(buttons)
        } else {
            handleClose()
        }
    }, [currentTemplate])

    return (
        <Box
            sx={{
                flexDirection: "column",
                bgcolor: "background.default",
                padding: isMobile ? "5vw" : "1.5vw",
                gap: isMobile ? "3vw" : "1vw",
                minHeight: "90vh",
                overflow: "auto",
            }}
        >
            <Title2
                name={currentTemplate ? "Editar Template" : "Novo Template"}
                right={
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                }
            />
            <form onSubmit={formik.handleSubmit}>
                <Grid container columns={isMobile ? 1 : 3} spacing={"1vw"} sx={{ flex: 1 }}>
                    <Grid item xs={isMobile ? 1 : 2}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "5vw" : "1vw",
                                paddingBottom: isMobile ? "5vw" : "2vw",
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
                                    disabled={!!currentTemplate}
                                />
                                <TextField
                                    label="Tipo"
                                    select
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    name="category"
                                    required
                                    disabled={!!currentTemplate && currentTemplate.info.status !== "REJECTED"}
                                    SelectProps={{ MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } } }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            <Divider />
                            <Tabs
                                value={currentType}
                                onChange={(_, value) => setCurrentType(value)}
                                variant={isMobile ? "scrollable" : "fullWidth"}
                                allowScrollButtonsMobile
                                TabIndicatorProps={{
                                    sx: isMobile
                                        ? {
                                              left: 0,
                                              height: "100%",
                                              backgroundColor: darkMode ? "background.primary" : "text.disabled",
                                              opacity: 0.2,
                                          }
                                        : {},
                                }}
                            >
                                <Tab value={"HEADER"} label="Cabeçalho" />
                                <Tab value={"BODY"} label="Corpo" />
                                <Tab value={"FOOTER"} label="Rodapé" />
                                <Tab value={"BUTTONS"} label="Botões" />
                            </Tabs>
                            <Divider />
                            {currentComponent && (
                                <TemplateComponentForm
                                    component={currentComponent}
                                    setComponent={currentSetComponent}
                                    bodyVariables={bodyVariables}
                                    setBodyVariables={setBodyVariables}
                                    headerVariables={headerVariables}
                                    setHeaderVariables={setHeaderVariables}
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ flexDirection: "column", height: "100%", gap: isMobile ? "5vw" : "1vw" }}>
                            {isMobile && <Divider />}
                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>Pré-visualização:</Typography>
                                <TemplatePreview
                                    components={[templateHeader, templateBody, templateFooter, templateButtons]}
                                    image={templateHeader.file}
                                />
                            </Box>
                            <Button variant="contained" onClick={() => formik.handleSubmit()} sx={{ marginTop: "auto" }}>
                                {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Enviar template para análise"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

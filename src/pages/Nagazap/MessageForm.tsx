import React, { useCallback, useEffect, useRef, useState } from "react"
import { Box, Button, CircularProgress, Grid, IconButton, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { OvenForm } from "../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { ArrowBack, Check, CloudUpload, Download, Error, WatchLater } from "@mui/icons-material"
import { api } from "../../api"
import { TemplateInfo, TemplateStatus, TemplateUpdateHook } from "../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { getDataFromSheet } from "../../tools/getPhonesFromSheet"
import { useSnackbar } from "burgos-snackbar"
import { NagaTemplate, Nagazap } from "../../types/server/class/Nagazap"
import { Clear } from "@mui/icons-material"
import { useIo } from "../../hooks/useIo"
import { TemplateFields } from "./TemplateFields"
import { useUser } from "../../hooks/useUser"
import { TemplatePreview } from "./TemplateForm/TemplatePreview"
import { useLocation } from "react-router-dom"

interface MessageFormProps {
    nagazap: Nagazap
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

export const MessageFormScreen: React.FC<MessageFormProps> = ({ nagazap, setShowInformations }) => {
    const io = useIo()

    const inputRef = useRef<HTMLInputElement>(null)

    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const location = useLocation()

    const [templates, setTemplates] = useState<NagaTemplate[]>([])
    const [image, setImage] = useState<File>()
    const [imageError, setImageError] = useState("")
    const [loading, setLoading] = useState(false)
    const [sheetData, setSheetData] = useState<{ telefone: string; [key: string]: string }[]>([])
    const [isImageRequired, setIsImageRequired] = useState(false)
    const [invalidNumbersOnSheetError, setInvalidNumbersOnSheetError] = useState(false)
    const [invalidSheetError, setInvalidSheetError] = useState("")
    const [sheetName, setSheetName] = useState("")

    const validatePhones = (sheetPhones: string[]) => {
        const invalidSheetPhones = sheetPhones.some((phone) => {
            const cleanPhone = phone.replace(/\D/g, "")
            return cleanPhone.length !== 0 && cleanPhone.length !== 10 && cleanPhone.length !== 11
        })

        setInvalidNumbersOnSheetError(invalidSheetPhones)

        return !invalidSheetPhones
    }

    const fetchTemplates = async () => {
        try {
            const response = await api.get("/nagazap/templates", { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            setTemplates(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const formik = useFormik<OvenForm>({
        initialValues: { to: [], template: location.state?.template?.info || null, template_id: "" },
        async onSubmit(values) {
            if (loading) return

            if (!validatePhones(formik.values.to.map((item) => item.telefone))) {
                snackbar({ severity: "error", text: "Existem números com formato inválido." })
                return
            }

            if (!formik.values.to) {
                return
            }

            const formData = new FormData()
            if (image) formData.append("file", image)

            const data: OvenForm = { ...values, template: null }
            formData.append("data", JSON.stringify(data))

            setLoading(true)
            try {
                const response = await api.post("/nagazap/oven", formData, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
                console.log(response)
                snackbar({ severity: "success", text: "Mensagens colocadas no forno" })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    const variables = [
        "telefone",
        ...((formik.values.template
            ? formik.values.template.components
                  .filter((component) => !!component.example)
                  .map((component) => {
                      const param_type = component.type === "HEADER" ? "header_text_named_params" : "body_text_named_params"
                      return component.example![param_type]?.map((item) => item.param_name)
                  })
                  .flatMap((item) => item)
                  .filter((item) => !!item)
            : []) as string[]),
    ]

    const handleSheetsUpload = async (event: any) => {
        setInvalidNumbersOnSheetError(false)
        const files = Array.from(event?.target?.files as FileList)
        setInvalidSheetError("")

        files.forEach(async (file) => {
            if (file) {
                const extension = file.name.split(".")[1]
                if (extension !== "xlsx" && extension !== "csv") {
                    const text = "Formato inválido, o arquivo ter extensão .xlsx ou .csv"
                    setInvalidSheetError(text)
                    snackbar({ severity: "error", text })
                    resetSheet()
                    return
                }

                try {
                    const data = await getDataFromSheet(file, extension)
                    console.log(data)
                    if (!variables.every((variable) => data.every((item) => item[variable]))) {
                        const text = "Planilha inválida: não contém todos os campos necessários para esse template."
                        setInvalidSheetError(text)
                        snackbar({ severity: "error", text })
                        resetSheet()
                        return
                    }

                    setSheetData(data.map((item) => ({ ...item, telefone: item.telefone.replace(/\D/g, "") })))
                    setSheetName(file.name)
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    // const onNewPhone = (phone = "") => {
    //     const to = [...formik.values.to]
    //     to.push(phone)
    //     formik.setFieldValue("to", to)
    // }

    // const onDeleteMessage = (index: number) => {
    //     const to = formik.values.to.filter((_, item_index) => item_index != index)
    //     formik.setFieldValue("to", to)
    // }

    const handleImageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setImageError("")
            const files = Array.from(event.target.files as FileList)
            if (files?.length > 0) {
                const file = files[0]
                if (file.size / 1024 / 1024 > 5) {
                    setImageError("Imagem muito grande, tamanho máximo de 5 MB")
                    return
                }

                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    setImageError("Tipo de arquivo não suportado. Envie uma imagem .png ou .jpeg")
                    return
                }

                setImage(file)
            }
        },
        [image]
    )

    const clearImage = () => {
        setImageError("")
        setImage(undefined)
    }

    const resetSheet = () => {
        setSheetData([])
        setSheetName("")
    }

    const downloadTemplateSheet = async () => {
        try {
            const response = await api.post("/nagazap/template-sheet", formik.values.template, {
                params: { nagazap_id: nagazap.id, user_id: user?.id },
            })
            window.open(`${api.getUri()}/${response.data}`, "_new")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, [nagazap])

    useEffect(() => {
        if (formik.values.template?.components[0].format == "IMAGE") {
            setIsImageRequired(true)
        } else {
            setIsImageRequired(false)
        }

        resetSheet()
        clearImage()
        formik.setFieldValue("template_id", formik.values.template?.id)
    }, [formik.values.template])

    useEffect(() => {
        console.log(formik.values.to)
    }, [formik.values.to])

    useEffect(() => {
        io.on("template:update", (updated_template: { id: string; status: TemplateStatus }) => {
            console.log(updated_template)
            const index = templates.findIndex((item) => item.id === updated_template.id)
            if (index !== -1) {
                setTemplates((list) => {
                    const updated_templates = [...list]
                    updated_templates[index].info.status = updated_template.status
                    return updated_templates
                })
            }
        })

        return () => {
            io.off("template:update")
        }
    }, [templates])

    useEffect(() => {
        formik.setFieldValue("to", sheetData)
    }, [sheetData])

    return (
        <Subroute
            title="Enviar mensagem"
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
                !isMobile && (
                    <Button
                        variant="contained"
                        onClick={() => formik.handleSubmit()}
                        disabled={formik.values.to.length === 0 || !formik.values.template || (isImageRequired && !image)}
                    >
                        {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "Adicionar ao forno"}
                    </Button>
                )
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <Grid container columns={isMobile ? 1 : 3} spacing={isMobile ? "5vw" : "1vw"} height={"100%"}>
                    <Grid item xs={1}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "5vw" : "2vw",
                            }}
                        >
                            {isMobile && (
                                <Button
                                    variant="contained"
                                    onClick={() => formik.handleSubmit()}
                                    disabled={formik.values.to.length === 0 || !formik.values.template || (isImageRequired && !image)}
                                    sx={{ width: "100%", margin: "5vw 0" }}
                                >
                                    {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "Adicionar ao forno"}
                                </Button>
                            )}

                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Selecionar template:</Typography>
                                <TextField
                                    fullWidth
                                    label="Template"
                                    value={formik.values.template?.name || ""}
                                    onChange={(event) =>
                                        formik.setFieldValue("template", templates.find((item) => item.info.name == event.target.value)?.info || null)
                                    }
                                    select
                                    SelectProps={{
                                        SelectDisplayProps: { style: { display: "flex", alignItems: "center", gap: "0.5vw" } },
                                        MenuProps: {
                                            MenuListProps: {
                                                sx: { maxHeight: isMobile ? "33vh" : "20vw", bgcolor: "background.default", overflowY: "scroll" },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value={""} sx={{ display: "none" }} />
                                    {templates
                                        .filter((item) => item.info.status === "APPROVED")
                                        .sort((a, b) => b.created_at - a.created_at)
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.info.name} sx={{ gap: "0.5vw" }} title={item.info.status}>
                                                {item.info.name}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Box>

                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>Planilha modelo:</Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderStyle: "dashed",
                                        height: "100%",
                                        gap: isMobile ? "2vw" : "1vw",
                                    }}
                                    fullWidth
                                    onClick={downloadTemplateSheet}
                                    disabled={!formik.values.template}
                                >
                                    <Download />
                                    Baixar planilha de exemplo
                                </Button>
                            </Box>

                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>Adicionar contatos:</Typography>
                                {!isMobile ? (
                                    <Box sx={{ flexDirection: "column", gap: "0.2vw" }}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{
                                                borderStyle: invalidNumbersOnSheetError || invalidSheetError ? undefined : "dashed",
                                                borderColor: invalidNumbersOnSheetError || invalidSheetError ? "red" : undefined,
                                                height: "100%",
                                                gap: "2vw",
                                            }}
                                            fullWidth
                                            disabled={!formik.values.template}
                                        >
                                            <CloudUpload />
                                            {!!sheetData.length ? `${sheetData.length} número(s) importado(s)` : "Importar planilha"}
                                            <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" multiple />
                                        </Button>
                                        {invalidSheetError && (
                                            <Typography color="error" fontSize="0.9rem">
                                                {invalidSheetError}
                                            </Typography>
                                        )}
                                        {!!sheetData.length && (
                                            <Box sx={{ gap: "1vw", marginTop: "0.5vw" }}>
                                                <Typography sx={{ color: "text.secondary", whiteSpace: "break-spaces" }}>{sheetName}</Typography>
                                                <IconButton onClick={resetSheet} sx={{ padding: 0 }}>
                                                    <Clear />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                ) : null}
                                <Grid container columns={isMobile ? 1 : 2} spacing={isMobile ? 1 : 2}>
                                    {isMobile ? (
                                        <Grid item xs={1}>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                sx={{ borderStyle: "dashed", height: "100%", gap: "2vw" }}
                                                fullWidth
                                            >
                                                <CloudUpload />
                                                {!!sheetData.length ? `${sheetData.length} número(s) importado(s)` : "Importar planilha"}
                                                <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" multiple />
                                            </Button>
                                        </Grid>
                                    ) : null}
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                            {formik.values.template && (
                                <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>ID: {formik.values.template_id}</Typography>
                            )}
                            {formik.values.template?.components.map((component, index) => {
                                if (component.format == "IMAGE") {
                                    return (
                                        <Box key={index} sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                            <Typography sx={{ fontWeight: "bold", color: "text.secondary" }}>Selecionar imagem:</Typography>
                                            <input
                                                type="file"
                                                ref={inputRef}
                                                style={{ display: "none" }}
                                                accept={"image/jpeg,image/png"}
                                                onChange={handleImageChange}
                                            />
                                            {!image && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => inputRef.current?.click()}
                                                    sx={{ borderStyle: "dashed", gap: isMobile ? "2vw" : "1vw" }}
                                                >
                                                    <CloudUpload />
                                                    {"Escolher arquivo"}
                                                </Button>
                                            )}
                                            <Box sx={{ gap: isMobile ? "2vw" : "0.5vw" }}>
                                                <Typography
                                                    sx={{
                                                        color: imageError ? "error.main" : "text.secondary",
                                                        maxWidth: !image ? undefined : isMobile ? "100%" : "22vw",
                                                        overflow: !image ? undefined : "hidden",
                                                        whiteSpace: !image ? undefined : "nowrap",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {imageError ||
                                                        (image ? image.name : "Selecione uma imagem de até 5 MB para ser adicionada à mensagem")}
                                                </Typography>
                                                {image && (
                                                    <IconButton onClick={clearImage} sx={{ padding: 0 }}>
                                                        <Clear />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    )
                                } else {
                                    return null
                                }
                            })}
                            {!!formik.values.template && <TemplateFields variables={variables} to={formik.values.to} />}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        {formik.values.template?.components.length && (
                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>Pré-visualização:</Typography>
                                <TemplatePreview components={formik.values.template.components} image={image} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Subroute>
    )
}

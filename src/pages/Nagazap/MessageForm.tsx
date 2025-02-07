import React, { useCallback, useEffect, useRef, useState } from "react"
import { Avatar, Box, Button, CircularProgress, Grid, IconButton, MenuItem, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { OvenForm } from "../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { ArrowBack, Check, CheckCircle, CloudUpload, Download, Error, WatchLater } from "@mui/icons-material"
import { api } from "../../api"
import { TemplateInfo, TemplateUpdateHook } from "../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { getDataFromSheet, getPhonesfromSheet } from "../../tools/getPhonesFromSheet"
import { useSnackbar } from "burgos-snackbar"
import { Nagazap } from "../../types/server/class/Nagazap"
import { OpenInNew, Reply } from "@mui/icons-material"

import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { Clear } from "@mui/icons-material"
import { SheetExample } from "./TemplateForm/SheetExample"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import MaskedInputComponent from "../../components/MaskedInput"
import { useIo } from "../../hooks/useIo"
import { TemplateFields } from "./TemplateFields"

interface MessageFormProps {
    nagazap: Nagazap
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

export const MessageFormScreen: React.FC<MessageFormProps> = ({ nagazap, setShowInformations }) => {
    const io = useIo()
    const icons = [
        { type: "QUICK_REPLY", icon: <Reply /> },
        { type: "URL", icon: <OpenInNew /> },
    ]

    const maxSize = "23vw"
    const inputRef = useRef<HTMLInputElement>(null)

    const { snackbar } = useSnackbar()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [templates, setTemplates] = useState<TemplateInfo[]>([])
    const [image, setImage] = useState<File>()
    const [imageError, setImageError] = useState("")
    const [loading, setLoading] = useState(false)
    const [sheetData, setSheetData] = useState<{ telefone: string; [key: string]: string }[]>([])
    const [isImageRequired, setIsImageRequired] = useState(false)
    const [invalidNumbersError, setInvalidNumbersError] = useState(false)
    const [invalidNumbersOnSheetError, setInvalidNumbersOnSheetError] = useState(false)
    const [errorIndexes, setErrorIndexes] = useState<number[]>([])
    const [invalidSheetError, setInvalidSheetError] = useState("")

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
            const response = await api.get("/nagazap/templates", { params: { nagazap_id: nagazap.id } })
            setTemplates(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const formik = useFormik<OvenForm>({
        initialValues: { to: [], template: null },
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

            const data: OvenForm = { ...values }
            formData.append("data", JSON.stringify(data))

            setLoading(true)
            try {
                const response = await api.post("/nagazap/oven", formData, { params: { nagazap_id: nagazap.id } })
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
                    setInvalidSheetError("Formato inválido, o arquivo de ser uma planilha do excel do tipo xlsx")
                    snackbar({ severity: "error", text: "Formato inválido, o arquivo de ser uma planilha do excel do tipo xlsx" })
                    return
                }

                try {
                    const data = await getDataFromSheet(file, extension)
                    console.log(data)
                    setSheetData(data.map((item) => ({ ...item, telefone: item.telefone.replace(/\D/g, "") })))
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

    const downloadTemplateSheet = async () => {
        try {
            const response = await api.post("/nagazap/template-sheet", formik.values.template, {
                params: { nagazap_id: nagazap.id },
            })
            window.open(`${api.getUri()}/${response.data}`, "_new")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    useEffect(() => {
        if (formik.values.template?.components[0].format == "IMAGE") {
            setIsImageRequired(true)
        } else {
            setIsImageRequired(false)
        }

        setSheetData([])
        clearImage()
    }, [formik.values.template])

    useEffect(() => {
        console.log(formik.values.to)
    }, [formik.values.to])

    useEffect(() => {
        io.on("template:update", (updated_template: TemplateUpdateHook) => {
            const index = templates.findIndex((item) => item.id === updated_template.message_template_id.toString())
            if (index !== -1) {
                const updated_templates = [...templates]
                const template = updated_templates[index]
                template.status = updated_template.event
                setTemplates(updated_templates)
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
                <Button
                    variant="contained"
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.values.to.length === 0 || !formik.values.template || (isImageRequired && !image)}
                >
                    {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "Adicionar ao forno"}
                </Button>
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <Grid container columns={isMobile ? 1 : 3} spacing={"1vw"}>
                    <Grid item xs={1}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "2vw" : "2vw",
                            }}
                        >
                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>Selecionar template:</Typography>
                                <TextField
                                    fullWidth
                                    label="Template"
                                    value={formik.values.template?.name || ""}
                                    onChange={(event) =>
                                        formik.setFieldValue("template", templates.find((item) => item.name == event.target.value) || null)
                                    }
                                    select
                                    SelectProps={{
                                        SelectDisplayProps: { style: { display: "flex", alignItems: "center", gap: "0.5vw" } },
                                        MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } },
                                    }}
                                >
                                    <MenuItem value={""} sx={{ display: "none" }} />
                                    {templates.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            value={item.name}
                                            sx={{ gap: "0.5vw" }}
                                            title={item.status}
                                            disabled={item.status !== "APPROVED"}
                                        >
                                            {item.status === "PENDING" && <WatchLater color="warning" />}
                                            {item.status === "APPROVED" && <Check color="success" />}
                                            {item.status === "REJECTED" && <Error color="error" />}
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                                <Typography sx={{ fontWeight: 600, color: "secondary.main" }}>Planilha modelo:</Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderStyle: invalidNumbersOnSheetError || invalidSheetError ? undefined : "dashed",
                                        borderColor: invalidNumbersOnSheetError || invalidSheetError ? "red" : undefined,
                                        height: "100%",
                                        gap: isMobile ? "2vw" : "1vw",
                                    }}
                                    fullWidth
                                    onClick={downloadTemplateSheet}
                                >
                                    <Download />
                                    Baixar planilha de exemplo
                                </Button>
                            </Box>

                            <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                <Typography sx={{ fontWeight: 600, color: "secondary.main" }}>Adicionar contatos:</Typography>
                                {!isMobile ? (
                                    <Box sx={{ flexDirection: "column", gap: "0.2vw" }}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{
                                                borderStyle: invalidNumbersOnSheetError || invalidSheetError ? undefined : "dashed",
                                                borderColor: invalidNumbersOnSheetError || invalidSheetError ? "red" : undefined,
                                                height: "100%",
                                                gap: isMobile ? "2vw" : "1vw",
                                            }}
                                            fullWidth
                                        >
                                            <CloudUpload />
                                            {!!sheetData.length ? `${sheetData.length} números importados` : "Importar planilha"}
                                            <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" multiple />
                                        </Button>
                                        {invalidSheetError && (
                                            <Typography color="error" fontSize="0.9rem">
                                                {invalidSheetError}
                                            </Typography>
                                        )}
                                    </Box>
                                ) : null}
                                <Grid container columns={isMobile ? 1 : 2} spacing={isMobile ? 1 : 2}>
                                    {isMobile ? (
                                        <Grid item xs={1}>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                sx={{ borderStyle: "dashed", height: "100%", gap: isMobile ? "2vw" : "1vw" }}
                                                fullWidth
                                            >
                                                <CloudUpload />
                                                {!!sheetData.length ? `${sheetData.length} números importados` : "Importar planilha"}
                                                <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" multiple />
                                            </Button>
                                        </Grid>
                                    ) : null}
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                            {formik.values.template?.components.map((component, index) => {
                                if (component.format == "IMAGE") {
                                    return (
                                        <Box key={index} sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
                                            <Typography sx={{ fontWeight: "bold", color: "secondary.main" }}>Selecionar imagem:</Typography>
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
                                                    sx={{ borderStyle: "dashed", gap: "1vw" }}
                                                >
                                                    <CloudUpload />
                                                    {"Escolher arquivo"}
                                                </Button>
                                            )}
                                            <Box sx={{ gap: isMobile ? "2vw" : "0.5vw" }}>
                                                <Typography
                                                    sx={{
                                                        color: imageError ? "error.main" : "secondary.main",
                                                        maxWidth: !image ? undefined : "22vw",
                                                        overflow: !image ? undefined : "hidden",
                                                        whiteSpace: !image ? undefined : "nowrap",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {imageError ||
                                                        (image ? image.name : "Selecione uma imagem de até 5 MB para ser adicionada a mensagem")}
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
                            <Box
                                sx={{
                                    overflowY: "auto",
                                    maxHeight: "36vw",
                                    flexDirection: "column",
                                    padding: "1vw",
                                    margin: "-1vw",
                                    marginBottom: "-2vw",
                                    paddingBottom: "2vw",
                                }}
                            >
                                <Paper
                                    sx={{
                                        flexDirection: "column",
                                        gap: isMobile ? "2vw" : "1vw",
                                        padding: isMobile ? "4vw" : "0.5vw",
                                        position: "relative",
                                        borderRadius: "0.5vw",
                                        borderTopLeftRadius: 0,
                                        color: "secondary.main",
                                    }}
                                >
                                    <TrianguloFudido alignment="left" color="#2a323c" />
                                    {formik.values.template?.components.map((component, index) => {
                                        if (component.format == "IMAGE") {
                                            const imageSrc = image ? URL.createObjectURL(image) : undefined
                                            return (
                                                <Box key={index} sx={{ justifyContent: "center" }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        src={imageSrc}
                                                        sx={{
                                                            width: "100%",
                                                            maxWidth: isMobile ? undefined : maxSize,
                                                            maxHeight: isMobile ? undefined : maxSize,
                                                            objectFit: "cover",
                                                            height: imageSrc == undefined ? (isMobile ? "60vw" : maxSize) : "auto",
                                                            bgcolor: "background.default",
                                                            margin: "   ",
                                                        }}
                                                    >
                                                        <CloudUpload color="primary" sx={{ width: "30%", height: "auto" }} />
                                                    </Avatar>
                                                </Box>
                                            )
                                        }
                                        if (component.text) {
                                            return (
                                                <Typography
                                                    key={index}
                                                    color="#fff"
                                                    sx={{
                                                        fontWeight: component.type == "HEADER" ? "bold" : undefined,
                                                        fontSize: component.type == "FOOTER" ? "0.8rem" : undefined,
                                                        opacity: component.type == "FOOTER" ? 0.5 : 1,
                                                    }}
                                                >
                                                    {component.text}
                                                </Typography>
                                            )
                                        }
                                        if (component.buttons) {
                                            return (
                                                <Box key={index} sx={{ gap: "0.5vw", flexDirection: "column" }}>
                                                    {component.buttons?.map((button, index) => (
                                                        <Button
                                                            key={`${button.text}-${index}`}
                                                            variant="text"
                                                            fullWidth
                                                            sx={{ textTransform: "none" }}
                                                            startIcon={icons.find((item) => item.type === button.type)?.icon}
                                                            onClick={() => button.type === "URL" && window.open(button.url, "_blank")}
                                                        >
                                                            {button.text}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            )
                                        }
                                        return null
                                    })}
                                </Paper>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Subroute>
    )
}

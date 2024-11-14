import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import {
    alpha,
    Avatar,
    Box,
    BoxProps,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { OvenForm } from "../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { Check, CloudUpload, DeleteForever, Error, PlusOne, Refresh, WatchLater } from "@mui/icons-material"
import { api } from "../../api"
import { TemplateComponent, TemplateInfo } from "../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
// import { Avatar } from "@files-ui/react"
import { getPhonesfromSheet } from "../../tools/getPhonesFromSheet"
import { useSnackbar } from "burgos-snackbar"
import { Nagazap } from "../../types/server/class/Nagazap"
import ReplyIcon from "@mui/icons-material/Reply"
import { OpenInNew, Reply } from "@mui/icons-material"

import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import ThemeContext from "../../contexts/themeContext"
import { object } from "yup"
import { Clear } from "@mui/icons-material"
import { SheetExample } from "./TemplateForm/SheetExample"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { usePhoneMask } from "burgos-masks"

interface MessageFormProps {
    nagazap: Nagazap
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

const ComponentType: React.FC<{ component: TemplateComponent }> = ({ component }) => {
    return <Box sx={{ color: "secondary.main", fontWeight: "bold" }}>{component.type}</Box>
}

export const MessageFormScreen: React.FC<MessageFormProps> = ({ nagazap, setShowInformations }) => {
    const icons = [
        { type: "QUICK_REPLY", icon: <Reply /> },
        { type: "URL", icon: <OpenInNew /> },
    ]

    const maxSize = "23vw"
    const phone_mask = usePhoneMask()
    const inputRef = useRef<HTMLInputElement>(null)

    const { snackbar } = useSnackbar()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [templates, setTemplates] = useState<TemplateInfo[]>([])
    const [image, setImage] = useState<File>()
    const [imageError, setImageError] = useState("")
    const [loading, setLoading] = useState(false)
    const [sheetPhones, setSheetPhones] = useState<string[]>([])
    const [isImageRequired, setIsImageRequired] = useState(false)

    const fetchTemplates = async () => {
        try {
            const response = await api.get("/nagazap/templates", { params: { nagazap_id: nagazap.id } })
            setTemplates(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const formik = useFormik<OvenForm>({
        initialValues: { to: [""], template: null },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            console.log(values)
            const formData = new FormData()
            if (image) formData.append("file", image)

            const data: OvenForm = { ...values, to: [...values.to, ...sheetPhones] }
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

    const handleSheetsUpload = async (event: any) => {
        const files = Array.from(event?.target?.files as FileList)

        console.log(files)

        files.forEach(async (file) => {
            if (file) {
                try {
                    const phones = await getPhonesfromSheet(file)
                    setSheetPhones(phones.map((phone) => phone.phone))
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    const onNewPhone = (phone = "") => {
        const to = [...formik.values.to]
        to.push(phone)
        formik.setFieldValue("to", to)
    }

    const onDeleteMessage = (index: number) => {
        const to = formik.values.to.filter((_, item_index) => item_index != index)
        formik.setFieldValue("to", to)
    }

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

    useEffect(() => {
        fetchTemplates()
    }, [])

    useEffect(() => {
        if (formik.values.template?.components[0].format == "IMAGE") {
            setIsImageRequired(true)
        } else {
            setIsImageRequired(false)
        }
    }, [formik.values.template])

    useEffect(() => {
        console.log(formik.values.template)
    }, [formik.values.template])

    return (
        <Subroute
            title="Enviar mensagem"
            right={
                <IconButton
                    onClick={() => {
                        setShowInformations(false)
                    }}
                >
                    <Refresh />
                </IconButton>
            }
        >
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ height: "64vh" }}>
                    <Grid container columns={isMobile ? 1 : 3} spacing={"1vw"}>
                        <Grid item xs={1}>
                            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                                <Typography sx={{ fontWeight: 600, color: "secondary.main" }}>Adicionar telefones:</Typography>
                                <Grid container columns={1}>
                                    <Grid item xs={1}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{ borderStyle: "dashed", height: "100%", gap: "1vw" }}
                                            fullWidth
                                        >
                                            <CloudUpload />
                                            {!!sheetPhones.length ? `${sheetPhones.length} números importados` : "Importar planilha"}
                                            <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" multiple />
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container columns={isMobile ? 1 : 2} spacing={2}>
                                    {formik.values.to.map((number, index) => (
                                        <Grid item xs={1} key={index}>
                                            <TextField
                                                label="Número"
                                                name={`to[${index}]`}
                                                value={number}
                                                onChange={formik.handleChange}
                                                InputProps={{
                                                    sx: { gap: "0.5vw" },
                                                    startAdornment: (
                                                        <IconButton color="secondary" onClick={() => onDeleteMessage(index)} sx={{ padding: 0 }}>
                                                            <DeleteForever />
                                                        </IconButton>
                                                    ),
                                                    inputComponent: MaskedInput,
                                                    inputProps: { mask: phone_mask, inputMode: "numeric" },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item xs={1}>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderStyle: "dashed",
                                                height: "100%",
                                                fontSize: "0.8rem",
                                                gap: "0.5vw",
                                                paddingLeft: "0.5vw",
                                                minHeight: "56px",
                                            }}
                                            onClick={() => onNewPhone()}
                                            fullWidth
                                        >
                                            <AddCircleIcon fontSize="small" />
                                            Adicionar Contato
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Typography sx={{ color: "secondary.main" }}>Segue abaixo um modelo de como deve ser a planilha:</Typography>
                                <SheetExample />
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box
                                sx={{
                                    flexDirection: "column",
                                    gap: isMobile ? "8vw" : "2vw",
                                }}
                            >
                                <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                                    <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>Selecionar templates:</Typography>
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
                                    <Typography sx={{ color: "secondary.main" }}>
                                        Por favor, selecione o template desejado para o envio da mensagem:
                                    </Typography>
                                </Box>
                                {formik.values.template?.components.map((component) => {
                                    if (component.format == "IMAGE") {
                                        return (
                                            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                                                <input
                                                    type="file"
                                                    ref={inputRef}
                                                    style={{ display: "none" }}
                                                    accept={"image/jpeg,image/png"}
                                                    onChange={handleImageChange}
                                                />

                                                <Button variant="contained" onClick={() => inputRef.current?.click()}>
                                                    {"Selecionar imagem"}
                                                </Button>
                                                <Box sx={{ gap: isMobile ? "5vw" : "0.5vw" }}>
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={
                                        (!formik.values.to.length && !sheetPhones.length) || !formik.values.template || (isImageRequired && !image)
                                    }
                                    sx={{ marginTop: isMobile ? "5vw" : "1vw" }}
                                >
                                    {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "Adicionar a fila"}
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={1}>
                            {formik.values.template?.components.length && (
                                <>
                                    <Paper
                                        sx={{
                                            flexDirection: "column",
                                            gap: isMobile ? "5vw" : "1vw",
                                            padding: isMobile ? "4vw" : "0.5vw",
                                            position: "relative",
                                            borderRadius: "0.5vw",
                                            borderTopLeftRadius: 0,
                                            color: "secondary.main",
                                        }}
                                    >
                                        <TrianguloFudido alignment="left" color="#2a323c" />
                                        {formik.values.template?.components.map((component) => {
                                            if (component.format == "IMAGE") {
                                                const imageSrc = image ? URL.createObjectURL(image) : undefined
                                                return (
                                                    <Box sx={{ justifyContent: "center" }}>
                                                        <Avatar
                                                            variant="rounded"
                                                            src={imageSrc}
                                                            sx={{
                                                                width: "100%",
                                                                maxWidth: maxSize,
                                                                maxHeight: maxSize,
                                                                objectFit: "cover",
                                                                height: imageSrc == undefined ? maxSize : "auto",
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
                                                    <>
                                                        {component.buttons?.map((button, index) => (
                                                            <Button
                                                                key={`${button.text}-${index}`}
                                                                variant="text"
                                                                fullWidth
                                                                sx={{ textTransform: "none", gap: "1vw" }}
                                                                startIcon={icons.find((item) => item.type === button.type)?.icon}
                                                                onClick={() => button.type === "URL" && window.open(button.url, "_blank")}
                                                            >
                                                                {button.text}
                                                            </Button>
                                                        ))}
                                                    </>
                                                )
                                            }
                                            return null
                                        })}
                                    </Paper>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Subroute>
    )
}

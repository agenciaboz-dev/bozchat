import React, { useContext, useEffect, useRef, useState } from "react"
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
import { Check, CloudUpload, DeleteForever, Error, PlusOne, WatchLater } from "@mui/icons-material"
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

interface MessageFormProps {
    nagazap: Nagazap
}

const ComponentType: React.FC<{ component: TemplateComponent }> = ({ component }) => {
    return <Box sx={{ color: "secondary.main", fontWeight: "bold" }}>{component.type}</Box>
}

export const MessageFormScreen: React.FC<MessageFormProps> = ({ nagazap }) => {
    const icons = [
        { type: "QUICK_REPLY", icon: <Reply /> },
        { type: "URL", icon: <OpenInNew /> },
    ]

    const maxSize = "23vw"
    const { snackbar } = useSnackbar()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [templates, setTemplates] = useState<TemplateInfo[]>([])
    const [image, setImage] = useState<File>()
    const [loading, setLoading] = useState(false)
    const [sheetPhones, setSheetPhones] = useState<string[]>([])
    const [maxHeight, setMaxHeight] = useState(0)

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
        const file = event?.target?.files[0]
        if (file) {
            try {
                const phones = await getPhonesfromSheet(file)
                setSheetPhones(phones.map((phone) => phone.phone))
            } catch (error) {
                console.log(error)
            }
        }
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

    const handleImageChange = (file: File) => {
        setImage(file)
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    return (
        <Subroute title="Enviar mensagem">
            <form onSubmit={formik.handleSubmit}>
                <Grid container columns={isMobile ? 1 : 3} spacing={"1vw"}>
                    <Grid item xs={2}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: isMobile ? "8vw" : "2vw",
                            }}
                        >
                            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                                <Typography>Por favor, selecione o template desejado para o envio da mensagem:</Typography>
                                <TextField
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
                                    sx={{ maxWidth: isMobile ? "100%" : maxSize }}
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

                            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                                <Typography>
                                    Importe a planilha contendo os números para os quais deseja enviar a mensagem ou adicione manualmente.
                                </Typography>
                                <Grid container columns={isMobile ? 1 : 3} spacing={2}>
                                    <Grid item xs={1}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{ borderStyle: "dashed", height: "100%", gap: "1vw" }}
                                            fullWidth
                                        >
                                            <CloudUpload />
                                            {!!sheetPhones.length ? `${sheetPhones.length} números importados` : "Importar planilha"}
                                            <input onChange={handleSheetsUpload} style={{ display: "none" }} type="file" />
                                        </Button>
                                    </Grid>
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
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item xs={1}>
                                        <Button
                                            variant="outlined"
                                            sx={{ borderStyle: "dashed", height: "100%" }}
                                            onClick={() => onNewPhone()}
                                            fullWidth
                                        >
                                            <PlusOne />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            {!isMobile && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={(!formik.values.to.length && !sheetPhones.length) || !formik.values.template}
                                >
                                    {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "enviar"}
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={1}>
                        {formik.values.template?.components.length && (
                            <>
                                <Paper
                                    sx={{
                                        // width: "object-fit",
                                        // maxWidth: isMobile ? undefined : "30vw",
                                        flexDirection: "column",
                                        gap: isMobile ? "5vw" : "1vw",
                                        padding: isMobile ? "4vw" : "0.5vw",
                                        position: "relative",
                                        borderRadius: "0.5vw",
                                        borderTopLeftRadius: 0,
                                        color: "secondary.main",
                                        // margin: "0 auto",
                                    }}
                                >
                                    <TrianguloFudido alignment="left" color="#2a323c" />
                                    {formik.values.template?.components.map((component, index) => {
                                        if (component.format == "IMAGE") {
                                            const imageSrc = component.file ? URL.createObjectURL(component.file) : undefined
                                            return (
                                                <Box sx={{ justifyContent: "center" }}>
                                                    {/* <Avatar
                                                        style={{ width: "60%", height: "auto", aspectRatio: "2/1", objectFit: "contain" }}
                                                        emptyLabel="Enviar imagem"
                                                        changeLabel="Trocar imagem"
                                                        src={image}
                                                        onChange={(file) => handleImageChange(file)}
                                                    /> */}
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
                                {isMobile && (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={(!formik.values.to.length && !sheetPhones.length) || !formik.values.template}
                                        sx={{ marginTop: isMobile ? "5vw" : undefined }}
                                    >
                                        {loading ? <CircularProgress size="1.5rem" color="inherit" /> : "enviar"}
                                    </Button>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Subroute>
    )
}

import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, TextField, Typography } from "@mui/material"
import { Washima, WashimaForm } from "../../types/server/class/Washima/Washima"
import { Title2 } from "../../components/Title"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import * as Yup from "yup"
import { api } from "../../api"
import { Close } from "@mui/icons-material"
import { QRCode } from "react-qrcode-logo"

interface WashimaFormModalProps {
    onSuccess: (washima: Washima) => void
    currentWashima: Washima | null
    open: boolean
    setCurrentWashima: React.Dispatch<React.SetStateAction<Washima>>
    onClose: () => void
}

export const WashimaFormModal: React.FC<WashimaFormModalProps> = (props) => {
    const { user, company } = useUser()

    const [loading, setLoading] = useState(false)

    const formik = useFormik<WashimaForm>({
        initialValues: { name: props.currentWashima?.name || "", company_id: company!.id },
        async onSubmit(values, formikHelpers) {
            if (loading || !company) return

            try {
                setLoading(true)
                const data: WashimaForm = { ...values }
                const response = props.currentWashima
                    ? await api.patch("/washima", { ...data, id: props.currentWashima.id }, { params: { user_id: user?.id } })
                    : await api.post("/washima", { ...data, company_id: company.id }, { params: { user_id: user?.id } })
                console.log(response.data)
                props.onSuccess(response.data)

                if (props.currentWashima) {
                    handleClose()
                    setLoading(false)
                } else {
                    props.setCurrentWashima(response.data)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("campo obrigatório").min(3, "aí você tá de sacanagem né"),
        }),
        enableReinitialize: true,
        validateOnChange: false,
    })

    const handleClose = () => {
        props.onClose()
        formik.resetForm()
    }

    useEffect(() => {
        if (props.currentWashima?.qrcode) {
            setLoading(false)
        }

        if (props.currentWashima?.status === "ready") {
            handleClose()
        }
    }, [props.currentWashima])

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperProps={{ sx: { flexDirection: "column", padding: "1vw", gap: "1vw", bgcolor: "background.default" } }}
        >
            <Title2
                name={props.currentWashima?.name || "Novo Business"}
                right={
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                }
            />
            <Typography sx={{ color: "secondary.main", fontSize: "0.8rem", marginTop: "-1vw" }}>
                {props.currentWashima
                    ? props.currentWashima.status === "loading"
                        ? "Se o Whatsapp Web ainda não estiver autenticado, o Qr Code aparecerá abaixo quando estiver pronto."
                        : "Edite o nome da instância. O nome de exibição do Whatsapp Web pode ser alterado pelo próprio dispositivo."
                    : "Após salvar, a instância será inicializada e um QR Code irá aparecer logo abaixo para realizar a autenticação do Whatsapp Web. A primeira inicialização pode demorar alguns minutos."}
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="Nome"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && !!formik.errors.name}
                    helperText={formik.errors.name}
                    required
                    autoComplete="off"
                    fullWidth
                />
                {props.currentWashima?.qrcode && <Box sx={{alignSelf: 'center'}}><QRCode size={300} value={props.currentWashima.qrcode} /></Box>}
                <Button sx={{ alignSelf: "flex-end" }} variant="contained" type="submit" disabled={formik.values.name === formik.initialValues.name}>
                    {loading ? <CircularProgress /> : "Salvar"}
                </Button>
            </form>
        </Dialog>
    )
}

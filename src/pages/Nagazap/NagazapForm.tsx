import React, { Dispatch, SetStateAction, useState } from "react"
import { Box, Button, CircularProgress, Grid, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { Nagazap, NagazapForm as NagazapFormType } from "../../types/server/class/Nagazap"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { api } from "../../api"
import { AxiosError } from "axios"
import { HandledError } from "../../types/server/class/HandledError"
import { ArrowBack, Refresh } from "@mui/icons-material"

interface NagazapFormProps {
    onSuccess: (nagazap: Nagazap) => void
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const NagazapForm: React.FC<NagazapFormProps> = ({ onSuccess, setShowInformations }) => {
    const { company, user } = useUser()
    const theme = useTheme()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const PrimaryText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <span style={{ color: theme.palette.primary.main }}>{children}</span>
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const formik = useFormik<NagazapFormType>({
        initialValues: { appId: "", businessId: "", companyId: company?.id || "", phoneId: "", token: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            setError("")

            try {
                const response = await api.post("/nagazap", values, { params: { user_id: user?.id } })
                onSuccess(response.data)
            } catch (error) {
                // console.log(error)
                if (error instanceof AxiosError && error.response?.status === 400) {
                    const handled_error = error.response?.data as HandledError
                    setError(handled_error.text)
                }
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <Subroute
            title="Adicionar conta"
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
        >
            <Box sx={{ flex: 1, flexDirection: "column", gap: 3, color: "secondary.main" }}>
                <p>
                    Para cadastrar uma conta no Nagazap, é preciso ter uma <PrimaryText>MBA (Meta Business Account)</PrimaryText> ativa com um App
                    adicionado e configurado para usar o Whatsapp. Todos os IDs abaixo podem ser coletados do painel do App no Meta.
                </p>
                <p>App ID: localizado no canto superior esquerdo, no painel do App</p>
                <p style={{ color: theme.palette.secondary.main }}>
                    Token, Phone ID, Business ID: No painel do App, no menu a esquerda. Expanda <PrimaryText>Whatsapp</PrimaryText> e selecione{" "}
                    <PrimaryText>configuração da API</PrimaryText>. O Token é gerado na primeira seção dessa página, e logo abaixo estão os IDs que
                    faltam.
                </p>
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ fontWeight: "bold", color: "primary.main" }}>Formulário</Box>
                    <Grid container columns={isMobile ? 1 : 3} spacing={3}>
                        <Grid item xs={1}>
                            <TextField
                                label="Business Id"
                                name="businessId"
                                value={formik.values.businessId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle}
                                required
                                error={!!error}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                label="App Id"
                                name="appId"
                                value={formik.values.appId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle}
                                required
                                error={!!error}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                label="Phone Id"
                                name="phoneId"
                                value={formik.values.phoneId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle}
                                required
                                error={!!error}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Token"
                        name="token"
                        value={formik.values.token}
                        onChange={formik.handleChange}
                        sx={textFieldStyle}
                        required
                        error={!!error}
                        helperText={error}
                        multiline
                        maxRows={2}
                        minRows={2}
                    />

                    <Button variant="contained" sx={{ alignSelf: "flex-end" }} type="submit">
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Enviar"}
                    </Button>
                </form>
            </Box>
        </Subroute>
    )
}

import React, { useState } from "react"
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { Nagazap, NagazapForm as NagazapFormType } from "../../types/server/class/Nagazap"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { api } from "../../api"
import { AxiosError } from "axios"
import { HandledError } from "../../types/server/class/HandledError"

interface NagazapFormProps {
    onSuccess: (nagazap: Nagazap) => void
}

export const NagazapForm: React.FC<NagazapFormProps> = ({ onSuccess }) => {
    const { user } = useUser()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const formik = useFormik<NagazapFormType>({
        initialValues: { appId: "", businessId: "", userId: user?.id || "", phoneId: "", token: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            setError("")

            try {
                const response = await api.post("/nagazap", values)
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
        <Subroute title="Adicionar conta">
            <Box sx={{ flex: 1, flexDirection: "column", gap: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container columns={3} spacing={3}>
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
                    />

                    <Button variant="contained" sx={{ alignSelf: "flex-end" }} type="submit">
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Enviar"}
                    </Button>
                </form>
            </Box>
        </Subroute>
    )
}

import React, { useState } from "react"
import { Box, Button, CircularProgress, Paper, TextField } from "@mui/material"
import { Nagazap } from "../../types/server/class/Nagazap"
import { useFormik } from "formik"
import { api } from "../../api"
import { Subroute } from "./Subroute"
import { useSnackbar } from "burgos-snackbar"

interface TokenProps {
    nagazap: Nagazap
}

export const Token: React.FC<TokenProps> = ({ nagazap }) => {
    const { snackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)

    const formik = useFormik<{ token: string }>({
        initialValues: { token: nagazap?.token || "" },
        onSubmit: async (values) => {
            if (loading || !nagazap) return
            setLoading(true)
            try {
                const response = await api.patch("/nagazap/token", values, { params: { nagazap_id: nagazap.id } })
                snackbar({ severity: "success", text: "Token atualizado!" })
            } catch (error) {
                console.log(error)
                snackbar({ severity: "error", text: "Erro ao atualizar token" })
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    return (
        <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
            <Box sx={{ fontWeight: "bold", color: "secondary.main" }}>Token</Box>
            <form onSubmit={formik.handleSubmit} style={{}}>
                <TextField
                    label={new Date(Number(nagazap.lastUpdated)).toLocaleString("pt-br")}
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    multiline
                    maxRows={2}
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-end" }}>
                    {loading ? <CircularProgress size={"1.5rem"} color="inherit" /> : "salvar"}
                </Button>
            </form>
        </Box>
    )
}

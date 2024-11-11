import React, { useState } from "react"
import { Box, Button, CircularProgress, Paper, Switch, TextField } from "@mui/material"
import { Nagazap } from "../../types/server/class/Nagazap"
import { useFormik } from "formik"
import { api } from "../../api"
import { Subroute } from "./Subroute"
import { useSnackbar } from "burgos-snackbar"
import { Lock, LockOpen } from "@mui/icons-material"

interface TokenProps {
    nagazap: Nagazap
}

export const Token: React.FC<TokenProps> = ({ nagazap }) => {
    const { snackbar } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [locked, setLocked] = useState(true)

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
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <Box sx={{ fontWeight: "bold", color: "secondary.main", alignItems: "center" }}>
                Token
                <Switch
                    checked={locked}
                    color={locked ? "success" : "warning"}
                    onChange={(_, value) => setLocked(value)}
                    checkedIcon={<Lock />}
                    icon={<LockOpen />}
                />
            </Box>
            <form onSubmit={formik.handleSubmit} style={{}}>
                <TextField
                    label={new Date(Number(nagazap.lastUpdated)).toLocaleString("pt-br")}
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    multiline
                    maxRows={2}
                    disabled={locked}
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-end" }} disabled={nagazap.token === formik.values.token}>
                    {loading ? <CircularProgress size={"1.5rem"} color="inherit" /> : "salvar"}
                </Button>
            </form>
        </Box>
    )
}

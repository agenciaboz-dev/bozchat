import React, { useState } from "react"
import { Box, Button, CircularProgress, Paper, TextField } from "@mui/material"
import { Nagazap } from "../../types/server/class/Nagazap"
import { useFormik } from "formik"
import { api } from "../../api"
import { Subroute } from "./Subroute"

interface TokenProps {
    nagazap?: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
}

export const Token: React.FC<TokenProps> = ({ nagazap, setNagazap }) => {
    const [loading, setLoading] = useState(false)

    const formik = useFormik<{ token: string }>({
        initialValues: { token: nagazap?.token || "" },
        onSubmit: async (values) => {
            if (loading || !nagazap) return
            setLoading(true)
            try {
                const response = await api.patch("/nagazap/token", values, { params: { nagazap_id: nagazap.id } })
                setNagazap(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    return (
        <Subroute title="Token">
            {nagazap ? (
                <form onSubmit={formik.handleSubmit} style={{ gap: "1vw", display: "flex" }}>
                    <TextField
                        label={new Date(Number(nagazap.lastUpdated)).toLocaleString("pt-br")}
                        name="token"
                        value={formik.values.token}
                        onChange={formik.handleChange}
                    />
                    <Button type="submit" variant="contained">
                        {loading ? <CircularProgress size={"1.5rem"} color="inherit" /> : "salvar"}
                    </Button>
                </form>
            ) : (
                <p>cadê o nagazap</p>
            )}
        </Subroute>
    )
}

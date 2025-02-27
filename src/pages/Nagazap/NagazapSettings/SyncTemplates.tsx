import React, { useState } from "react"
import { Box, Button, CircularProgress } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { api } from "../../../api"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../../hooks/useUser"

interface SyncTemplatesProps {
    nagazap: Nagazap
}

export const SyncTemplates: React.FC<SyncTemplatesProps> = ({ nagazap }) => {
    const { snackbar } = useSnackbar()
    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    const onClick = async () => {
        if (loading) return
        setLoading(true)

        try {
            const response = await api.post("/nagazap/sync-templates", {}, { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            snackbar({ severity: "success", text: "Templates sincronizados!" })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="contained" onClick={onClick}>
            {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Sincronizar Templates"}
        </Button>
    )
}

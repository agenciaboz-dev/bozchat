import React, { useState } from "react"
import { Box, Button, CircularProgress } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { api } from "../../../api"
import { useConfirmDialog } from "burgos-confirm"
import { useUser } from "../../../hooks/useUser"

interface DeleteNagazapProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap | undefined>>
    fetchNagazaps: () => Promise<void>
}

export const DeleteNagazap: React.FC<DeleteNagazapProps> = ({ nagazap, setNagazap, fetchNagazaps }) => {
    const { confirm } = useConfirmDialog()
    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    const onDeletePress = () => {
        confirm({
            title: "Deletar nagazap",
            content: "Tem certeza que deseja deletar essa instância? Essa ação é permanente. (Deletar a instância aqui não afeta sua conta no Meta)",
            onConfirm: handleDelete,
        })
    }

    const handleDelete = async () => {
        if (loading) return
        setLoading(true)

        try {
            const response = await api.delete("/nagazap", { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            await fetchNagazaps()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{}}>
            <Button variant="contained" color="error" onClick={onDeletePress}>
                {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Deletar nagazap"}
            </Button>
        </Box>
    )
}

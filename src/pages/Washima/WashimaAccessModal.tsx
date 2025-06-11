import React, { useEffect, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, Modal, TextField, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useApi } from "../../hooks/useApi"
import { useFetchedData } from "../../hooks/useFetchedData"
import { User } from "../../types/server/class/User"
import { Department } from "../../types/server/class/Department"
import { BoardAccess } from "../../types/server/class/Board/Board"
import { Title2 } from "../../components/Title"
import { Close } from "@mui/icons-material"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"

interface WashimaAccessModalProps {
    open: boolean
    onClose: () => void
    onSave: (washima: Washima) => void
    washima: Washima
}

export const WashimaAccessModal: React.FC<WashimaAccessModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    const [users, _, { loading: fetchingUser }] = useFetchedData<User>("users")
    const [departments, __, { loading: fetchingDepartments }] = useFetchedData<Department>("departments")
    const [access, setAccess] = useState<BoardAccess>({ departments: [], users: [] })
    const [loading, setLoading] = useState(false)
    const [fetchingAccess, setFetchingAccess] = useState(true)

    const handleAccessChange = (type: keyof typeof access, value: any[]) => {
        console.log({ type, value })
        setAccess((access) => {
            return { ...access, [type]: value }
        })
    }

    const fetchWashimaAccess = async () => {
        setFetchingAccess(true)
        try {
            const response = await api.get("/washima/access", { params: { user_id: user?.id, washima_id: props.washima.id } })
            setAccess(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setFetchingAccess(false)
        }
    }

    const onSaveClick = async () => {
        if (loading) return
        setLoading(true)

        try {
            const response = await api.patch('/washima/access', access, {params: {washima_id: props.washima.id, user_id: user?.id}})
            console.log(response.data)
            props.onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (props.open) fetchWashimaAccess()
    }, [props.open])

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperProps={{
                sx: {
                    maxWidth: isMobile ? "90vw" : "80vw",
                },
            }}
        >
            <Box
                sx={{
                    padding: isMobile ? "5vw" : "1vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    width: isMobile ? "90vw" : "50vw",
                    gap: "1vw",
                }}
            >
                <Title2
                    name={props.washima.name}
                    right={
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    }
                />
                {
                    (fetchingUser || fetchingDepartments || fetchingAccess) ? <Box sx={{flexDirection: 'column'}}>
                        <Typography>Carregando usuários e departamentos</Typography>
                        <LinearProgress variant="indeterminate" />
                    </Box> :
                <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                    <Autocomplete
                        fullWidth
                        options={users}
                        renderInput={(params) => <TextField {...params} label="Usuários" />}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        multiple
                        value={access.users}
                        onChange={(_, value) => handleAccessChange("users", value)}
                        ChipProps={{ size: "small", color: "primary" }}
                        disableCloseOnSelect
                    />
                    <Autocomplete
                        fullWidth
                        options={departments}
                        renderInput={(params) => <TextField {...params} label="Setores" />}
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        multiple
                        value={access.departments}
                        onChange={(_, value) => handleAccessChange("departments", value)}
                        ChipProps={{ size: "small", color: "primary" }}
                        disableCloseOnSelect
                    />
                </Box>
                }
                <Button variant="contained" sx={{ alignSelf: "flex-end" }} onClick={onSaveClick}>
                    {loading ? <CircularProgress size='1.5rem' color='secondary' /> : 'Salvar'}
                </Button>
            </Box>
        </Dialog>
    )
}

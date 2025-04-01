import React from "react"
import { Box, Button, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material"
import { NagaTemplate, Nagazap } from "../../../types/server/class/Nagazap"
import { Close } from "@mui/icons-material"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"

interface DownloadTemplateSheetProps {
    nagazap: Nagazap
    template: NagaTemplate | null
    open: boolean
    onClose: () => void
}

export const DownloadTemplateSheetModal: React.FC<DownloadTemplateSheetProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    const onDownloadClick = async (type: "csv" | "xlsx") => {
        try {
            const response = await api.post("/nagazap/template-sheet", props.template?.info, {
                params: { nagazap_id: props.nagazap.id, user_id: user?.id, file_type: type },
            })
            window.open(`${api.getUri()}/${response.data}`, "_new")
        } catch (error) {
            console.log(error)
        } finally {
            props.onClose()
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperProps={{
                sx: {
                    bgcolor: "background.default",
                    flexDirection: "column",
                    padding: isMobile ? "5vw" : "2vw",
                    gap: isMobile ? "5vw" : "2vw",
                    minWidth: isMobile ? "90%" : "25vw",
                },
            }}
        >
            <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: "bold", color: "text.secondary" }}>Selecione o formato da planilha</Typography>
                <IconButton onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Box sx={{ gap: isMobile ? "5vw" : "1vw", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={() => onDownloadClick("csv")}>
                    Csv
                </Button>
                <Button variant="contained" onClick={() => onDownloadClick("xlsx")}>
                    Excel
                </Button>
            </Box>
        </Dialog>
    )
}

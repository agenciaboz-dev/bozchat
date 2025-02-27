import React from "react"
import { Box, Dialog } from "@mui/material"
import { TemplateForm } from "../TemplateForm/TemplateForm"
import { Nagazap } from "../../../types/server/class/Nagazap"

interface TemplateModalProps {
    open: boolean
    onClose: () => void
    nagazap: Nagazap
    onSubmit: () => void
}

export const TemplateModal: React.FC<TemplateModalProps> = (props) => {
    const handleClose = () => {
        props.onClose()
    }

    return (
        <Dialog keepMounted open={props.open} onClose={handleClose} PaperProps={{ sx: { maxWidth: "90vw", width: "60vw" } }}>
            <TemplateForm nagazap={props.nagazap} onSubmit={props.onSubmit} />
        </Dialog>
    )
}

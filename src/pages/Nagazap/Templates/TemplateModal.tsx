import React from "react"
import { Box, Dialog, useMediaQuery } from "@mui/material"
import { TemplateForm } from "../TemplateForm/TemplateForm"
import { NagaTemplate, Nagazap } from "../../../types/server/class/Nagazap"

interface TemplateModalProps {
    open: boolean
    onClose: () => void
    nagazap: Nagazap
    onSubmit: () => void
    currentTemplate: NagaTemplate | null
}

export const TemplateModal: React.FC<TemplateModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const handleClose = () => {
        props.onClose()
    }

    return (
        <Dialog keepMounted open={props.open} onClose={handleClose} PaperProps={{ sx: { maxWidth: "90vw", width: isMobile ? "90vw" : "70vw" } }}>
            <TemplateForm nagazap={props.nagazap} onSubmit={props.onSubmit} currentTemplate={props.currentTemplate} onClose={handleClose} />
        </Dialog>
    )
}

import React from "react"
import { Avatar, Box, useMediaQuery } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TextHeader } from "./TextHeader"
import { CloudUpload } from "@mui/icons-material"

interface TemplateHeaderProps {
    component: TemplateComponent
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ component }) => {
    const url = component.file ? URL.createObjectURL(component.file) : undefined
    const isMobile = useMediaQuery("(orientation: portrait)")
    return component.format === "TEXT" ? (
        <TextHeader component={component} />
    ) : (
        <Avatar
            variant="rounded"
            src={url}
            sx={{
                width: "100%",
                height: url ? "auto" : isMobile ? "60vw" : "20vw",
                maxHeight: isMobile ? undefined : "20vw",
                bgcolor: "background.default",
            }}
        >
            <CloudUpload color="primary" sx={{ width: "30%", height: "auto" }} />
        </Avatar>
    )
}

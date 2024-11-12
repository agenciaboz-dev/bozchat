import React from "react"
import { Avatar, Box } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TextHeader } from "./TextHeader"
import { CloudUpload } from "@mui/icons-material"

interface TemplateHeaderProps {
    component: TemplateComponent
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ component }) => {
    const url = component.file ? URL.createObjectURL(component.file) : undefined
    return component.format === "TEXT" ? (
        <TextHeader component={component} />
    ) : (
        <Avatar variant="rounded" src={url} sx={{ width: "100%", height: url ? "auto" : "20vw", maxHeight: "20vw", bgcolor: "background.default" }}>
            <CloudUpload color="primary" sx={{ width: "30%", height: "auto" }} />
        </Avatar>
    )
}

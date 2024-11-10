import React from "react"
import { Avatar, Box } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TextHeader } from "./TextHeader"
import { CloudUpload } from "@mui/icons-material"

interface TemplateHeaderProps {
    component: TemplateComponent
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ component }) => {
    return component.format === "TEXT" ? (
        <TextHeader component={component} />
    ) : (
        <Avatar
            variant="square"
            src={component.file ? URL.createObjectURL(component.file) : undefined}
            sx={{ width: "100%", height: "auto", aspectRatio: 1, bgcolor: "background.default" }}
        >
            <CloudUpload color="primary" sx={{ width: "30%", height: "auto" }} />
        </Avatar>
    )
}

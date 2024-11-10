import React from "react"
import { Box } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TextHeader } from "./TextHeader"

interface TemplateHeaderProps {
    component: TemplateComponent
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ component }) => {
    return component.format === "TEXT" ? <TextHeader component={component} /> : null
}

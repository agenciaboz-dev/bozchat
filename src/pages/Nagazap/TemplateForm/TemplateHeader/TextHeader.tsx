import React from "react"
import { Box } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"

interface TextHeaderProps {
    component: TemplateComponent
}

export const TextHeader: React.FC<TextHeaderProps> = ({ component }) => {
    return <pre style={{ fontWeight: "bold" }}>{component.text}</pre>
}

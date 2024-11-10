import React from "react"
import { Box } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"

interface TemplateBodyProps {
    component: TemplateComponent
}

export const TemplateBody: React.FC<TemplateBodyProps> = ({ component }) => {
    return <pre style={{ whiteSpace: "break-spaces" }}>{component.text}</pre>
}

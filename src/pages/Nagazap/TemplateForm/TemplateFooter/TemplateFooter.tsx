import React from "react"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"

interface TemplateFooterProps {
    component: TemplateComponent
}

export const TemplateFooter: React.FC<TemplateFooterProps> = ({ component }) => {
    return <pre style={{ opacity: 0.5, fontSize: "0.85rem" }}>{component.text}</pre>
}

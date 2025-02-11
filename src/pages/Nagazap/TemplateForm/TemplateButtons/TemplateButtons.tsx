import React from "react"
import { Box, Button } from "@mui/material"
import { TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { OpenInNew, Phone, Reply } from "@mui/icons-material"

interface TemplateButtonsProps {
    component: TemplateComponent
}

export const TemplateButtons: React.FC<TemplateButtonsProps> = ({ component }) => {
    const icons = [
        { type: "QUICK_REPLY", icon: <Reply /> },
        { type: "URL", icon: <OpenInNew /> },
        { type: "PHONE_NUMBER", icon: <Phone /> },
    ]
    return (
        <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
            {component.buttons?.map((button, index) => (
                <Button
                    key={`${button.text}-${index}`}
                    variant="text"
                    sx={{ textTransform: "none" }}
                    startIcon={icons.find((item) => item.type === button.type)?.icon}
                    onClick={() => button.type === "URL" && window.open(button.url, "_blank")}
                >
                    {button.text}
                </Button>
            ))}
        </Box>
    )
}

import React from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"

interface TemplateFieldsProps {
    variables: string[]
    to: { telefone: string; [key: string]: string }[]
}

export const TemplateFields: React.FC<TemplateFieldsProps> = ({ variables, to }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "2vw" : "1vw" }}>
            <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>Campos:</Typography>

            <Box sx={{ flexDirection: "column", gap: isMobile ? "1vw" : "0.5vw" }}>
                {variables.map((variable) => (
                    <Typography key={variable}>
                        {variable}: {to.length > 0 ? to[0][variable] : ""}
                    </Typography>
                ))}
            </Box>
        </Box>
    )
}

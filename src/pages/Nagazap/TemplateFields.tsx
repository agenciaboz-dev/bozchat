import React from "react"
import { Box, Typography } from "@mui/material"

interface TemplateFieldsProps {
    variables: string[]
    to: { telefone: string; [key: string]: string }[]
}

export const TemplateFields: React.FC<TemplateFieldsProps> = ({ variables, to }) => {
    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <Typography sx={{ color: "secondary.main", fontWeight: "bold" }}>Campos:</Typography>

            <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
                {variables.map((variable) => (
                    <Typography key={variable}>
                        {variable}: {to.length > 0 ? to[0][variable] : ""}
                    </Typography>
                ))}
            </Box>
        </Box>
    )
}

import React from "react"
import { Box, MenuItem, TextField } from "@mui/material"
import { TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"

interface TemplateComponentFormProps {
    component: TemplateComponent
    setComponent: React.Dispatch<React.SetStateAction<TemplateComponent>>
}

export const TemplateComponentForm: React.FC<TemplateComponentFormProps> = ({ component, setComponent }) => {
    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            {component.type === "HEADER" && (
                <TextField
                    label="Tipo"
                    value={component.format!}
                    onChange={(ev) => setComponent({ ...component, format: ev.target.value as "IMAGE" | "TEXT" })}
                    select
                    SelectProps={{ MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } } }}
                >
                    <MenuItem value={"TEXT"}>Texto</MenuItem>
                    <MenuItem value={"IMAGE"}>Imagem</MenuItem>
                </TextField>
            )}

            {/* TEXTO */}
            {((component.type === "HEADER" && component.format === "TEXT") || (component.type !== "HEADER" && component.type !== "BUTTONS")) && (
                <TextField
                    maxRows={5}
                    label="Texto"
                    multiline
                    value={component.text}
                    onChange={(ev) => setComponent({ ...component, text: ev.target.value })}
                />
            )}
        </Box>
    )
}

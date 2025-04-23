import React from "react"
import { Box, Divider, IconButton, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material"
import { ButtonType, TemplateButton, TemplateComponent } from "../../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { Delete } from "@mui/icons-material"

interface ButtonFormProps {
    component: TemplateComponent
    setComponent: React.Dispatch<React.SetStateAction<TemplateComponent>>
    button: TemplateButton
    index: number
}

export const ButtonForm: React.FC<ButtonFormProps> = ({ component, button, index, setComponent }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "3vw" : "0.5vw" }}>
            {/* {!!index && <hr style={{ marginBottom: isMobile ? "2vw" : "1vw" }} />} */}
            {!!index && <Divider style={{ marginBottom: isMobile ? "2vw" : "1vw" }} />}
            <Typography sx={{ color: "text.secondary" }}>Botão {index + 1}:</Typography>
            <TextField
                label="Texto"
                required
                value={button.text}
                onChange={(ev) => {
                    const buttons = component.buttons!
                    buttons[index] = { ...buttons[index], text: ev.target.value }
                    return setComponent({ ...component, buttons })
                }}
                InputProps={{
                    endAdornment: (
                        <IconButton
                            sx={{ padding: 0 }}
                            onClick={() => {
                                const buttons = component.buttons!
                                buttons.splice(index, 1)
                                setComponent({ ...component, buttons })
                            }}
                        >
                            <Delete />
                        </IconButton>
                    ),
                }}
            />

            <TextField
                label="Tipo"
                value={button.type}
                onChange={(ev) => {
                    const buttons = component.buttons!
                    buttons[index] = { ...buttons[index], type: ev.target.value as ButtonType }
                    return setComponent({ ...component, buttons })
                }}
                select
                SelectProps={{ MenuProps: { MenuListProps: { sx: { maxHeight: "20vw", bgcolor: "background.default", overflowY: "scroll" } } } }}
            >
                <MenuItem value={"QUICK_REPLY"}>Resposta Rápida</MenuItem>
                <MenuItem value={"URL"}>URL</MenuItem>
                <MenuItem value={"PHONE_NUMBER"}>Telefone</MenuItem>
            </TextField>

            {button.type === "URL" && (
                <TextField
                    label="URL"
                    value={button.url}
                    onChange={(ev) => {
                        const buttons = component.buttons!
                        buttons[index] = { ...buttons[index], url: ev.target.value }
                        return setComponent({ ...component, buttons })
                    }}
                />
            )}

            {button.type === "PHONE_NUMBER" && (
                <TextField
                    label="Telefone"
                    value={button.phone_number}
                    onChange={(ev) => {
                        const buttons = component.buttons!
                        buttons[index] = { ...buttons[index], phone_number: ev.target.value }
                        return setComponent({ ...component, buttons })
                    }}
                />
            )}
        </Box>
    )
}

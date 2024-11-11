import React, { useCallback, useRef } from "react"
import { Box, Button, MenuItem, TextField } from "@mui/material"
import { ButtonType, TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { ButtonForm } from "./TemplateButtons/ButtonForm"

interface TemplateComponentFormProps {
    component: TemplateComponent
    setComponent: React.Dispatch<React.SetStateAction<TemplateComponent>>
}

export const TemplateComponentForm: React.FC<TemplateComponentFormProps> = ({ component, setComponent }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files
            if (files) {
                console.log(files)
                setComponent({ ...component, file: files[0] })
            }
        },
        [component]
    )

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            {component.type === "HEADER" && (
                <TextField
                    label="Tipo"
                    value={component.format!}
                    onChange={(ev) => {
                        const format = ev.target.value as "IMAGE" | "TEXT"
                        setComponent({ ...component, format, text: format === "TEXT" ? "" : undefined })
                    }}
                    select
                    SelectProps={{ MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } } }}
                >
                    <MenuItem value={"TEXT"}>Texto</MenuItem>
                    <MenuItem value={"IMAGE"}>Imagem (em desenvolvimento)</MenuItem>
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
            {/* IMAGEM */}
            {component.format === "IMAGE" && (
                <>
                    <input type="file" ref={inputRef} style={{ display: "none" }} accept={"image/*"} onChange={handleFileChange} />

                    <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                        Enviar imagem
                    </Button>
                </>
            )}

            {/* BOTOES */}
            {component.type === "BUTTONS" && (
                <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                    {component.buttons?.map((button, index) => (
                        <ButtonForm key={index} component={component} setComponent={setComponent} button={button} index={index} />
                    ))}
                    <Button
                        variant="outlined"
                        onClick={() => {
                            const buttons = component.buttons || []
                            buttons.push({ type: "QUICK_REPLY", text: "Novo botão!" })
                            setComponent({ ...component, buttons })
                        }}
                    >
                        Novo botão
                    </Button>
                </Box>
            )}
        </Box>
    )
}

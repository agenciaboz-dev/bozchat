import React, { useCallback, useRef, useState } from "react"
import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material"
import { ButtonType, TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { ButtonForm } from "./TemplateButtons/ButtonForm"
import { Clear } from "@mui/icons-material"

interface TemplateComponentFormProps {
    component: TemplateComponent
    setComponent: React.Dispatch<React.SetStateAction<TemplateComponent>>
}

export const TemplateComponentForm: React.FC<TemplateComponentFormProps> = ({ component, setComponent }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [imageError, setImageError] = useState("")

    const clearImage = () => {
        setImageError("")
        setComponent({ ...component, file: undefined })
    }

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setImageError("")
            const files = Array.from(event.target.files as FileList)
            if (files?.length > 0) {
                const file = files[0]
                if (file.size / 1024 / 1024 > 5) {
                    setImageError("Arquivo muito grande, máximo de 5 MB")
                    setComponent({ ...component, file: undefined })
                    return
                }
                setComponent({ ...component, file })
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
            {/* IMAGEM */}
            {component.format === "IMAGE" && (
                <Box sx={{ gap: "1vw", alignItems: "center" }}>
                    <input type="file" ref={inputRef} style={{ display: "none" }} accept={"image/jpeg,image/png"} onChange={handleFileChange} />
                    <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                        Escolher imagem
                    </Button>

                    <Box sx={{ color: imageError ? "error.main" : "secondary.main" }}>
                        {imageError || (component.file ? component.file.name : "Envie um arquivo de no máximo 5 MB, extensão .png ou .jpeg")}
                    </Box>
                    {component.file && (
                        <IconButton onClick={clearImage} sx={{ padding: 0 }}>
                            <Clear />
                        </IconButton>
                    )}
                </Box>
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

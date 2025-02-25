import React, { useEffect, useRef, useState } from "react"
import { Box, Chip, IconButton, TextField } from "@mui/material"
import { Title2 } from "../../../components/Title"
import { Add, AddCircle, PlusOne } from "@mui/icons-material"
import { meta_normalize } from "../../../tools/normalize"
import { TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"

interface TemplateVariablesProps {
    variables: string[]
    setVariables: React.Dispatch<React.SetStateAction<string[]>>
    component: TemplateComponent
    setComponent: React.Dispatch<React.SetStateAction<TemplateComponent>>
    title: string
}

export const TemplateVariables: React.FC<TemplateVariablesProps> = ({ variables, setVariables, component, setComponent, title }) => {
    const [newVariableValue, setNewVariableValue] = useState("")
    const [variableExample, setVariableExample] = useState("")

    const param_type = component.type === "HEADER" ? "header_text_named_params" : "body_text_named_params"

    const onAddVariable = (variable: string, example: string) => {
        if (!!variable && !variables.includes(variable) && !!example) {
            setVariables((list) => [...list, variable])

            const examples = component.example || { [param_type]: [] }
            examples[param_type]?.push({ param_name: variable, example })
            setComponent({ ...component, example: examples })

            setNewVariableValue("")
            setVariableExample("")
        }
    }

    const onDeleteVariable = (variable: string) => {
        setVariables((list) => list.filter((item) => item !== variable))

        if (component.example) {
            const examples = component.example
            examples[param_type] = examples[param_type]?.filter((item) => item.param_name !== variable)
            setComponent({ ...component, example: examples })
        }
    }

    const onVariableClick = (variable: string) => {
        setComponent({ ...component, text: `${component.text}{{${variable}}}` })
    }

    useEffect(() => {
        const regex = /{{(.*?)}}/g
        let match: RegExpExecArray | undefined | null

        if (component.text) {
            while ((match = regex.exec(component.text)) !== null) {
                if (match && !!match.length) {
                    if (!variables.includes(match[1])) {
                        setComponent({ ...component, text: component.text.replace(match[0], "") })
                    }
                }
            }
        }
    }, [variables, component.text])

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <Title2 name={`Variáveis do ${title}`} />

            <Box sx={{ gap: "1vw" }}>
                <TextField
                    sx={{}}
                    label="Nome"
                    placeholder="Nome da variável"
                    value={newVariableValue}
                    onChange={(ev) => setNewVariableValue(meta_normalize(ev.target.value))}
                />
                <TextField
                    sx={{}}
                    label="Exemplo"
                    placeholder="Texto de exemplo para a variável"
                    value={variableExample}
                    onChange={(ev) => setVariableExample(ev.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => onAddVariable(newVariableValue, variableExample)}>
                                <AddCircle />
                            </IconButton>
                        ),
                    }}
                />
            </Box>

            <Box sx={{ gap: "0.5vw", flexWrap: "wrap" }}>
                {variables.map((variable) => (
                    <Chip key={variable} label={variable} onDelete={() => onDeleteVariable(variable)} onClick={() => onVariableClick(variable)} />
                ))}
            </Box>
        </Box>
    )
}

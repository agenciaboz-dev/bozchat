import React, { useEffect, useRef, useState } from "react"
import { IconButton, TextField } from "@mui/material"
import { QuotedMessage } from "../pages/Washima/QuotedMessage"
import { useDarkMode } from "../hooks/useDarkMode"
import { useWashimaInput } from "../hooks/useWashimaInput"
import { textFieldStyle } from "../style/textfield"
import { ChatMediaButton } from "./ChatMediaButton"
import { FlowNodeData } from "../types/server/class/Bot/Bot"
import { Save } from "@mui/icons-material"

interface ChatInputProps {
    disabled?: boolean
    inBoards?: boolean

    data?: FlowNodeData
    setData: React.Dispatch<React.SetStateAction<FlowNodeData>>
    isBot: boolean
    onSubmit: () => void
}

export const ChatInput: React.FC<ChatInputProps> = (props) => {
    const { darkMode } = useDarkMode()
    const inputHelper = useWashimaInput()
    const inputRef = useRef<HTMLInputElement>(null)

    const [textDisabled, setTextDisabled] = useState(!!props.disabled)

    useEffect(() => {
        setTextDisabled(!!props.disabled)
    }, [props.disabled])

    useEffect(() => {
        if (inputHelper.replyMessage) {
            inputRef.current?.focus()
        }
    }, [inputHelper.replyMessage])

    return (
        <form onSubmit={(ev) => ev.preventDefault()}>
            {inputHelper.replyMessage && <QuotedMessage />}
            <TextField
                inputRef={inputRef}
                placeholder="Texto da mensagem"
                label="Mensagem"
                name="props.value"
                value={props.data?.value}
                onChange={(ev) => props.setData((data) => ({ ...data, value: ev.target.value }))}
                sx={textFieldStyle({ darkMode })}
                multiline
                maxRows={4}
                autoComplete="off"
                InputProps={{
                    sx: {
                        color: "primary.main",
                        bgcolor: "background.default",
                        padding: 1,
                        paddingLeft: props.isBot ? 0 : 2,
                        paddingRight: 0,
                    },
                    startAdornment: props.isBot ? <ChatMediaButton nodeData={props.data} setNodeData={props.setData} /> : null,
                    endAdornment: (
                        <IconButton sx={{ marginRight: 1 }} onClick={props.onSubmit} disabled={props.disabled}>
                            <Save />
                        </IconButton>
                    ),
                }}
            />
        </form>
    )
}

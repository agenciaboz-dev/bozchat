import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, CircularProgress, IconButton, TextField } from "@mui/material"
import { QuotedMessage } from "../pages/Washima/QuotedMessage"
import { useDarkMode } from "../hooks/useDarkMode"
import { useWashimaInput } from "../hooks/useWashimaInput"
import { WashimaMediaForm } from "../types/server/class/Washima/Washima"
import { textFieldStyle } from "../style/textfield"
import { Reply, Send } from "@mui/icons-material"
import { RecordAudioContainer } from "../pages/Washima/AudioComponents/RecordAudioContainer"
import { MediaInputMenu } from "../pages/Washima/MediaInput/MediaInputMenu"
import { ChatMediaButton } from "./ChatMediaButton"
import { file2base64 } from "../tools/toBase64"

interface ChatInputProps {
    disabled?: boolean
    is_forwarding?: boolean
    forwarding_length?: number
    inBoards?: boolean

    loading?: boolean
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
    onForwardPress?: () => void
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>

}

export const ChatInput: React.FC<ChatInputProps> = (props) => {
    const { darkMode } = useDarkMode()
    const inputHelper = useWashimaInput()
    const inputRef = useRef<HTMLInputElement>(null)

    const [textDisabled, setTextDisabled] = useState(!!props.disabled)
    const [currentFile, setCurrentFile] = useState<File | null>(null)

    const media = useMemo(
       () => currentFile ? ({
            mimetype: currentFile.type,
            file: currentFile,
            name: currentFile.name,
            size: currentFile.size,
        }) : undefined,
        [currentFile]
    )

    const onRecordStart = () => {
        setTextDisabled(true)
        props.setValue("")
    }

    const onRecordCancel = () => {
        setTextDisabled(false)
    }

    const handleSubmit = () => {
        props.setLoading?.(true)
        if (props.value) {
            const text = props.value
            // props.onSubmit(text, media as WashimaMediaForm)
            props.setValue("")
            inputHelper.setReplyMessage(null)
        }
    }

    const sendAudio = (audio: WashimaMediaForm) => {
        props.setLoading?.(true)
        // props.onSubmit(undefined, audio)
    }

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
                placeholder="Envie uma mensagem"
                name="props.value"
                value={
                    props.is_forwarding && !!props.forwarding_length
                        ? `${props.forwarding_length} ${props.forwarding_length > 1 ? "mensagens selecionadas" : "mensagem selecionada"}`
                        : props.value
                }
                disabled={textDisabled}
                onChange={(ev) => props.setValue(ev.target.value)}
                sx={textFieldStyle({ darkMode })}
                autoComplete="off"
                InputProps={{
                    readOnly: props.is_forwarding,
                    sx: { color: "primary.main", bgcolor: "background.default", paddingLeft: "0", paddingRight: "0" },
                    // startAdornment: (
                    //     <Checkbox title="assinar mensagem" checked={sign} onChange={(_, checked) => handleSignCheckbox(checked)} />
                    // ),
                    startAdornment: props.is_forwarding ? undefined : <ChatMediaButton currentFile={currentFile} setCurrentFile={setCurrentFile} />,
                    // endAdornment: props.loading ? (
                    //     <CircularProgress sx={{ marginRight: "0.5vw" }} />
                    // ) : (
                    //     <Box sx={{ marginRight: "0.5vw" }}>
                    //         {props.is_forwarding ? (
                    //             <IconButton color="primary" onClick={() => props.onForwardPress?.()}>
                    //                 <Reply sx={{ transform: "scaleX(-1)" }} />
                    //             </IconButton>
                    //         ) : props.value ? (
                    //             <IconButton color="primary" type="submit" onClick={handleSubmit} disabled={props.disabled}>
                    //                 <Send />
                    //             </IconButton>
                    //         ) : (
                    //             <RecordAudioContainer
                    //                 onSend={sendAudio}
                    //                 onRecordFinish={onRecordCancel}
                    //                 onRecordStart={onRecordStart}
                    //                 inBoards={props.inBoards}
                    //             />
                    //         )}
                    //     </Box>
                    // ),
                }}
            />
        </form>
    )
}

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, CircularProgress, IconButton, TextField } from "@mui/material"
import { textFieldStyle } from "../../style/textfield"
import SendIcon from "@mui/icons-material/Send"
import { RecordAudioContainer } from "./AudioComponents/RecordAudioContainer"
import { Washima, WashimaMediaForm } from "../../types/server/class/Washima/Washima"
import { useIo } from "../../hooks/useIo"
import { MediaInputMenu } from "./MediaInput/MediaInputMenu"
import { useLocalStorage } from "@mantine/hooks"
import { useWashimaInput } from "../../hooks/useWashimaInput"
import { Delete, Reply } from "@mui/icons-material"
import { QuotedMessage } from "./QuotedMessage"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { useDarkMode } from "../../hooks/useDarkMode"

interface WashimaInputProps {
    onSubmit: (message?: string, media?: WashimaMediaForm) => void
    disabled?: boolean
    washima: Washima
    chat_id: string
    selectedMessages: WashimaMessage[]
    onForwardPress: () => void
    onDeleteMessages: () => void
    inBoards?: boolean
}

export const WashimaInput: React.FC<WashimaInputProps> = ({
    onSubmit,
    disabled,
    washima,
    chat_id,
    selectedMessages,
    onForwardPress,
    inBoards,
    onDeleteMessages,
}) => {
    const { darkMode } = useDarkMode()
    const io = useIo()
    const inputHelper = useWashimaInput()
    const inputRef = useRef<HTMLInputElement>(null)

    const [signature] = useLocalStorage({ key: "washima:sign", defaultValue: "" })
    const [message, setMessage] = useState("")
    const [textDisabled, setTextDisabled] = useState(disabled)
    const [loading, setLoading] = useState(false)

    const is_forwarding = useMemo(() => selectedMessages.length > 0, [selectedMessages])

    const onRecordStart = () => {
        setTextDisabled(true)
        setMessage("")
    }

    const onRecordCancel = () => {
        setTextDisabled(false)
    }

    const handleSubmit = () => {
        // setLoading(true)
        if (message) {
            console.log(signature)
            const text = signature ? `*${signature}*\n${message}` : message
            onSubmit(text)
            setMessage("")
            inputHelper.setReplyMessage(null)
        }
    }

    const sendAudio = (audio: WashimaMediaForm) => {
        setLoading(true)
        onSubmit(undefined, audio)
    }

    useEffect(() => {
        setTextDisabled(disabled)
    }, [disabled])

    useEffect(() => {
        if (inputHelper.replyMessage) {
            inputRef.current?.focus()
        }
    }, [inputHelper.replyMessage])

    // useEffect(() => {
    //     setTextDisabled(is_forwarding)
    // }, [is_forwarding])

    useEffect(() => {
        io.on("washima:message:sent", () => {
            setLoading(false)
        })

        return () => {
            io.off("washima:message:sent")
        }
    }, [])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            if (message) {
                handleSubmit()
            }
        }
    }

    return (
        <form onSubmit={(ev) => ev.preventDefault()}>
            {inputHelper.replyMessage && <QuotedMessage />}
            <TextField
                inputRef={inputRef}
                placeholder="Envie uma mensagem"
                name="message"
                value={
                    is_forwarding
                        ? `${selectedMessages.length} ${selectedMessages.length > 1 ? "mensagens selecionadas" : "mensagem selecionada"}`
                        : message
                }
                disabled={textDisabled}
                onChange={(ev) => setMessage(ev.target.value)}
                sx={textFieldStyle({ darkMode })}
                autoComplete="off"
                multiline
                minRows={1}
                maxRows={5}
                onKeyDown={handleKeyDown}
                InputProps={{
                    readOnly: is_forwarding,
                    sx: { color: "primary.main", bgcolor: darkMode ? "background.default" : "background.paper", padding: "0.25vw 0" },
                    // startAdornment: (
                    //     <Checkbox title="assinar mensagem" checked={sign} onChange={(_, checked) => handleSignCheckbox(checked)} />
                    // ),
                    startAdornment: is_forwarding ? undefined : <MediaInputMenu washima={washima} chat_id={chat_id} />,
                    endAdornment: loading ? (
                        <CircularProgress size="1.5rem" sx={{ marginRight: "0.5vw" }} />
                    ) : (
                        <Box sx={{ marginRight: "0.5vw" }}>
                            {is_forwarding ? (
                                inputHelper.deleting ? (
                                    <IconButton color="primary" onClick={onDeleteMessages}>
                                        <Delete />
                                    </IconButton>
                                ) : (
                                    <IconButton color="primary" onClick={onForwardPress}>
                                        <Reply sx={{ transform: "scaleX(-1)" }} />
                                    </IconButton>
                                )
                            ) : message ? (
                                <IconButton color="primary" type="submit" onClick={handleSubmit} disabled={disabled}>
                                    <SendIcon />
                                </IconButton>
                            ) : (
                                <RecordAudioContainer
                                    onSend={sendAudio}
                                    onRecordFinish={onRecordCancel}
                                    onRecordStart={onRecordStart}
                                    inBoards={inBoards}
                                />
                            )}
                        </Box>
                    ),
                }}
            />
        </form>
    )
}

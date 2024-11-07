import React, { useEffect, useState } from "react"
import { Box, CircularProgress, IconButton, TextField } from "@mui/material"
import { textFieldStyle } from "../../style/textfield"
import SendIcon from "@mui/icons-material/Send"
import { RecordAudioContainer } from "./AudioComponents/RecordAudioContainer"
import { Washima, WashimaMediaForm } from "../../types/server/class/Washima/Washima"
import { useIo } from "../../hooks/useIo"
import { MediaInputMenu } from "./MediaInput/MediaInputMenu"

interface WashimaInputProps {
    onSubmit: (message?: string, media?: WashimaMediaForm) => void
    disabled?: boolean
    washima: Washima
    chat_id: string
}

export const WashimaInput: React.FC<WashimaInputProps> = ({ onSubmit, disabled, washima, chat_id }) => {
    const io = useIo()

    const [message, setMessage] = useState("")
    const [textDisabled, setTextDisabled] = useState(disabled)
    const [loading, setLoading] = useState(false)

    const onRecordStart = () => {
        setTextDisabled(true)
        setMessage("")
    }

    const onRecordCancel = () => {
        setTextDisabled(false)
    }

    const handleSubmit = () => {
        setLoading(true)
        if (message) {
            onSubmit(message)
            setMessage("")
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
        io.on("washima:message:sent", () => {
            setLoading(false)
        })

        return () => {
            io.off("washima:message:sent")
        }
    }, [])

    return (
        <form onSubmit={(ev) => ev.preventDefault()}>
            <TextField
                placeholder="Envie uma mensagem"
                name="message"
                value={message}
                disabled={textDisabled}
                onChange={(ev) => setMessage(ev.target.value)}
                sx={textFieldStyle}
                autoComplete="off"
                InputProps={{
                    sx: { color: "primary.main", bgcolor: "background.default", paddingLeft: "0", paddingRight: "0" },
                    // startAdornment: (
                    //     <Checkbox title="assinar mensagem" checked={sign} onChange={(_, checked) => handleSignCheckbox(checked)} />
                    // ),
                    startAdornment: <MediaInputMenu washima={washima} chat_id={chat_id} />,
                    endAdornment: loading ? (
                        <CircularProgress size="1.5rem" sx={{ marginRight: "0.5vw" }} />
                    ) : (
                        <Box sx={{ marginRight: "0.5vw" }}>
                            {message ? (
                                <IconButton color="primary" type="submit" onClick={handleSubmit} disabled={disabled}>
                                    <SendIcon />
                                </IconButton>
                            ) : (
                                <RecordAudioContainer onSend={sendAudio} onRecordFinish={onRecordCancel} onRecordStart={onRecordStart} />
                            )}
                        </Box>
                    ),
                }}
            />
        </form>
    )
}

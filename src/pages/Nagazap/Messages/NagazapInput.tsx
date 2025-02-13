import React, { useMemo, useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { NagaChat } from "../../../types/NagaChat"
import { Nagazap, NagazapResponseForm } from "../../../types/server/class/Nagazap"
import { useIo } from "../../../hooks/useIo"
import { textFieldStyle } from "../../../style/textfield"
import { Send } from "@mui/icons-material"

interface NagazapInputProps {
    chat: NagaChat
    nagazap: Nagazap
}

export const NagazapInput: React.FC<NagazapInputProps> = ({ chat, nagazap }) => {
    const io = useIo()

    const can_respond = useMemo(() => {
        const now = new Date()
        console.log(now.getTime())
        const last_message = chat.messages.find((message) => message.name !== nagazap.displayPhone)
        console.log(last_message)
        if (!last_message) return false
        const message_time = Number(last_message.timestamp)

        const difference = now.getTime() - message_time

        console.log(difference)

        return difference <= 24 * 60 * 60 * 1000
    }, [chat])

    const [text, setText] = useState("")

    const handleSubmit = () => {
        if (!text || !can_respond) return

        const data: NagazapResponseForm = {
            number: chat.from,
            text,
        }
        io.emit("nagazap:response", nagazap.id, data)

        setText("")
    }

    return (
        <form onSubmit={(ev) => ev.preventDefault()}>
            <TextField
                placeholder={
                    can_respond ? "Envie uma mensagem" : "Você pode responder usuários que tenham iniciado uma conversa nas últimas 24 horas"
                }
                name="message"
                value={text}
                disabled={!can_respond}
                onChange={(ev) => setText(ev.target.value)}
                sx={{
                    ...textFieldStyle,
                    input: !can_respond
                        ? {
                              "&::placeholder": {
                                  // <----- Add this.
                                  opacity: 1,
                                  // "-webkit-text-fill-color": "white",
                              },
                          }
                        : {},
                }}
                autoComplete="off"
                InputLabelProps={{ sx: { color: "green" } }}
                InputProps={{
                    sx: {
                        color: "primary.main",
                        bgcolor: "background.default",
                        paddingLeft: "0",
                        paddingRight: "0",
                    },
                    endAdornment: (
                        <Box sx={{ marginRight: "0.5vw" }}>
                            <IconButton color="primary" type="submit" onClick={handleSubmit} disabled={!can_respond}>
                                <Send />
                            </IconButton>
                        </Box>
                    ),
                }}
            />
        </form>
    )
}

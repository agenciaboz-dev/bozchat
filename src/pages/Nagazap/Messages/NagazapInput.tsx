import React, { useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { NagaChat, Nagazap, NagazapResponseForm } from "../../../types/server/class/Nagazap"
import { useIo } from "../../../hooks/useIo"
import { Send } from "@mui/icons-material"
import { textFieldStyle } from "../../../style/textfield"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface NagazapInputProps {
    chat: NagaChat
    nagazap: Nagazap
}

export const NagazapInput: React.FC<NagazapInputProps> = ({ chat, nagazap }) => {
    const { darkMode } = useDarkMode()
    const io = useIo()

    const [text, setText] = useState("")

    const handleSubmit = () => {
        if (!text) return

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
                placeholder={"Envie uma mensagem"}
                name="message"
                value={text}
                onChange={(ev) => setText(ev.target.value)}
                sx={textFieldStyle({ darkMode })}
                autoComplete="off"
                InputLabelProps={{ sx: { color: "green" } }}
                InputProps={{
                    sx: {
                        color: "primary.main",
                        bgcolor: darkMode ? "background.default" : "background.paper",
                        paddingLeft: "0",
                        paddingRight: "0",
                    },
                    endAdornment: (
                        <Box sx={{ marginRight: "0.5vw" }}>
                            <IconButton color="primary" type="submit" onClick={handleSubmit}>
                                <Send />
                            </IconButton>
                        </Box>
                    ),
                }}
            />
        </form>
    )
}

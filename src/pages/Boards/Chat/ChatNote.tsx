import React, { useState } from "react"
import { Box, IconButton, Paper, TextField, Typography, useMediaQuery, Button } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { custom_colors } from "../../../style/colors"

export interface Note {
    id: string // ID único para cada anotação
    text: string
    date: string // Data em formato ISO
    replies: NoteReply[]
    userName: string
}
export interface NoteReply {
    text: string
    date: string // Data em formato ISO
    userName: string
}

interface ChatNoteProps {
    note: Note
    onRemove: () => void
    onAddReply: (noteId: string, replyText: string) => void
}

export const ChatNote: React.FC<ChatNoteProps> = ({ note, onRemove, onAddReply }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const [replyText, setReplyText] = useState("")

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear()

        return `${hours}:${minutes} • ${day}/${month}/${year}`
    }

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onAddReply(note.id, replyText)
            setReplyText("")
        }
    }

    return (
        <Paper
            sx={{
                padding: isMobile ? "5vw" : "1vw",
                flexDirection: "column",
                gap: isMobile ? "5vw" : "1vw",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? "5vw" : "1vw",
                }}
            >
                {/* Cabeçalho da anotação */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: "text.secondary",
                        }}
                    >
                        {note.userName} • {formatDate(note.date)}
                    </Typography>
                    <IconButton size="small" onClick={onRemove} color="error">
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>

                {/* Conteúdo da anotação */}
                <Box
                    sx={{
                        borderRadius: "4px",
                        padding: isMobile ? "0 0 2vw" : "0 0 0.5vw",
                        width: "100%",
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {note.text}
                    </Typography>
                </Box>

                {/* Respostas existentes */}
                {note.replies.length > 0 && (
                    <Box
                        sx={{
                            marginLeft: "2vw",
                            borderLeft: "2px solid",
                            borderColor: "divider",
                            paddingLeft: "2vw",
                            flexDirection: "column",
                            gap: isMobile ? "5vw" : "1vw",
                        }}
                    >
                        {note.replies.map((reply, index) => (
                            <Box key={index} sx={{ flexDirection: "column", gap: "0.5vw", marginBottom: "1vw" }}>
                                <Typography
                                    sx={{
                                        fontSize: "0.7rem",
                                        color: "text.secondary",
                                    }}
                                >
                                    {reply.userName} • {formatDate(reply.date)}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {reply.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Campo para nova resposta */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? "5vw" : "1vw",
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Escreva uma resposta"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        multiline
                        minRows={1}
                        maxRows={4}
                        sx={{
                            "& .MuiInputBase-input": {
                                color: "text.secondary",
                            },
                        }}
                    />
                    <Button variant="contained" size="small" onClick={handleReplySubmit} sx={{ alignSelf: "flex-end" }} disabled={!replyText.trim()}>
                        Responder
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
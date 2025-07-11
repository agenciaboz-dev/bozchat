import React, { useState } from "react"
import { Box, IconButton, Paper, TextField, Typography, useMediaQuery, Button } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { custom_colors } from "../../../style/colors"

export interface NoteReply {
    text: string
    date: string // Data em formato ISO
}

export interface Note {
    id: string // ID único para cada anotação
    text: string
    date: string // Data em formato ISO
    replies: NoteReply[]
}

interface ChatNoteProps {
    note: Note
    onRemove: () => void
    onAddReply: (noteId: string, replyText: string) => void
}

export const ChatNote: React.FC<ChatNoteProps> = ({ note, onRemove, onAddReply }) => {
    const isMobile = useMediaQuery('(orientation: portrait)')
    const { darkMode } = useDarkMode()
    const [replyText, setReplyText] = useState("")

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onAddReply(note.id, replyText)
            setReplyText("")
        }
    }

    return (
        <Paper sx={{
            border: darkMode ? undefined : `1px solid ${custom_colors.lightMode_border}`,
            boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
            padding: isMobile ? "5vw" : "1vw",
            flexDirection: "column",
            gap: isMobile ? "5vw" : "1vw",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2vw",
        }}>
            <Box sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1vw",
            }}>
                {/* Cabeçalho da anotação */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <Typography sx={{
                        fontSize: "0.8rem",
                        color: "text.secondary",
                    }}>
                        {formatDate(note.date)}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={onRemove}
                        color="error"
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>

                {/* Conteúdo da anotação */}
                <Box sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "4px",
                    padding: isMobile ? "5vw" : "1vw",
                    width: "100%",
                }}>
                    <Typography sx={{
                        color: "text.secondary",
                        whiteSpace: "pre-wrap",
                    }}>{note.text}</Typography>
                </Box>

                {/* Respostas existentes */}
                {note.replies.length > 0 && (
                    <Box sx={{
                        marginLeft: "2vw",
                        borderLeft: "2px solid",
                        borderColor: "divider",
                        paddingLeft: "2vw",
                        flexDirection: "column",
                        gap: "1vw",
                    }}>
                        {note.replies.map((reply, index) => (
                            <Box key={index} sx={{ flexDirection: "column", gap: "0.5vw", marginBottom: "1vw" }}>
                                <Typography sx={{
                                    fontSize: "0.7rem",
                                    color: "text.secondary",
                                }}>
                                    {formatDate(reply.date)}
                                </Typography>
                                <Typography sx={{
                                    color: "text.secondary",
                                    whiteSpace: "pre-wrap",
                                }}>{reply.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Campo para nova resposta */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1vw",
                    marginTop: "1vw",
                }}>
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
                                color: "text.secondary"
                            }
                        }}
                    />
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleReplySubmit}
                        sx={{ alignSelf: "flex-end" }}
                        disabled={!replyText.trim()}
                    >
                        Responder
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
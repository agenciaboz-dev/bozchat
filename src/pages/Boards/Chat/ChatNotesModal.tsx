import React, { useState, useEffect } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, TextField, Typography, useMediaQuery } from "@mui/material"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { ChatNote, Note, NoteReply } from "./ChatNote" // Importe os tipos também

interface ChatNotesModalProps {
    open: boolean
    onClose: () => void
    onSubmit: () => void
}

export const ChatNotesModal: React.FC<ChatNotesModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { snackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [savedNotes, setSavedNotes] = useState<Note[]>([])

    // Carrega anotações salvas do Local Storage quando o modal abre
    useEffect(() => {
        if (props.open) {
            const storedNotes = localStorage.getItem("chat_notes")
            if (storedNotes) {
                setSavedNotes(JSON.parse(storedNotes))
            }
        }
    }, [props.open])

    const onSubmitPress = async () => {
        if (loading || !text.trim()) return

        setLoading(true)
        try {
            // Cria uma nova anotação com ID único
            const newNote: Note = {
                id: Date.now().toString(), // Usa timestamp como ID
                text: text.trim(),
                date: new Date().toISOString(), // Data em formato ISO
                replies: [] // Inicia sem respostas
            }
            
            const newNotes = [...savedNotes, newNote]
            setSavedNotes(newNotes)
            localStorage.setItem("chat_notes", JSON.stringify(newNotes))
            setText("")
            snackbar({ severity: "success", text: "Anotação salva (localmente)" })
        } catch (error) {
            console.log(error)
            snackbar({ severity: "error", text: "Erro ao salvar anotação" })
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveNote = (id: string) => {
        const newNotes = savedNotes.filter(note => note.id !== id)
        setSavedNotes(newNotes)
        localStorage.setItem("chat_notes", JSON.stringify(newNotes))
        snackbar({ severity: "info", text: "Anotação removida" })
    }

    const handleAddReply = (noteId: string, replyText: string) => {
        const newNotes = [...savedNotes]
        const noteIndex = newNotes.findIndex(note => note.id === noteId)
        
        if (noteIndex !== -1) {
            const newReply: NoteReply = {
                text: replyText.trim(),
                date: new Date().toISOString() // Data atual em formato ISO
            }
            
            newNotes[noteIndex].replies.push(newReply)
            setSavedNotes(newNotes)
            localStorage.setItem("chat_notes", JSON.stringify(newNotes))
            snackbar({ severity: "success", text: "Resposta adicionada!" })
        }
    }

    const handleClose = () => {
        props.onClose()
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    maxHeight: "90vh",
                    minWidth: isMobile ? "90vw" : "75vw",
                    width: isMobile ? "90vw" : "75vw",
                },
            }}
            >
            <Box sx={{
                padding: isMobile ? "5vw" : "2vw",
                bgcolor: "background.default",
                flexDirection: "column",
                gap: isMobile ? "5vw" : "1vw",
            }}>
                <Box sx={{ flexDirection: "column" }}>
                    <Title2
                        name={"Anotações da conversa"}
                        right={
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton>
                        }
                    />
                </Box>
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Escreva uma nova anotação para esta conversa"
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "text.secondary"
                        }
                    }}
                />
                <Button
                    sx={{ alignSelf: "flex-end" }}
                    variant="contained"
                    onClick={onSubmitPress}
                    disabled={!text.trim()}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "secondary.main" }} /> : "Salvar"}
                </Button>
                {/* Seção de anotações salvas */}
                {savedNotes.length > 0 && (
                    <Box sx={{
                        borderTop: "1px solid",
                        borderColor: "divider",
                        paddingTop: isMobile ? "5vw" : "1vw",
                        maxHeight: "50vh",
                        overflowY: "auto",
                        flexDirection: "column",
                    }}>
                        {savedNotes.map((note) => (
                            <ChatNote
                                key={note.id}
                                note={note}
                                onRemove={() => handleRemoveNote(note.id)}
                                onAddReply={handleAddReply}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Dialog>
    )
}
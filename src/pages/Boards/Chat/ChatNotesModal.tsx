import React, { useState, useEffect } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { ChatNote, Note, NoteReply } from "./ChatNote"
import { custom_colors } from "../../../style/colors"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { useUser } from "../../../hooks/useUser"
import { api } from "../../../api"

interface ChatNotesModalProps {
    open: boolean
    onClose: () => void
    board_id: string
    chat_id: string
}

export const ChatNotesModal: React.FC<ChatNotesModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [savedNotes, setSavedNotes] = useState<Note[]>([])

    // Carrega anotações salvas do Local Storage quando o modal abre
    useEffect(() => {
        if (props.open) {
            const storedNotes = localStorage.getItem("chat_notes")
            if (storedNotes) {
                const parsedNotes: Note[] = JSON.parse(storedNotes)

                const updatedNotes = parsedNotes.map((note) => ({
                    ...note,
                    userName: note.userName || "Usuário desconhecido",
                    replies: note.replies.map((reply) => ({
                        ...reply,
                        userName: reply.userName || "Usuário desconhecido",
                    })),
                }))

                setSavedNotes(updatedNotes)
            }
        }
    }, [props.open])

    const onSubmitPress = async () => {
        if (loading || !text.trim()) return

        setLoading(true)
        try {
            // Cria uma nova anotação com ID único
            const newNote: Note = {
                id: Date.now().toString(),
                text: text.trim(),
                date: new Date().toISOString(),
                replies: [],
                userName: user?.name || "Usuário desconhecido",
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
        const newNotes = savedNotes.filter((note) => note.id !== id)
        setSavedNotes(newNotes)
        localStorage.setItem("chat_notes", JSON.stringify(newNotes))
        snackbar({ severity: "info", text: "Anotação removida" })
    }

    const handleAddReply = (noteId: string, replyText: string) => {
        const newNotes = [...savedNotes]
        const noteIndex = newNotes.findIndex((note) => note.id === noteId)

        if (noteIndex !== -1) {
            const newReply: NoteReply = {
                text: replyText.trim(),
                date: new Date().toISOString(),
                userName: user?.name || "Usuário desconhecido",
            }

            newNotes[noteIndex].replies.push(newReply)
            setSavedNotes(newNotes)
            localStorage.setItem("chat_notes", JSON.stringify(newNotes))
            snackbar({ severity: "success", text: "Resposta adicionada!" })
        }
    }

    // const fetchNotes = async () => {
    //     setLoading(true)
    //     try {
    //         const params = {
    //             user_id: user?.id,
    //             company_id: user?.company_id,
    //             board_id: props.board_id,
    //             chat_id: props.chat_id,
    //         }

    //         const response = await api.get("/board/comments", { params })
    //         setSavedNotes(response.data)
    //     } catch (error) {
    //         console.error("Erro ao carregar anotações:", error)
    //         snackbar({ severity: "error", text: "Erro ao carregar anotações" })
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     if (props.open) {
    //         fetchNotes()
    //     }
    // }, [props.open])

    // const onSubmitPress = async () => {
    //     if (loading || !text.trim()) return
    //     setLoading(true)
    //     try {
    //         const params = {
    //             user_id: user?.id,
    //             company_id: user?.company_id,
    //             board_id: props.board_id,
    //             chat_id: props.chat_id,
    //         }

    //         const body = {
    //             author_id: user?.id || "",
    //             text: text.trim(),
    //             image: "",
    //             parent_id: "",
    //         }

    //         const response = await api.post("/board/comment", body, { params })
    //         const newNote = response.data

    //         setSavedNotes([...savedNotes, newNote])
    //         setText("")
    //         snackbar({ severity: "success", text: "Anotação salva" })
    //     } catch (error) {
    //         console.log(error)
    //         snackbar({ severity: "error", text: "Erro ao salvar anotação" })
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // const handleAddReply = async (note_id: string, reply_text: string) => {
    //     try {
    //         const params = {
    //             user_id: user?.id,
    //             company_id: user?.company_id,
    //             board_id: props.board_id,
    //             chat_id: props.chat_id,
    //         }

    //         const body = {
    //             author_id: user?.id || "",
    //             text: reply_text.trim(),
    //             image: "",
    //             parent_id: note_id,
    //         }

    //         const response = await api.post("/board/comment", body, { params })
    //         const newReply = response.data

    //         const updatedNotes = savedNotes.map((note) => {
    //             if (note.id === note_id) {
    //                 return {
    //                     ...note,
    //                     replies: [...note.replies, newReply],
    //                 }
    //             }
    //             return note
    //         })

    //         setSavedNotes(updatedNotes)
    //         snackbar({ severity: "success", text: "Resposta adicionada!" })
    //     } catch (error) {
    //         console.error("Erro ao adicionar resposta: ", error)
    //         snackbar({ severity: "error", text: "Erro ao adicionar resposta" })
    //     }
    // }

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
            <Box
                sx={{
                    padding: isMobile ? "5vw" : "2vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    gap: isMobile ? "5vw" : "1vw",
                }}
            >
                <Title2
                    name={"Anotações da conversa"}
                    right={
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    }
                />
                <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Escreva uma nova anotação para esta conversa"
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{
                        "& .MuiInputBase-input": {
                            color: "text.secondary",
                        },
                        marginTop: isMobile ? "-5vw" : undefined,
                    }}
                />
                <Button sx={{ alignSelf: "flex-end" }} variant="contained" onClick={onSubmitPress} disabled={!text.trim()}>
                    {loading ? <CircularProgress size={24} sx={{ color: "secondary.main" }} /> : "Salvar"}
                </Button>
                {/* Seção de anotações salvas */}
                {savedNotes.length > 0 && (
                    <Box
                        sx={{
                            boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                            borderRadius: "4px",
                            border: "1px solid",
                            borderColor: "divider",
                            maxHeight: "45vh",
                            overflowY: "auto",
                            flexDirection: "column",
                            padding: isMobile ? "5vw 0" : "1vw",
                            gap: isMobile ? "5vw" : "1vw",
                            backgroundColor: darkMode ? custom_colors.darkMode_scrollablesBackground : custom_colors.lightMode_scrollablesBackground,
                        }}
                    >
                        {savedNotes.map((note) => (
                            <ChatNote key={note.id} note={note} onRemove={() => handleRemoveNote(note.id)} onAddReply={handleAddReply} />
                        ))}
                    </Box>
                )}
            </Box>
        </Dialog>
    )
}
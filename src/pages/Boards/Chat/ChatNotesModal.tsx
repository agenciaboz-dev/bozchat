import React, { useState, useEffect } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, TextField, useMediaQuery } from "@mui/material"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { ChatNote } from "./ChatNote"
import { custom_colors } from "../../../style/colors"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { useUser } from "../../../hooks/useUser"
import { api } from "../../../api"
import { Comment } from "../../../types/server/class/Board/Chat"

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
    const [loadedNotes, setLoadedNotes] = useState<Comment[]>([])

    useEffect(() => {
        if (props.open) {
            fetchNotes()
        }
    }, [props.open])

    const fetchNotes = async () => {
        setLoading(true)
        try {
            const params = {
                user_id: user?.id,
                company_id: user?.company_id,
                board_id: props.board_id,
                chat_id: props.chat_id,
            }

            const response = await api.get<Comment[]>("/company/boards/comments", { params })
            setLoadedNotes(response.data)

            console.log("fetched notes: ", response.data)
        } catch (error) {
            console.error("Erro ao carregar anotações:", error)
            snackbar({ severity: "error", text: "Erro ao carregar anotações" })
        } finally {
            setLoading(false)
        }
    }

    const handleAddNote = async () => {
        if (loading || !text.trim()) return
        setLoading(true)
        try {
            const params = {
                user_id: user?.id,
                company_id: user?.company_id,
                board_id: props.board_id,
                chat_id: props.chat_id,
            }

            const body = {
                author_id: user?.id || "",
                text: text.trim(),
                image: "",
                parent_id: "",
            }

            const response = await api.post("/company/boards/comment", body, { params })
            const newNote = response.data as Comment

            setLoadedNotes([...loadedNotes, newNote])

            console.log("handleAddNote post params: ", params)
            console.log("handleAddNote post body: ", body)

            setText("")
            snackbar({ severity: "success", text: "Anotação salva" })
        } catch (error) {
            console.log(error)
            snackbar({ severity: "error", text: "Erro ao salvar anotação" })
        } finally {
            setLoading(false)
        }
    }

    const handleAddReply = async (note_id: string, reply_text: string) => {
        try {
            const params = {
                user_id: user?.id,
                company_id: user?.company_id,
                board_id: props.board_id,
                chat_id: props.chat_id,
            }

            const body = {
                author_id: user?.id || "",
                text: reply_text.trim(),
                image: "",
                parent_id: note_id,
            }

            const response = await api.post("/company/boards/comment", body, { params })
            const newReply = response.data

            const updatedNotes = loadedNotes.map((note) => {
                if (note.id === note_id) {
                    return {
                        ...note,
                        replies: [...note.replies, newReply],
                    }
                }
                return note
            })

            setLoadedNotes(updatedNotes)

            console.log("handleAddReply post params: ", params)
            console.log("handleAddReply post body: ", body)

            snackbar({ severity: "success", text: "Resposta adicionada!" })
        } catch (error) {
            console.error("Erro ao adicionar resposta: ", error)
            snackbar({ severity: "error", text: "Erro ao adicionar resposta" })
        }
    }

        const handleDeleteNoteOrReply = async (id: string, parent_id: string | null = null) => {
            try {
                const params = {
                    user_id: user?.id,
                    company_id: user?.company_id,
                    board_id: props.board_id,
                    chat_id: props.chat_id,
                }

                const body = {
                    id,
                    parent_id: parent_id || null,
                }

                await api.delete("/company/boards/comment", {
                    data: body,
                    params,
                })

                if (parent_id) {
                    setLoadedNotes((prevNotes) =>
                        prevNotes.map((note) => {
                            if (note.id === parent_id) {
                                return {
                                    ...note,
                                    replies: note.replies.filter((reply) => reply.id !== id),
                                }
                            }
                            return note
                        })
                    )
                } else {
                    setLoadedNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
                }

                snackbar({ severity: "info", text: parent_id ? "Resposta removida" : "Anotação removida" })
            } catch (error) {
                console.error("Erro ao tentar remover anotação de chat: ", error)
                snackbar({ severity: "error", text: "Erro ao tentar remover" })
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
                <Button sx={{ alignSelf: "flex-end" }} variant="contained" onClick={handleAddNote} disabled={!text.trim()}>
                    {loading ? <CircularProgress size={24} sx={{ color: "secondary.main" }} /> : "Salvar"}
                </Button>

                {loadedNotes.length > 0 && (
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
                        {loadedNotes.map((note) => (
                            <ChatNote
                                key={note.id}
                                note={note}
                                onDelete={() => handleDeleteNoteOrReply(note.id)}
                                onAddReply={handleAddReply}
                                onDeleteReply={(replyId) => handleDeleteNoteOrReply(replyId, note.id)}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Dialog>
    )
}
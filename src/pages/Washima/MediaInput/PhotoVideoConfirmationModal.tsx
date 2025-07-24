import React, { useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, Dialog, Divider, IconButton, TextField, useMediaQuery } from "@mui/material"
import { Close } from "@mui/icons-material"
import SendIcon from "@mui/icons-material/Send"
import { MediaListItem } from "./MediaListItem"
import { Washima, WashimaMediaForm } from "../../../types/server/class/Washima/Washima"
import { file2base64 } from "../../../tools/toBase64"
import { useIo } from "../../../hooks/useIo"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { textFieldStyle } from "../../../style/textfield"

interface PhotoVideoConfirmationModalProps {
    files: File[]
    onCancel: () => void
    isOpen: boolean
    washima: Washima
    chat_id: string
    onDelete: (index: number) => void
}

export const PhotoVideoConfirmationModal: React.FC<PhotoVideoConfirmationModalProps> = ({ files, onCancel, isOpen, washima, chat_id, onDelete }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const io = useIo()

    const [currentFile, setCurrentFile] = useState(files ? files[0] : null)
    const [currentFileIndex, setCurrentFileIndex] = useState(0)
    const [caption, setCaption] = useState("")
    const [loading, setLoading] = useState(-1)

    const type = useMemo(() => currentFile?.type.split("/")[0], [currentFile])
    const url = useMemo(() => (currentFile ? URL.createObjectURL(currentFile) : ""), [currentFile])

    const onSubmit = async () => {
        if (loading > 0) return
        setLoading(1)

        const medias: WashimaMediaForm[] = await Promise.all(
            files.map(async (file) => {
                const base64 = await file2base64(file)
                const data: WashimaMediaForm = { base64, mimetype: file.type, name: file.name, size: file.size }
                return data
            })
        )

        setLoading(medias.length)

        if (medias.length === 1) {
            io.emit("washima:message", washima.id, chat_id, caption, medias[0])
            setCaption("")
            return
        }

        medias.forEach((media) => {
            io.emit("washima:message", washima.id, chat_id, undefined, media)
        })

        if (caption) {
            io.emit("washima:message", washima.id, chat_id, caption)
            setCaption("")
        }
    }

    useEffect(() => {
        setCurrentFileIndex(0)
        console.log(files)
    }, [files])

    useEffect(() => {
        setCurrentFile(files[currentFileIndex])
    }, [currentFileIndex, files])

    useEffect(() => {
        console.log(currentFile)
    }, [currentFile])

    useEffect(() => {
        if (loading === 0) {
            onCancel()
            setLoading(-1)
        }
    }, [loading])

    useEffect(() => {
        io.on("washima:message:sent", () => {
            setLoading((value) => value - 1)
        })

        return () => {
            io.off("washima:message:sent")
        }
    }, [])

    return !!files.length ? (
        <Dialog
            open={isOpen}
            onClose={loading > 0 ? undefined : onCancel}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? "4px" : "1vw",
                    maxWidth: isMobile ? "90vw" : "60vw",
                },
            }}
        >
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault() // Impede recarregamento indesejado da página
                    onSubmit()
                }}
                sx={{
                    padding: isMobile ? "5vw" : "1vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    gap: isMobile ? "5vw" : "1vw",
                }}
            >
                <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "text.secondary" }}>Enviar fotos e vídeos</Box>
                <IconButton
                    sx={{ position: "absolute", top: isMobile ? "2vw" : "1vw", right: isMobile ? "2vw" : "1vw" }}
                    onClick={onCancel}
                    disabled={loading > 0}
                >
                    <Close />
                </IconButton>
                {type === "image" && <img src={url} style={{ width: "auto", height: "50vh", objectFit: "contain" }} draggable={false} />}
                {type === "video" && <video src={url} style={{ width: "auto", height: "50vh", objectFit: "contain" }} controls />}
                <Divider />
                <Box sx={{ justifyContent: "center", width: isMobile ? "80vw" : "55vw", gap: isMobile ? "2vw" : "0.5vw", overflow: "auto" }}>
                    {files.map((file, index) => (
                        <MediaListItem
                            key={file.name}
                            file={file}
                            is_current={index === currentFileIndex}
                            onClick={() => setCurrentFileIndex(index)}
                            onDelete={() => (loading > 0 ? undefined : onDelete(index))}
                        />
                    ))}
                </Box>
                <TextField
                    label="Legenda"
                    placeholder="Insira uma legenda"
                    value={caption}
                    onChange={(ev) => setCaption(ev.target.value)}
                    sx={textFieldStyle({ darkMode })}
                    autoComplete="off"
                    multiline
                    maxRows={3}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault() // Impede quebra de linha (evento padrão da tecla Enter), para isso deve segurar a tecla Shift
                            if (loading <= 0) {
                                onSubmit()
                            }
                        }
                    }}
                    InputProps={{
                        sx: { color: "primary.main", bgcolor: "background.default", paddingRight: "0" },
                        endAdornment: (
                            <Box sx={{ marginRight: isMobile ? "2vw" : "0.5vw" }}>
                                <IconButton color="primary" type="submit" onClick={() => onSubmit()} disabled={loading > 0}>
                                    {loading > 0 ? <CircularProgress size="1.5rem" color="primary" /> : <SendIcon />}
                                </IconButton>
                            </Box>
                        ),
                    }}
                />
            </Box>
        </Dialog>
    ) : null
}

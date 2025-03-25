import React, { useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, Dialog, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material"
import { Close } from "@mui/icons-material"
import SendIcon from "@mui/icons-material/Send"
import { MediaListItem } from "./MediaListItem"
import { Washima, WashimaMediaForm } from "../../../types/server/class/Washima/Washima"
import { file2base64 } from "../../../tools/toBase64"
import { useIo } from "../../../hooks/useIo"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface PhotoVideoConfirmationModalProps {
    files: File[]
    onCancel: () => void
    isOpen: boolean
    washima: Washima
    chat_id: string
    onDelete: (index: number) => void
}

export const PhotoVideoConfirmationModal: React.FC<PhotoVideoConfirmationModalProps> = ({ files, onCancel, isOpen, washima, chat_id, onDelete }) => {
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
            files.map(async (file, index) => {
                const base64 = await file2base64(file)
                const data: WashimaMediaForm = { base64, mimetype: file.type, name: file.name, size: file.size }
                return data
            })
        )

        setLoading(medias.length)

        if (medias.length === 1) {
            io.emit("washima:message", washima.id, chat_id, caption, medias[0])
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
                sx: { padding: "1vw", borderRadius: "1vw", bgcolor: "background.default", flexDirection: "column", gap: "1vw", maxWidth: "60vw" },
            }}
        >
            <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "secondary.main" }}>Enviar fotos e vídeos</Box>
            <IconButton sx={{ position: "absolute", top: "1vw", right: "1vw" }} onClick={onCancel} disabled={loading > 0}>
                <Close />
            </IconButton>

            {type === "image" && <img src={url} style={{ width: "auto", height: "60vh", objectFit: "contain" }} draggable={false} />}
            {type === "video" && <video src={url} style={{ width: "auto", height: "60vh", objectFit: "contain" }} controls />}

            <Box sx={{ justifyContent: "center", width: "55vw", gap: "0.5vw", overflow: "auto" }}>
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
                // sx={textFieldStyle({ darkMode })}
                autoComplete="off"
                InputProps={{
                    sx: { color: "primary.main", bgcolor: "background.default", paddingLeft: "0", paddingRight: "0" },
                    endAdornment: (
                        <Box sx={{ marginRight: "0.5vw" }}>
                            <IconButton color="primary" type="submit" onClick={() => onSubmit()}>
                                {loading > 0 ? <CircularProgress size="1.5rem" /> : <SendIcon />}
                            </IconButton>
                        </Box>
                    ),
                }}
            />
        </Dialog>
    ) : null
}

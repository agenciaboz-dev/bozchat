import React, { useCallback, useMemo, useRef, useState } from "react"
import { Box, Dialog, IconButton } from "@mui/material"
import { Close, Photo } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"

interface ChatMediaButtonProps {
    currentFile: File | null
    setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>
}

const isMkv = (file: File) => {
    const splited = file.name.split(".")
    return splited[splited.length - 1].toLowerCase() === "mkv"
}

export const ChatMediaButton: React.FC<ChatMediaButtonProps> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { snackbar } = useSnackbar()

    const [showingMediaChooser, setShowingMediaChooser] = useState(false)
    const type = useMemo(() => props.currentFile?.type.split("/")[0], [props.currentFile])
    const url = useMemo(() => (props.currentFile ? URL.createObjectURL(props.currentFile) : ""), [props.currentFile])

    const resetMediaChooser = () => {
        props.setCurrentFile(null)
    }

    const closeMediaModal = () => {
        resetMediaChooser()
        setShowingMediaChooser(false)
    }

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files) {
            const files_array = Array.from(files)
            if (files_array.find((item) => isMkv(item))) {
                return
            }

            if (files_array.length > 0) {
                props.setCurrentFile(files_array[0])
            }
        }
    }, [])

    return (
        <Box sx={{ marginLeft: "0.5vw" }}>
            <IconButton color="primary" onClick={() => setShowingMediaChooser(true)}>
                <Photo />
            </IconButton>
            <input type="file" ref={inputRef} style={{ display: "none" }} accept={"image/*, video/*"} onChange={handleFileChange} />

            <Dialog
                open={showingMediaChooser}
                onClose={closeMediaModal}
                PaperProps={{
                    sx: { padding: "1vw", borderRadius: "1vw", bgcolor: "background.default", flexDirection: "column", gap: "1vw", maxWidth: "60vw" },
                }}
            >
                <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "secondary.main" }}>Enviar fotos e vídeos</Box>
                <IconButton sx={{ position: "absolute", top: "1vw", right: "1vw" }} onClick={closeMediaModal}>
                    <Close />
                </IconButton>

                {type === "image" && <img src={url} style={{ width: "auto", height: "60vh", objectFit: "contain" }} draggable={false} />}
                {type === "video" && <video src={url} style={{ width: "auto", height: "60vh", objectFit: "contain" }} controls />}
            </Dialog>
        </Box>
    )
}

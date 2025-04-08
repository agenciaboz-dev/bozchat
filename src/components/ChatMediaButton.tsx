import React, { useCallback, useMemo, useRef, useState } from "react"
import { Box, Dialog, IconButton } from "@mui/material"
import { Close, Photo } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { FlowNodeData } from "../types/server/class/Bot/Bot"
import { file2base64 } from "../tools/toBase64"

interface ChatMediaButtonProps {
    nodeData?: FlowNodeData
    setNodeData: React.Dispatch<React.SetStateAction<FlowNodeData>>
}

const isMkv = (file: File) => {
    const splited = file.name.split(".")
    return splited[splited.length - 1].toLowerCase() === "mkv"
}

export const ChatMediaButton: React.FC<ChatMediaButtonProps> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { snackbar } = useSnackbar()

    const [currentFile, setCurrentFile] = useState<File | null>(null)

    const [showingMediaChooser, setShowingMediaChooser] = useState(false)
    const type = useMemo(() => currentFile?.type.split("/")[0], [currentFile])
    const url = useMemo(() => (currentFile ? URL.createObjectURL(currentFile) : ""), [currentFile])

    const resetMediaChooser = () => {
        setCurrentFile(null)
    }

    const closeMediaModal = () => {
        resetMediaChooser()
        setShowingMediaChooser(false)
    }

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files) {
            const files_array = Array.from(files)
            if (files_array.find((item) => isMkv(item))) {
                return
            }

            if (files_array.length > 0) {
                const currentFile = files_array[0]
                setCurrentFile(currentFile)
                const base64 = await file2base64(currentFile)
                props.setNodeData((data) => ({
                    ...data,
                    media: {
                        mimetype: currentFile.type,
                        type: currentFile?.type.split("/")[0] as "image" | "video",
                        url: URL.createObjectURL(currentFile),
                        name: currentFile.name,
                        base64: base64,
                    },
                }))
            }
        }
    }, [])

    return (
        <Box sx={{ marginLeft: "0.5vw" }}>
            <IconButton onClick={() => inputRef.current?.click()}>
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

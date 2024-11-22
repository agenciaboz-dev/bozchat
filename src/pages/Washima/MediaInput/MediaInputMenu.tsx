import React, { useCallback, useEffect, useRef, useState } from "react"
import { Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Add, Description, Photo } from "@mui/icons-material"
import { PhotoVideoConfirmationModal } from "./PhotoVideoConfirmationModal"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { DocumentConfirmationModal } from "./DocumentConfirmationModal"
import { useSnackbar } from "burgos-snackbar"
import { CameraDialog } from "./camera/CameraDialog"

interface MediaInputMenuProps {
    washima: Washima
    chat_id: string
}

export const MediaInputMenu: React.FC<MediaInputMenuProps> = ({ washima, chat_id }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const is_menu_open = Boolean(anchorEl)

    const { snackbar } = useSnackbar()

    const [showCam, setShowCam] = useState(false)
    const [acceptedMimetypes, setAcceptedMimetypes] = React.useState("")
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const [mediaType, setMediaType] = React.useState<"image-video" | "document" | "">("")

    const media_input_list = [
        {
            label: "Fotos e vídeos",
            icon: <Photo />,
            onClick: () => {
                openFilesChooser("image/*, video/*")
                setMediaType("image-video")
            },
        },
        {
            label: "Documentos",
            icon: <Description />,
            onClick: () => {
                openFilesChooser("*")
                setMediaType("document")
            },
        },
        {
            label: "Câmera",
            icon: <Photo />,
            onClick: () => {
                setShowCam(true)
            },
        },
    ]

    const openFilesChooser = (mimetype: string) => {
        setAcceptedMimetypes(mimetype)
        handleCloseMenu()
    }

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        const isMkv = (file: File) => {
            const splited = file.name.split(".")
            return splited[splited.length - 1].toLowerCase() === "mkv"
        }

        if (files) {
            const files_array = Array.from(files)
            if (files_array.find((item) => isMkv(item))) snackbar({ severity: "warning", text: "arquivo .mkv não é suportado" })

            setSelectedFiles(files_array.filter((item) => !isMkv(item)))
        }
    }, [])

    const resetMediaChooser = () => {
        setAcceptedMimetypes("")
        setMediaType("")
        setSelectedFiles([])
    }

    const onDeleteFile = (index: number) => {
        if (selectedFiles.length === 1) {
            resetMediaChooser()
            return
        }
        setSelectedFiles((files) => files.filter((_, item_index) => item_index !== index))
    }

    useEffect(() => {
        if (acceptedMimetypes) {
            inputRef.current?.click()
            setTimeout(() => setAcceptedMimetypes(""), 500)
        }
    }, [acceptedMimetypes])

    return (
        <Box sx={{ marginLeft: "0.5vw" }}>
            <IconButton color="primary" onClick={handleOpenMenu}>
                <Add />
            </IconButton>
            <input type="file" ref={inputRef} style={{ display: "none" }} accept={acceptedMimetypes} multiple onChange={handleFileChange} />

            <Menu
                open={is_menu_open}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                // anchorPosition={{ top: -10, left: 0 }}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
            >
                {media_input_list.map((item) => (
                    <MenuItem key={item.label} sx={{ gap: "0.5vw" }} onClick={item.onClick}>
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>

            <PhotoVideoConfirmationModal
                isOpen={mediaType === "image-video"}
                files={selectedFiles}
                onCancel={() => resetMediaChooser()}
                washima={washima}
                chat_id={chat_id}
                onDelete={onDeleteFile}
            />

            <DocumentConfirmationModal
                isOpen={mediaType === "document"}
                files={selectedFiles}
                onCancel={() => resetMediaChooser()}
                washima={washima}
                chat_id={chat_id}
                onDelete={onDeleteFile}
            />
            <CameraDialog
                showCam={showCam}
                onClose={() => {
                    setShowCam(false)
                }}
                washima={washima}
                chat_id={chat_id}
            />
        </Box>
    )
}

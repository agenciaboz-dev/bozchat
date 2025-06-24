import React, { useCallback, useEffect, useRef } from "react"
import { Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Add, Description, Photo } from "@mui/icons-material"
import { PhotoVideoConfirmationModal } from "./PhotoVideoConfirmationModal"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { DocumentConfirmationModal } from "./DocumentConfirmationModal"
import { useSnackbar } from "burgos-snackbar"

interface MediaInputMenuProps {
    washima: Washima
    chat_id: string
}

const isMkv = (file: File) => {
    const splited = file.name.split(".")
    return splited[splited.length - 1].toLowerCase() === "mkv"
}

export const MediaInputMenu: React.FC<MediaInputMenuProps> = ({ washima, chat_id }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const is_menu_open = Boolean(anchorEl)

    const { snackbar } = useSnackbar()

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

    const handlePaste = useCallback((event: ClipboardEvent) => {
        const items = event.clipboardData?.items
        if (items) {
            const files = Array.from(items)
                .filter((item) => item.type.indexOf("image") >= 0)
                .map((item) => item.getAsFile())
                .filter((file): file is File => file !== null)

            if (files.length > 0) {
                setSelectedFiles(files.filter((item) => !isMkv(item)))
                setMediaType("image-video")
            }
        }
    }, [])

    useEffect(() => {
        if (acceptedMimetypes) {
            inputRef.current?.click()
            setTimeout(() => setAcceptedMimetypes(""), 500)
        }
    }, [acceptedMimetypes])

    useEffect(() => {
        document.addEventListener("paste", handlePaste)

        return () => {
            document.removeEventListener("paste", handlePaste)
        }
    }, [handlePaste])

    return (
        <Box>
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
        </Box>
    )
}

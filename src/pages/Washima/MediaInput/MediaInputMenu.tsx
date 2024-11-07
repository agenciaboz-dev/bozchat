import React, { useCallback, useEffect, useRef } from "react"
import { Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Add, Description, Photo } from "@mui/icons-material"
import { PhotoVideoConfirmationModal } from "./PhotoVideoConfirmationModal"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { DocumentConfirmationModal } from "./DocumentConfirmationModal"

interface MediaInputMenuProps {
    washima: Washima
    chat_id: string
}

export const MediaInputMenu: React.FC<MediaInputMenuProps> = ({ washima, chat_id }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const is_menu_open = Boolean(anchorEl)

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
            setSelectedFiles(Array.from(files))
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

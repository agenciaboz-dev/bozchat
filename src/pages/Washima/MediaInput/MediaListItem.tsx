import React from "react"
import { Avatar, Box, IconButton, MenuItem, Paper } from "@mui/material"
import { Cancel, Close } from "@mui/icons-material"
import { documentIcon } from "../../../tools/documentIcon"

interface MediaListItemProps {
    file: File
    onClick: () => void
    is_current?: boolean
    onDelete: () => void
}

export const MediaListItem: React.FC<MediaListItemProps> = ({ file, is_current, onClick, onDelete }) => {
    const type = file.type.split("/")[0]
    const documentType = file.name.split(".").pop()
    const url = file ? URL.createObjectURL(file) : ""
    console.log(type)
    return (
        <MenuItem sx={{ padding: 0, width: "fit-content", position: "relative" }} onClick={onClick}>
            {type === "image" && <img src={url} style={{ width: "auto", height: "10vh", objectFit: "contain" }} draggable={false} />}
            {type === "video" && <video src={url} style={{ width: "auto", height: "10vh", objectFit: "contain" }} />}
            {type !== "image" && type !== "video" && documentType && (
                <Avatar
                    sx={{
                        width: "auto",
                        height: "10vh",
                        objectFit: "contain",
                        borderRadius: 0,
                    }}
                    alt="icone"
                    imgProps={{ draggable: false }}
                    src={documentIcon(documentType)}
                />
            )}
            <IconButton
                sx={{ position: "absolute", right: "0.1vw", top: "0.1vw", borderRadius: "100%", padding: 0 }}
                color="warning"
                onClick={onDelete}
            >
                <Cancel />
            </IconButton>
        </MenuItem>
    )
}

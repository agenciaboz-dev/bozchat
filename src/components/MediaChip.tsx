import React, { useEffect, useState } from "react"
import { Box, Chip } from "@mui/material"
import { AttachFile, Headphones, PhotoCamera, Videocam } from "@mui/icons-material"

interface MediaChipProps {
    mimetype: string
}

export const MediaChip: React.FC<MediaChipProps> = ({ mimetype }) => {
    const [formattedMediaType, setFormattedMediaType] = useState("")
    const [MediaIcon, setMediaIcon] = useState<React.ReactElement | null>(null)

    const formatMediaType = (mimetype: string) => {
        const icon_style = { width: "1vw", height: "1vw" }
        const values = {
            image: { label: "Imagem", icon: <PhotoCamera sx={icon_style} /> },
            video: { label: "Vídeo", icon: <Videocam sx={icon_style} /> },
            audio: { label: "Áudio", icon: <Headphones sx={icon_style} /> },
        }
        const type = mimetype.split("/")[0]

        const match = Object.entries(values).find(([key, value]) => key === type)
        if (match) {
            setFormattedMediaType(match[1].label)
            setMediaIcon(match[1].icon)
            return
        } else {
            setFormattedMediaType("mídia")
            setMediaIcon(<AttachFile sx={icon_style} />)
        }
    }

    useEffect(() => {
        formatMediaType(mimetype)
    }, [mimetype])

    return (
        <Chip
            sx={{
                // marginLeft: chat.lastMessage?.body ? "1vw" : undefined,
                padding: "0.2vw",
                height: "auto",
                color: "inherit",
                "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                },
            }}
            label={formattedMediaType || `Mídia`}
            color="default"
            // @ts-ignore
            icon={MediaIcon}
        />
    )
}

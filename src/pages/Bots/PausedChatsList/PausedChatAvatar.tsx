import React, { useEffect, useState } from "react"
import { Avatar, Box, Skeleton } from "@mui/material"
import { api } from "../../../api"

interface PausedChatAvatarProps {
    chat_id: string
}

export const PausedChatAvatar: React.FC<PausedChatAvatarProps> = (props) => {
    const [source, setSource] = useState<string|null>(null)


    const fetchProfilePic = async () => {
        try {
            const response = await api.get('/company/bots/contact-picture', {params: {chat_id: props.chat_id}})
            setSource(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProfilePic()
    }, [])

    return source === null ? <Skeleton variant="circular" animation='wave' height={30} width={30} /> : (
        <Avatar src={source || undefined} sx={{ width: 1, height: 30, bgcolor: "background.default", color: "primary.main" }}>
            {/* <BrokenImage sx={{ width: 1, height: 1 }} /> */}
        </Avatar>
    )
}

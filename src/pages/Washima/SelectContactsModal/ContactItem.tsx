import React, { useState } from "react"
import { Avatar, Box, Checkbox, MenuItem, Skeleton, Typography } from "@mui/material"
import { Chat } from "../../../types/Chat"
import { useVisibleCallback } from "burgos-use-visible-callback"
import { api } from "../../../api"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"

interface ContactItemProps {
    chat: Chat
    selected: boolean
    selectContact: (sid: string) => void
    washima: Washima
}

const profile_pic_size = "3vw"

export const ContactItem: React.FC<ContactItemProps> = ({ chat, selected, selectContact, washima }) => {
    const ref = useVisibleCallback(() => {
        fetchProfilePic()
    }, {})

    const [profilePic, setProfilePic] = useState<string | null>(null)

    const fetchProfilePic = async () => {
        try {
            const response = await api.get("/washima/profile-pic", { params: { washima_id: washima.id, chat_id: chat.id._serialized } })
            const data = response.data as WashimaProfilePic
            setProfilePic(data.url)
        } catch (error) {
            console.log(error)
            setProfilePic("")
        }
    }

    return (
        <MenuItem
            ref={ref}
            sx={{
                padding: "1vw",
                gap: "1vw",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "disabled",
                whiteSpace: "normal",
            }}
            onClick={() => selectContact(chat.id._serialized)}
        >
            <Checkbox checked={selected} />
            {profilePic === null ? (
                <Skeleton variant="circular" animation="wave" sx={{ width: profile_pic_size, height: profile_pic_size }} />
            ) : (
                <Avatar
                    src={profilePic}
                    sx={{ width: profile_pic_size, height: profile_pic_size, bgcolor: "primary.main", color: "secondary.main" }}
                />
            )}
            <Typography sx={{ color: "text.secondary" }}>{chat.name}</Typography>
        </MenuItem>
    )
}

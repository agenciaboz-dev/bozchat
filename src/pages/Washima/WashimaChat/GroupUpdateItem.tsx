import React, { useEffect, useState } from "react"
import { Box, Chip } from "@mui/material"
import { GroupUpdateType, WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { GroupWelcomeBox } from "./GroupWelcomeBox"
import { Chat } from "../../../types/Chat"
import { api } from "../../../api"

interface GroupUpdateItemProps {
    update: WashimaGroupUpdate
    washima: Washima
    chat: Chat
}

export const ChatInfoChip: React.FC<{ label?: string, no_margin?: boolean }> = ({ label, no_margin }) => {
    return (
        <Chip
            label={label}
            sx={{
                width: "fit-content",
                alignSelf: "center",
                margin: no_margin ? undefined : "2vw 0 0",
                fontSize: "0.8rem",
                padding: "1vw",
                color: "text.secondary",
            }}
        />
    )
}

export const GroupUpdateItem: React.FC<GroupUpdateItemProps> = ({ update, washima, chat }) => {
    const [profilePic, setProfilePic] = useState("")

    const labels: { [key in GroupUpdateType]?: string } = {
        picture: `${update.author} ${update.body === "set" ? "mudou" : "removeu"} a imagem do grupo`,
        description: `${update.author} alterou a descrição do grupo`,
        subject: `${update.author} alterou o nome do grupo para ${update.body}`,
        create: `${update.author} criou o grupo ${update.body}`,
    }

    const fetchProfilePic = async () => {
                if (!chat) return
        
                const params = { washima_id: washima.id, chat_id: chat.id._serialized, is_group: chat.isGroup }
                try {
                    const response = await api.get("/washima/profile-pic", { params: params })
                    const data = response.data as WashimaProfilePic
                    setProfilePic(data.url)
                } catch (error) {
                    console.log(error)
                }
    }
    
    useEffect(() => {
        fetchProfilePic()
    }, [])

    return update.type === "add" || update.type === "remove" ? (
        (JSON.parse(update.body) as string[]).map((recipient) =>
            recipient === washima.contact ? (
                <GroupWelcomeBox key={recipient} update={update} chat={chat} profilePic={profilePic} />
            ) : (
                <ChatInfoChip key={recipient} label={`${update.author} ${update.type === "add" ? "adicionou" : "removeu"} ${recipient}`} />
            )
        )
    ) : (
        <ChatInfoChip label={labels[update.type]} />
    )
}

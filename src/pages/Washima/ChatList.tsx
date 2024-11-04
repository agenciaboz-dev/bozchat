import React, { useCallback, useEffect, useState } from "react"
import { Box, Paper, Skeleton } from "@mui/material"
import { ChatContainer } from "./ChatContainer"
import { useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import normalize from "../../tools/normalize"
import unmask from "../../tools/unmask"
import { ChatSkeleton } from "../Zap/ChatSkeleton"
import { Chat } from "../../types/Chat"

interface ChatsProps {
    washima: Washima
    onChatClick: (chat: Chat) => void
    lastWashima: Washima
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    currentChat: Chat | null
}

export const Chats: React.FC<ChatsProps> = ({ onChatClick, washima, lastWashima, loading, setLoading, currentChat }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [chats, setChats] = useState(washima.chats)

    const handleSearch = useCallback(
        (value: string) => {
            const result = (washima.chats as Chat[]).filter((chat) => {
                const searched = normalize(value)

                const name = normalize(chat.name)
                const phone = unmask(normalize(chat.id.user))

                return phone.includes(searched) || name.includes(searched)
            })
            setChats(result)
        },
        [washima.chats]
    )

    useEffect(() => {
        if (washima.id !== lastWashima.id) {
            setLoading(true)
        }

        setChats(washima.chats)
    }, [washima])

    useEffect(() => {
        console.log(loading)
    }, [loading])

    useEffect(() => {
        if (chats.length) {
            setTimeout(() => setLoading(false), 1000 * 1)
        }
    }, [chats])

    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "3vw" : "0.1vw", alignItems: "center" }}>
            {!loading
                ? (chats as Chat[])
                      .sort((a, b) => b.lastMessage?.timestamp - a.lastMessage?.timestamp)
                      .map((chat) => (
                          <ChatContainer
                              key={chat.id._serialized}
                              chat={chat}
                              onChatClick={onChatClick}
                              washima={washima}
                              active={currentChat?.id._serialized === chat.id._serialized}
                          />
                      ))
                : new Array(20).fill(0).map((_, index) => <ChatSkeleton key={index} />)}
        </Box>
    )
}

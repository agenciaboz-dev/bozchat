import React, { useCallback, useEffect, useState } from "react"
import { Box, LinearProgress, Paper, Skeleton } from "@mui/material"
import { ChatContainer } from "./ChatContainer"
import { useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import normalize from "../../tools/normalize"
import unmask from "../../tools/unmask"
import { ChatSkeleton } from "../Zap/ChatSkeleton"
import { Chat } from "../../types/Chat"
import { api } from "../../api"
import { useIo } from "../../hooks/useIo"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface ChatsProps {
    washima: Washima
    onChatClick: (chat: Chat) => void
    lastWashima: Washima
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    currentChat: Chat | null
}

const TAKE = 10

export const Chats: React.FC<ChatsProps> = ({ onChatClick, washima, lastWashima, loading, setLoading, currentChat }) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [chats, setChats] = useState<Chat[]>([])
    const [fetching, setFetching] = useState(false)

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

    const addChats = (new_chats: Chat[]) =>
        setChats((chats) => [...chats.filter((item) => !new_chats.find((chat) => chat.id._serialized === item.id._serialized)), ...new_chats])

    const fetchChats = async (offset: number = 0, setAll?: boolean) => {
        if (offset) {
            setFetching(true)
        } else {
            setLoading(true)
        }

        try {
            const response = await api.get("/washima/chat", { params: { washima_id: washima.id, offset, take: TAKE } })
            const new_chats = response.data as Chat[]
            setAll ? setChats(new_chats) : addChats(new_chats)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => setFetching(false), 1000)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (washima.id !== lastWashima.id) {
            setLoading(true)
            setChats([])
        }
    }, [washima])

    useEffect(() => {
        console.log(loading)
    }, [loading])

    useEffect(() => {
        if (chats.length) {
            setTimeout(() => setLoading(false), 1000 * 1)
        } else {
            fetchChats(0, true)
        }

        io.on(`washima:${washima.id}:message`, ({ chat, message }: { chat: Chat; message: WashimaMessage }) => {
            addChats([chat])
        })

        return () => {
            io.off(`washima:${washima.id}:message`)
        }
    }, [chats])

    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "3vw" : "0.1vw", alignItems: "center" }}>
            {!loading
                ? (chats as Chat[])
                      .sort((a, b) => b.lastMessage?.timestamp - a.lastMessage?.timestamp)
                      .map((chat, index) => (
                          <ChatContainer
                              key={chat.id._serialized}
                              chat={chat}
                              onChatClick={onChatClick}
                              washima={washima}
                              active={currentChat?.id._serialized === chat.id._serialized}
                              onVisible={index === chats.length - 1 ? () => fetchChats(chats.length) : undefined}
                          />
                      ))
                : new Array(20).fill(0).map((_, index) => <ChatSkeleton key={index} />)}
            {fetching && <LinearProgress sx={{ position: "fixed", top: "10vh", left: 0, right: 0 }} />}
        </Box>
    )
}

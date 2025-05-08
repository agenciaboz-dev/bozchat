import React, { useEffect, useState } from "react"
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
    setOnSearch: React.Dispatch<React.SetStateAction<(result: Chat[]) => Promise<null>>>
    setOnStartSearch: React.Dispatch<React.SetStateAction<(searched: string) => Promise<null>>>
}

const TAKE = 10

export const ChatList: React.FC<ChatsProps> = ({
    onChatClick,
    washima,
    lastWashima,
    loading,
    setLoading,
    currentChat,
    setOnSearch,
    setOnStartSearch,
}) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [chats, setChats] = useState<Chat[]>([])
    const [fetching, setFetching] = useState(false)
    const [searchedValue, setSearchedValue] = useState("")

    const addChats = (new_chats: Chat[]) =>
        setChats((chats) => [...chats.filter((item) => !new_chats.find((chat) => chat.id._serialized === item.id._serialized)), ...new_chats])

    const fetchChats = async (offset: number = 0, setAll?: boolean) => {
        if (!!searchedValue) return

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

    const onSearch = async (result: Chat[]) => {
        setChats(result)
        setTimeout(() => {
            setFetching(false)
        }, 1000)
        return null
    }

    const onStartSearch = async (value: string) => {
        setFetching(true)
        setSearchedValue(value)

        return null
    }

    useEffect(() => {
        if (washima.id !== lastWashima.id) {
            setLoading(true)
            setChats([])
        }

        setOnSearch(() => onSearch)
        setOnStartSearch(() => onStartSearch)

        io.emit("washima:channel:join", washima.id)
        io.on(`washima:chat`, (chat: Chat) => {
            if (!searchedValue) addChats([chat])
        })

        return () => {
            io.emit("washima:channel:leave", washima.id)
            io.off(`washima:chat`)
        }
    }, [washima])

    useEffect(() => {
        if (chats.length) {
            setTimeout(() => setLoading(false), 1000 * 1)
        } else {
            if (!fetching) {
                fetchChats(0, true)
            }
        }
    }, [chats])

    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "0vw", alignItems: "center" }}>
            {!loading ? (
                !!chats.length ? (
                    chats
                        .sort((a, b) => b.lastMessage?.timestamp - a.lastMessage?.timestamp)
                        .map((chat, index) => (
                            <ChatContainer
                                key={chat.id._serialized + chat.lastMessage?.id._serialized || ""}
                                chat={chat}
                                onChatClick={onChatClick}
                                washima={washima}
                                active={currentChat?.id._serialized === chat.id._serialized}
                                onVisible={index === chats.length - 1 ? () => fetchChats(chats.length) : undefined}
                            />
                        ))
                ) : (
                    <Box sx={{ color: "text.secondary" }}>Nenhum resultado</Box>
                )
            ) : (
                new Array(20).fill(0).map((_, index) => <ChatSkeleton key={index} />)
            )}
            {fetching && <LinearProgress sx={{ position: "fixed", top: "10vh", left: 0, right: 0 }} />}
        </Box>
    )
}

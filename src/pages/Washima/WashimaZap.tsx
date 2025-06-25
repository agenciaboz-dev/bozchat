import React, { useCallback, useEffect, useRef, useState } from "react"
import { Box, debounce, IconButton, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { ChatList } from "./ChatList"
import { WashimaChat } from "./WashimaChat/WashimaChat"
import { Settings } from "@mui/icons-material"
import { Chat } from "../../types/Chat"
import { api } from "../../api"
import { WashimaSearch } from "./WashimaSearch"
import { useUser } from "../../hooks/useUser"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface WashimaZapProps {
    washima: Washima
}

export const WashimaZap: React.FC<WashimaZapProps> = ({ washima }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const chatListRef = useRef<HTMLDivElement>(null)
    const { user } = useUser()

    const [chat, setChat] = useState<Chat | null>(null)
    const [lastWashima, setLastWashima] = useState(washima)
    const [loading, setLoading] = useState(false)
    const [onSearch, setOnSearch] = useState(() => (result: Chat[]) => new Promise(() => null))
    const [onStartSearch, setOnStartSearch] = useState(() => (searched: string) => new Promise(() => null))

    const handleSearch = async (value: string) => {
        onStartSearch(value)
        console.log("searched", value)
        if (!value) {
            try {
                const response = await api.get("/washima/chat", { params: { washima_id: washima.id, take: 10 } })
                console.log(response.data)
                onSearch(response.data)
            } catch (error) {
                console.log(error)
            }
            return
        }
        try {
            const response = await api.get("/washima/search", { params: { washima_id: washima.id, search: value } })
            const chats = response.data as Chat[]
            await onSearch(chats)

            api.get("/washima/search", { params: { washima_id: washima.id, search: value, target: "messages" } }).then((response) => {
                const messages = response.data as WashimaMessage[]
                for (const message of messages) {
                    const chat = washima.chats.find((chat) => chat.id._serialized === message.chat_id)
                    if (chat) {
                        chats.push({ ...chat, lastMessage: message })
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch])

    useEffect(() => {
        if (washima.id !== lastWashima.id) {
            setChat(null)
            chatListRef.current?.scrollTo({ top: 0 })
        }

        setLastWashima(washima)
    }, [washima])

    return (
        <Box sx={{ flex: 1 }}>
            <Box
                ref={chatListRef}
                sx={{
                    flex: isMobile ? 1 : 0.5,
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "",
                    padding: isMobile ? "5vw" : "1vw",
                    height: "80vh",
                    overflowX: isMobile ? "hidden" : "auto",
                    overflowY: loading ? "hidden" : "auto",
                    gap: isMobile ? "5vw" : "1vw",
                    color: "primary.main",
                    width: isMobile ? "100vw" : undefined,
                }}
            >
                <WashimaSearch handleSearch={debouncedSearch} />

                <ChatList
                    onChatClick={(chat) => {
                        setChat(chat)
                    }}
                    washima={washima}
                    lastWashima={lastWashima}
                    loading={loading}
                    setLoading={setLoading}
                    currentChat={chat}
                    setOnSearch={setOnSearch}
                    setOnStartSearch={setOnStartSearch}
                />
            </Box>
            <WashimaChat washima={washima} chat={chat} onClose={() => setChat(null)} />
        </Box>
    )
}

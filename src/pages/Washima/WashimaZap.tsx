import React, { useCallback, useEffect, useRef, useState } from "react"
import { Box, debounce, IconButton, TextField, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { ChatList } from "./ChatList"
import { WashimaChat } from "./WashimaChat/WashimaChat"
import { Edit, Search, Settings } from "@mui/icons-material"
import { Chat } from "../../types/Chat"
import { textFieldStyle } from "../../style/textfield"
import { useFormik } from "formik"
import { api } from "../../api"
import { WashimaSearch } from "./WashimaSearch"

interface WashimaZapProps {
    washima: Washima
    onEdit: () => void
}

export const WashimaZap: React.FC<WashimaZapProps> = ({ washima, onEdit }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const chatListRef = useRef<HTMLDivElement>(null)

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
            onSearch(chats)
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
            {!isMobile || (isMobile && !chat) ? (
                <Box
                    ref={chatListRef}
                    sx={{
                        flex: isMobile ? 1 : 0.5,
                        flexDirection: "column",
                        alignItems: isMobile ? "center" : "",
                        padding: "2vw",
                        height: !isMobile ? "90vh" : "72vh",
                        overflowX: isMobile ? "hidden" : "auto",
                        overflowY: loading ? "hidden" : "auto",
                        gap: "1vw",
                        color: "primary.main",
                        "::-webkit-scrollbar-thumb": {
                            backgroundColor: "primary.main",
                        },
                        width: isMobile ? "100vw" : undefined,
                    }}
                >
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <p
                            style={{
                                fontSize: isMobile ? "6vw" : "",
                                fontWeight: "bold",
                                textAlign: isMobile ? "center" : "initial",
                            }}
                        >
                            {washima.info.pushname}
                        </p>

                        <IconButton onClick={() => onEdit()} sx={{ padding: 0 }}>
                            <Settings />
                        </IconButton>
                    </Box>

                    <WashimaSearch handleSearch={debouncedSearch} />

                    <ChatList
                        onChatClick={(chat) => setChat(chat)}
                        washima={washima}
                        lastWashima={lastWashima}
                        loading={loading}
                        setLoading={setLoading}
                        currentChat={chat}
                        setOnSearch={setOnSearch}
                        setOnStartSearch={setOnStartSearch}
                    />
                </Box>
            ) : null}
            {!isMobile ? (
                <WashimaChat washima={washima} chat={chat} onClose={() => setChat(null)} />
            ) : (
                chat && <WashimaChat washima={washima} chat={chat} onClose={() => setChat(null)} />
            )}
        </Box>
    )
}

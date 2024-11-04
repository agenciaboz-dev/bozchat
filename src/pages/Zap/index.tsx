import React, { useEffect, useState } from "react"
import { Box, Skeleton } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header"
import { useZap } from "../../hooks/useZap"
import { QrCode } from "./QrCode"
import { Chats } from "../Washima/ChatList"
import { ChatsSkeletons } from "./ChatsSkeletons"
import { ZapDrawer } from "../../components/ZapDrawer"
import { useSearch } from "../../hooks/useSearch"
import { useMediaQuery } from "@mui/material"
import normalize from "../../tools/normalize"
import { useUser } from "../../hooks/useUser"

interface ZapProps {
    user: User
}

export const Zap: React.FC<ZapProps> = ({ user }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const { client, qrcode, loading, setCurrentChat, currentChat } = useZap()
    const { isAdmin } = useUser()
    const { setOnSearch } = useSearch()

    const [chats, setChats] = useState<Chat[]>([])

    const handleSearch = (value: string) => {
        if (client) {
            const result = client.chats.filter((chat) => normalize(chat.name).includes(value))
            setChats(result)
        }
    }

    const handleChatClick = (chat: Chat) => {
        setCurrentChat(chat)
        console.log(chat)
    }

    useEffect(() => {
        if (client?.chats) {
            setChats(client.chats)
            setOnSearch(() => handleSearch, "conversas")
        }
    }, [client?.chats])

    return (
        <Box sx={backgroundStyle}>
            <Header user={user} />
            {isAdmin() ? (
                client?.connected ? (
                    <Box
                        sx={{
                            flexDirection: "column",
                            alignItems: isMobile ? "center" : "",
                            padding: "2vw",
                            height: "90vh",
                            overflowX: isMobile ? "hidden" : "auto",
                            overflowY: "auto",
                            gap: "1vw",
                            color: "primary.main",
                            "::-webkit-scrollbar-thumb": {
                                backgroundColor: "primary.main",
                            },
                        }}
                    >
                        <p
                            style={{
                                fontSize: isMobile ? "6vw" : "",
                                fontWeight: "bold",
                                textAlign: isMobile ? "center" : "initial",
                                padding: isMobile ? "8vw 4vw 4vw 4vw" : "",
                            }}
                        >
                            {client.info.pushname}
                        </p>
                        {loading ? <ChatsSkeletons /> : <Chats chats={chats} onChatClick={handleChatClick} />}
                        <ZapDrawer />
                    </Box>
                ) : (
                    <QrCode qrcode={qrcode} />
                )
            ) : (
                <Box sx={{ color: "text.secondary", padding: "2vw" }}>curioso</Box>
            )}
        </Box>
    )
}

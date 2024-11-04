import React, { useEffect, useState } from "react"
import { Box, IconButton, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Chats } from "./ChatList"
import { WashimaChat } from "./WashimaChat/WashimaChat"
import { Edit, Settings } from "@mui/icons-material"
import { Chat } from "../../types/Chat"

interface WashimaZapProps {
    washima: Washima
    onEdit: () => void
}

export const WashimaZap: React.FC<WashimaZapProps> = ({ washima, onEdit }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [chat, setChat] = useState<Chat | null>(null)
    const [lastWashima, setLastWashima] = useState(washima)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (washima.id !== lastWashima.id) {
            setChat(null)
        }

        setLastWashima(washima)
    }, [washima])

    return (
        <Box sx={{ flex: 1 }}>
            <Box
                sx={{
                    flex: 0.5,
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "",
                    padding: "2vw",
                    height: "90vh",
                    overflowX: isMobile ? "hidden" : "auto",
                    overflowY: loading ? "hidden" : "auto",
                    gap: "1vw",
                    color: "primary.main",
                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                    },
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

                    <IconButton onClick={() => onEdit()}>
                        <Settings />
                    </IconButton>
                </Box>
                <Chats
                    onChatClick={(chat) => setChat(chat)}
                    washima={washima}
                    lastWashima={lastWashima}
                    loading={loading}
                    setLoading={setLoading}
                    currentChat={chat}
                />
            </Box>
            <WashimaChat washima={washima} chat={chat} onClose={() => setChat(null)} />
        </Box>
    )
}

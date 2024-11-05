import React, { useEffect, useState } from "react"
import { Box, Paper } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { WhatsApp } from "@mui/icons-material"
import { ToolButton } from "./ToolButton"
import { Route, Routes } from "react-router-dom"
import { Token } from "./Token"
import { Nagazap } from "../../types/server/class/Nagazap"
import { api } from "../../api"
import { Info } from "./Info"
import { MessagesScreen } from "./Messages/Messages"
import { Oven } from "./Oven/Oven"
import { MessageFormScreen } from "./MessageForm"
import { Blacklist } from "./Blacklist/Blacklist"
import { useIo } from "../../hooks/useIo"
import { Logs } from "./Logs/Logs"
import { Title } from "../../components/Title"
import { Header } from "../../components/Header"

interface NagazapProps {}

export const NagazapScreen: React.FC<NagazapProps> = ({}) => {
    const io = useIo()

    const [nagazap, setNagazap] = useState<Nagazap>()
    const [loading, setLoading] = useState(false)

    const refreshNagazap = async () => {
        setLoading(true)

        try {
            const response = await api.get("/whatsapp")
            setNagazap(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshNagazap()

        io.on("nagazap:update", (data) => setNagazap(data))

        return () => {
            io.off("nagazap:update")
        }
    }, [])

    return (
        <Box sx={{ ...backgroundStyle }}>
            <Header />
            <Box sx={{ padding: "2vw", flex: 1 }}>
                <Paper
                    sx={{
                        width: "17vw",
                        height: "100%",
                        bgcolor: "background.paper",
                        flexDirection: "column",
                        overflowY: "auto",
                        padding: "1vw 0",
                        gap: "1.5vw",
                        borderRadius: "0 0 0 2vw ",
                        color: "secondary.main",
                        overflowX: "hidden",
                        // hiding scrollbar
                        "&::-webkit-scrollbar": {
                            width: 0,
                            height: 0,
                        },
                    }}
                    elevation={5}
                >
                    <Title title="Nagazap" icon={<WhatsApp />}>
                        <ToolButton label="Informações" route="/" />
                        <ToolButton label="Mensagens" route="/messages" />
                        <ToolButton label="Enviar mensagem" route="/message_form" />
                        <ToolButton label="Forno" route="/oven" />
                        <ToolButton label="Logs" route="/logs" />
                        <ToolButton label="Lista negra" route="/blacklist" />
                        <ToolButton label="Token" route="/token" />
                    </Title>
                </Paper>
                <Box sx={{ width: "80vw" }}>
                    <Routes>
                        <Route index element={<Info />} />
                        <Route path="/token" element={<Token nagazap={nagazap} setNagazap={setNagazap} />} />
                        <Route path="/messages" element={<MessagesScreen />} />
                        <Route path="/oven" element={<Oven nagazap={nagazap} setNagazap={setNagazap} />} />
                        <Route path="/blacklist" element={<Blacklist nagazap={nagazap} setNagazap={setNagazap} />} />
                        <Route path="/logs" element={<Logs nagazap={nagazap} setNagazap={setNagazap} />} />
                        <Route path="/message_form" element={<MessageFormScreen />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    )
}

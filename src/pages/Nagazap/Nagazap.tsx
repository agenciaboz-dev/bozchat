import React, { useEffect, useState } from "react"
import { Box, MenuItem, Paper, TextField } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Add, AddCircle, Hub, WhatsApp } from "@mui/icons-material"
import { ToolButton } from "./ToolButton"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Token } from "./Token"
import { Nagazap } from "../../types/server/class/Nagazap"
import { api } from "../../api"
import { Info } from "./Info/Info"
import { MessagesScreen } from "./Messages/Messages"
import { Oven } from "./Oven/Oven"
import { MessageFormScreen } from "./MessageForm"
import { Blacklist } from "./Blacklist/Blacklist"
import { useIo } from "../../hooks/useIo"
import { Logs } from "./Logs/Logs"
import { Title } from "../../components/Title"
import { Header } from "../../components/Header"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { NagazapForm } from "./NagazapForm"

interface NagazapProps {}

export const NagazapScreen: React.FC<NagazapProps> = ({}) => {
    const io = useIo()
    const { user } = useUser()
    const navigate = useNavigate()

    const [nagazapList, setNagazapList] = useState<Nagazap[]>([])
    const [nagazap, setNagazap] = useState<Nagazap>()
    const [loading, setLoading] = useState(false)

    const fetchNagazap = async () => {
        if (!user) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { user_id: user.id } })
            setNagazapList(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onNewNagazapPress = () => {
        navigate("/nagazap/form")
        setNagazap(undefined)
    }

    const onNagazapChoose = (nagazap: Nagazap) => {
        setNagazap(nagazap)
        navigate("/nagazap/")
    }

    const onAddNagazap = (new_nagazap: Nagazap) => {
        setNagazapList((list) => [...list, new_nagazap])
        setNagazap(new_nagazap)
    }

    useEffect(() => {
        fetchNagazap()

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
                    <Title title="Nagazap" icon={<Hub />}>
                        <Box sx={{ flexDirection: "column", gap: "2vw" }}>
                            <Box sx={{ padding: "0 2vw" }}>
                                <TextField
                                    sx={textFieldStyle}
                                    select
                                    value={nagazap?.id || ""}
                                    label="Selecione uma conta"
                                    SelectProps={{ MenuProps: { MenuListProps: { sx: { bgcolor: "background.default" } } } }}
                                >
                                    <MenuItem sx={{ fontWeight: "bold", gap: "1vw" }} onClick={onNewNagazapPress}>
                                        <AddCircle />
                                        Adicionar conta
                                    </MenuItem>
                                    {nagazapList.map((item) => (
                                        <MenuItem key={item.id} value={item.id} onClick={() => onNagazapChoose(item)}>
                                            {item.displayPhone} - {item.displayName}
                                        </MenuItem>
                                    ))}
                                    {!nagazapList.length && <MenuItem disabled>Nenhuma conta encontrada</MenuItem>}
                                </TextField>
                            </Box>
                            {nagazap && (
                                <Box sx={{ flexDirection: "column" }}>
                                    <ToolButton label="Informações" route="/" />
                                    <ToolButton label="Mensagens" route="/messages" />
                                    <ToolButton label="Enviar mensagem" route="/message_form" />
                                    <ToolButton label="Forno" route="/oven" />
                                    <ToolButton label="Logs" route="/logs" />
                                    <ToolButton label="Lista negra" route="/blacklist" />
                                    <ToolButton label="Token" route="/token" />
                                </Box>
                            )}
                        </Box>
                    </Title>
                </Paper>
                <Box sx={{ width: "80vw" }}>
                    {nagazap ? (
                        <Routes>
                            <Route index element={<Info nagazap={nagazap} />} />
                            <Route path="/token" element={<Token nagazap={nagazap} setNagazap={setNagazap} />} />
                            <Route path="/messages" element={<MessagesScreen nagazap={nagazap} />} />
                            <Route path="/oven" element={<Oven nagazap={nagazap} setNagazap={setNagazap} />} />
                            <Route path="/blacklist" element={<Blacklist nagazap={nagazap} setNagazap={setNagazap} />} />
                            <Route path="/logs" element={<Logs nagazap={nagazap} setNagazap={setNagazap} />} />
                            <Route path="/message_form" element={<MessageFormScreen nagazap={nagazap} />} />
                            <Route path="/form" element={<NagazapForm onSuccess={onAddNagazap} />} />
                        </Routes>
                    ) : (
                        <Routes>
                            <Route index element={<NagazapForm onSuccess={onAddNagazap} />} />
                            <Route path="/*" element={<NagazapForm onSuccess={onAddNagazap} />} />
                        </Routes>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

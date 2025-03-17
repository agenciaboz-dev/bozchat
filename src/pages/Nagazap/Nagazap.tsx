import React, { useEffect, useState } from "react"
import { Box, MenuItem, Paper, TextField, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Add, AddCircle, Hub, WhatsApp } from "@mui/icons-material"
import { ToolButton } from "./ToolButton"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Token } from "./NagazapSettings/Token"
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
import { Header } from "../../components/Header/Header"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { NagazapForm } from "./NagazapForm"
import { WagaLoading } from "../../components/WagaLoading"
import { TemplateForm } from "./TemplateForm/TemplateForm"
import { NagazapSettings } from "./NagazapSettings/NagazapSettings"
import { OvenStatus } from "./Oven/OvenStatus"
import { Results } from "./Results/Results"
import { Templates } from "./Templates/Templates"

interface NagazapProps {}

export const NagazapScreen: React.FC<NagazapProps> = ({}) => {
    const io = useIo()
    const { company, user } = useUser()
    const navigate = useNavigate()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [nagazapList, setNagazapList] = useState<Nagazap[]>([])
    const [nagazap, setNagazap] = useState<Nagazap>()
    const [loading, setLoading] = useState(false)
    const [showInformations, setShowInformations] = useState(false)

    const fetchNagazap = async () => {
        if (!company) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { company_id: company.id } })
            const list = response.data as Nagazap[]
            setNagazapList(list)
            if (!!list.length) {
                setNagazap(list[0])
            } else {
                setNagazap(undefined)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    const onNewNagazapPress = () => {
        navigate("/nagazap/form")
        setNagazap(undefined)
    }

    const onNagazapChoose = (nagazap: Nagazap) => {
        setNagazap(nagazap)
        // navigate("/nagazap/")
    }

    const onAddNagazap = (new_nagazap: Nagazap) => {
        setNagazapList((list) => [...list, new_nagazap])
        setNagazap(new_nagazap)
        navigate("/nagazap/")
    }

    useEffect(() => {
        if (nagazap) {
            io.on(`nagazap:${nagazap.id}:update`, (data) => setNagazap(data))

            return () => {
                io.off(`nagazap:${nagazap.id}:update`)
            }
        }
    }, [nagazap])

    useEffect(() => {
        fetchNagazap()
    }, [])

    return (
        <Box sx={{ ...backgroundStyle, overflow: "auto" }}>
            <Header />
            <Box sx={{ padding: "2vw", height: "90vh" }}>
                {!showInformations ? (
                    <Paper
                        sx={{
                            width: isMobile ? "100%" : "17vw",
                            height: isMobile ? undefined : "100%",
                            bgcolor: "background.paper",
                            flexDirection: "column",
                            overflowY: "auto",
                            padding: isMobile ? "1vw" : "1vw 0",
                            gap: "1.5vw",
                            borderRadius: isMobile ? " 0 5vw 0 5vw" : "0 0 0 2vw ",
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
                        <Title title="Broadcast" icon={<Hub sx={{ width: isMobile ? "7vw" : undefined, height: isMobile ? "7vw" : undefined }} />}>
                            <Box
                                sx={{
                                    flexDirection: "column",
                                    gap: "2vw",
                                }}
                            >
                                <Box sx={{ padding: isMobile ? "2vw" : "0 2vw", paddingBottom: isMobile ? 0 : undefined }}>
                                    <TextField
                                        sx={textFieldStyle}
                                        select
                                        value={nagazap?.id || ""}
                                        label="Selecione uma conta"
                                        SelectProps={{
                                            MenuProps: {
                                                MenuListProps: { sx: { maxHeight: "20vw", bgcolor: "background.default", overflowY: "scroll" } },
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            sx={{ fontWeight: "bold", gap: "1vw" }}
                                            onClick={() => {
                                                onNewNagazapPress()
                                                if (isMobile) {
                                                    setShowInformations(true)
                                                }
                                            }}
                                            disabled={!user?.admin}
                                        >
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
                                        <ToolButton label="Informações" route="/" setShowInformations={setShowInformations} />
                                        <ToolButton label="Conversas" route="/messages" setShowInformations={setShowInformations} />
                                        <ToolButton label="Templates" route="/templates" setShowInformations={setShowInformations} />
                                        <ToolButton label="Enviar mensagem" route="/message-form" setShowInformations={setShowInformations} />
                                        <ToolButton
                                            label={
                                                <Box sx={{ gap: "0.5vw" }}>
                                                    Forno
                                                    <Box sx={{ position: "relative" }}>
                                                        <OvenStatus nagazap={nagazap} small_icon />
                                                    </Box>
                                                </Box>
                                            }
                                            route="/oven"
                                            setShowInformations={setShowInformations}
                                        />
                                        <ToolButton label="Logs" route="/logs" setShowInformations={setShowInformations} />
                                        <ToolButton label="Lista negra" route="/blacklist" setShowInformations={setShowInformations} />
                                        <ToolButton label="Resultados" route="/results" setShowInformations={setShowInformations} />
                                        <ToolButton label="Configurações" route="/settings" setShowInformations={setShowInformations} last />
                                    </Box>
                                )}
                            </Box>
                        </Title>
                    </Paper>
                ) : null}
                {!isMobile || (isMobile && showInformations) ? (
                    <Box sx={{ width: isMobile ? "100%" : "80vw", overflowY: "auto", height: "100%" }}>
                        {loading ? (
                            <Box sx={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                <WagaLoading />
                            </Box>
                        ) : nagazap ? (
                            <Routes>
                                <Route index element={<Info nagazap={nagazap} setShowInformations={setShowInformations} />} />
                                <Route path="/messages" element={<MessagesScreen nagazap={nagazap} setShowInformations={setShowInformations} />} />
                                <Route path="/templates" element={<Templates nagazap={nagazap} />} />
                                <Route
                                    path="/message-form"
                                    element={<MessageFormScreen nagazap={nagazap} setShowInformations={setShowInformations} />}
                                />
                                <Route
                                    path="/oven"
                                    element={<Oven nagazap={nagazap} setNagazap={setNagazap} setShowInformations={setShowInformations} />}
                                />
                                <Route
                                    path="/logs"
                                    element={<Logs nagazap={nagazap} setNagazap={setNagazap} setShowInformations={setShowInformations} />}
                                />
                                <Route
                                    path="/blacklist"
                                    element={<Blacklist nagazap={nagazap} setNagazap={setNagazap} setShowInformations={setShowInformations} />}
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <NagazapSettings
                                            nagazap={nagazap}
                                            setNagazap={setNagazap}
                                            fetchNagazaps={fetchNagazap}
                                            setShowInformations={setShowInformations}
                                        />
                                    }
                                />
                                <Route path="/form" element={<NagazapForm onSuccess={onAddNagazap} setShowInformations={setShowInformations} />} />
                                <Route path="/results" element={<Results nagazap={nagazap} />} />
                            </Routes>
                        ) : (
                            <Routes>
                                <Route index element={<NagazapForm onSuccess={onAddNagazap} setShowInformations={setShowInformations} />} />
                                <Route path="/*" element={<NagazapForm onSuccess={onAddNagazap} setShowInformations={setShowInformations} />} />
                            </Routes>
                        )}
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

import React, { useEffect, useState } from "react"
import { Box, Paper, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { Title } from "../../components/Title"
import { Engineering, Report } from "@mui/icons-material"
import { WagaLoading } from "../../components/WagaLoading"
import { Route, Routes, useNavigate } from "react-router-dom"
import { Home } from "./Home"
import { Bot } from "../../types/server/class/Bot/Bot"
import { BotForm } from "./BotForm"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { ToolButton } from "../../components/ToolButton"
import { BotPage } from "./BotPage"

interface BotsProps {}

export const Bots: React.FC<BotsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { company, user } = useUser()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [showInformations, setShowInformations] = useState(false)
    const [bots, setBots] = useState<Bot[]>([])

    const addBot = (bot: Bot) => setBots((list) => [...list.filter((item) => item.id !== bot.id), bot])

    const fetchBots = async () => {
        try {
            setLoading(true)
            const response = await api.get("/company/bots", { params: { company_id: company?.id } })
            setBots(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onDeleteBot = (bot: Bot) => {
        setBots((list) => list.filter((item) => item.id !== bot.id))
        navigate("/bots")
    }

    useEffect(() => {
        fetchBots()
    }, [])

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ padding: isMobile ? "5vw" : "2vw", height: "90vh" }}>
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
                            borderRadius: isMobile ? "2vw" : "4px 0 0 4px",
                            overflowX: "hidden",
                            // hiding scrollbar
                            "&::-webkit-scrollbar": {
                                width: 0,
                                height: 0,
                            },
                        }}
                        elevation={5}
                    >
                        <Title title="Bots" icon={<Engineering sx={{ width: isMobile ? "7vw" : undefined, height: isMobile ? "7vw" : undefined }} />}>
                            <Box
                                sx={{
                                    flexDirection: "column",
                                    gap: "2vw",
                                }}
                            >
                                <Box sx={{ flexDirection: "column" }}>
                                    <ToolButton label="Início" parentRoute="bots" route="/" setShowInformations={setShowInformations} />
                                    {user?.admin && (
                                        <ToolButton label="Criar bot" parentRoute="bots" route="/form" setShowInformations={setShowInformations} />
                                    )}
                                    <hr style={{ margin: "1vw 0" }} />
                                    {bots
                                        .sort((a, b) => Number(a.created_at) - Number(b.created_at))
                                        .map((bot) => {
                                            const misconfigured_actions_count = bot.instance?.nodes.reduce(
                                                (count, node) =>
                                                    (count +=
                                                        node.data.actions?.reduce(
                                                            (count, action) => (count += action.settings.misconfigured ? 1 : 0),
                                                            0
                                                        ) || 0),
                                                0
                                            )
                                            return (
                                                <ToolButton
                                                    key={bot.id}
                                                    label={
                                                        <Box sx={{ gap: "0.5vw" }}>
                                                            {misconfigured_actions_count > 0 && (
                                                                <Report
                                                                    color="secondary"
                                                                    sx={{
                                                                        padding: "0.2vw",
                                                                        bgcolor: "error.main",
                                                                        borderRadius: "100%",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                />
                                                            )}
                                                            {bot.name}
                                                        </Box>
                                                    }
                                                    parentRoute="bots"
                                                    route={`/${bot.name}`}
                                                    setShowInformations={setShowInformations}
                                                    payload={bot}
                                                />
                                            )
                                        })}
                                </Box>
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
                        ) : (
                            <Routes>
                                <Route index element={<Home bots={bots} fetchBots={fetchBots} setShowInformations={setShowInformations} />} />
                                <Route path="/form" element={<BotForm onSubmit={addBot} setShowInformations={setShowInformations} />} />
                                <Route
                                    path="/*"
                                    element={<BotPage onSave={addBot} onDelete={onDeleteBot} setShowInformations={setShowInformations} />}
                                />
                            </Routes>
                        )}
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

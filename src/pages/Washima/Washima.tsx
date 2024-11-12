import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, IconButton, MenuItem, Paper, Tab, Tabs, Typography, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header"
import { api } from "../../api"
import { QrCodeScanner, ReplayOutlined, WhatsApp } from "@mui/icons-material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useDarkMode } from "../../hooks/useDarkMode"
import { WashimaFormPage } from "./WashimaFormPage"
import { useIo } from "../../hooks/useIo"
import { WashimaZap } from "./WashimaZap"
import { useUser } from "../../hooks/useUser"

interface WashimaProps {}

export const WashimaPage: React.FC<WashimaProps> = ({}) => {
    const { darkMode } = useDarkMode()
    const { user } = useUser()
    const io = useIo()

    const isMobile = useMediaQuery("(orientation: portrait)")

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [currentWashima, setCurrentWashima] = useState<Washima | null>(null)

    const [isChat, setIsChat] = useState(false)

    const addWashima = (washima: Washima) => setWashimas((values) => [...values.filter((item) => item.id !== washima.id), washima])

    const fetchWashimas = async () => {
        setLoading(true)
        try {
            const response = await api.get("/washima", { params: { user_id: user?.id } })
            console.log(response.data)
            setWashimas(response.data)
            if (response.data.length > 0 && currentWashima === null) {
                setCurrentWashima(response.data[0])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const listen = () => {
        io.on("washima:update", (data: Washima) => {
            if (data.users.find((item) => item.id === user?.id)) addWashima(data)
        })

        io.on("washima:delete", (data: Washima) => {
            setWashimas((values) => values.filter((item) => item.id !== data.id))
            if (currentWashima?.id === data.id) {
                setCurrentWashima(null)
            }
        })

        io.on("washima:list", (washimas: Washima[]) => setWashimas(washimas))
    }

    const unlisten = () => {
        io.off("washima:update")
        io.off("washima:delete")
        io.off("washima:list")
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIsChat(newValue === 1)
    }

    useEffect(() => {
        const washima = washimas.find((item) => item.id === currentWashima?.id)
        if (washima) {
            setCurrentWashima(washima)
        }

        io.on("washima:qrcode", (qrcode: string, washima_id: string) => {
            const washima = washimas.find((item) => item.id === washima_id)
            if (washima) {
                washima.qrcode = qrcode
                addWashima(washima)
            }
        })

        return () => {
            io.off("washima:qrcode")
        }
    }, [washimas])

    useEffect(() => {
        fetchWashimas()
        listen()

        return () => {
            unlisten()
        }
    }, [])

    return (
        <Box sx={backgroundStyle}>
            <Header />
            {isMobile ? (
                <Box sx={{ flexDirection: "row" }}>
                    {/* <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{
                            margin: "1vw",
                            fontSize: "1rem",
                        }}
                        onClick={() => setIsChat(false)}
                    >
                        Washima
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{
                            margin: "1vw",
                            fontSize: "1rem",
                        }}
                        onClick={() => setIsChat(true)}
                    >
                        Conversas
                    </Button> */}

                    <Tabs value={isChat ? 1 : 0} onChange={handleChange} sx={{ flex: 1 }}>
                        <Tab
                            label="Washima"
                            sx={{ flex: 1 }}
                            onClick={() => {
                                setIsChat(false)
                            }}
                        />
                        <Tab
                            label="Conversas"
                            sx={{ flex: 1 }}
                            onClick={() => {
                                setIsChat(true)
                            }}
                        />
                    </Tabs>
                </Box>
            ) : null}
            <Box sx={{ flexDirection: "row", flex: 1 }}>
                {!isChat ? (
                    <Paper
                        sx={{
                            flex: isMobile ? 1 : 0.1,
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "2vw",
                            bgcolor: darkMode ? "" : "background.default",
                        }}
                    >
                        <Box sx={{ alignItems: "center", gap: "1vw", color: "text.secondary" }}>
                            <Box sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Washima</Box>
                            <IconButton onClick={() => fetchWashimas()}>
                                {loading ? <CircularProgress size={"1.5rem"} /> : <ReplayOutlined />}
                            </IconButton>
                        </Box>

                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            sx={{ margin: "1vw 0", borderStyle: "dashed", fontSize: "1rem" }}
                            onClick={() => {
                                setCurrentWashima(null)
                                if (isMobile) {
                                    setIsChat(true)
                                }
                            }}
                        >
                            +
                        </Button>
                        {washimas
                            .sort((a, b) => Number(b.created_at) - Number(a.created_at))
                            .map((item) => {
                                const active = currentWashima?.id === item.id
                                return (
                                    <MenuItem
                                        key={item.id}
                                        sx={{
                                            width: 1,
                                            margin: "0 -2vw",
                                            flexShrink: 0,
                                            outline: active ? "1px solid" : "",
                                            borderRadius: "0.3vw",
                                            justifyContent: "space-between",
                                        }}
                                        onClick={() => {
                                            setCurrentWashima(item)
                                            if (isMobile) {
                                                setIsChat(true)
                                            }
                                        }}
                                    >
                                        <Typography
                                            style={{
                                                maxWidth: "calc(100% - 1.5vw)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                        {!item.ready &&
                                            (!item.qrcode ? (
                                                <CircularProgress size="1rem" color="warning" />
                                            ) : (
                                                <QrCodeScanner
                                                    color="warning"
                                                    sx={{ width: isMobile ? "7vw" : "1.3vw", height: isMobile ? "7vw" : "1.3vw" }}
                                                />
                                            ))}
                                    </MenuItem>
                                )
                            })}
                    </Paper>
                ) : (
                    <Box sx={{ flex: 1 }}>
                        {!currentWashima || !currentWashima.ready || showForm ? (
                            <WashimaFormPage
                                showForm={showForm}
                                setShowForm={setShowForm}
                                currentWashima={currentWashima}
                                setCurrentWashima={setCurrentWashima}
                            />
                        ) : (
                            <WashimaZap washima={currentWashima} onEdit={() => setShowForm(true)} />
                        )}
                    </Box>
                )}
                {!isMobile ? (
                    <Box sx={{ flex: 1 }}>
                        {!currentWashima || !currentWashima.ready || showForm ? (
                            <WashimaFormPage
                                showForm={showForm}
                                setShowForm={setShowForm}
                                currentWashima={currentWashima}
                                setCurrentWashima={setCurrentWashima}
                            />
                        ) : (
                            <WashimaZap washima={currentWashima} onEdit={() => setShowForm(true)} />
                        )}
                    </Box>
                ) : null}
            </Box>
        </Box>
    )
}

import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, IconButton, MenuItem, Paper } from "@mui/material"
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

interface WashimaProps {
}

export const WashimaPage: React.FC<WashimaProps> = ({  }) => {
    const { darkMode } = useDarkMode()
    const io = useIo()

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [currentWashima, setCurrentWashima] = useState<Washima | null>(null)

    const addWashima = (washima: Washima) => setWashimas((values) => [...values.filter((item) => item.id !== washima.id), washima])

    const fetchWashimas = async () => {
        setLoading(true)
        try {
            const response = await api.get("/washima")
            console.log(response.data)
            setWashimas(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const listen = () => {
        io.on("washima:update", (data: Washima) => {
            addWashima(data)
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
            {/* <Header /> */}
            <Box sx={{ flexDirection: "row", flex: 1 }}>
                <Paper
                    sx={{ flex: 0.1, flexDirection: "column", alignItems: "center", padding: "2vw", bgcolor: darkMode ? "" : "background.default" }}
                >
                    <Box sx={{ alignItems: "center", gap: "1vw", color: "text.secondary" }}>
                        <Box sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>Washima</Box>
                        <IconButton onClick={() => fetchWashimas()}>{loading ? <CircularProgress size={"1.5rem"} /> : <ReplayOutlined />}</IconButton>
                    </Box>

                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ margin: "1vw 0", borderStyle: "dashed", fontSize: "1rem" }}
                        onClick={() => setCurrentWashima(null)}
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
                                    onClick={() => setCurrentWashima(item)}
                                >
                                    {item.name}
                                    {!item.ready &&
                                        (!item.qrcode ? (
                                            <CircularProgress size="1rem" color="warning" />
                                        ) : (
                                            <QrCodeScanner color="warning" sx={{ width: "1.3vw", height: "1.3vw" }} />
                                        ))}
                                </MenuItem>
                            )
                        })}
                </Paper>

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
            </Box>
        </Box>
    )
}

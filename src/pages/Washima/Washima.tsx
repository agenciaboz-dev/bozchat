import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, CircularProgress, IconButton, MenuItem, Paper, Tab, Tabs, Typography, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { api } from "../../api"
import { Add, ArrowBack, List, QrCodeScanner, Refresh, ReplayOutlined, Settings } from "@mui/icons-material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useDarkMode } from "../../hooks/useDarkMode"
import { WashimaFormPage } from "./WashimaFormPage"
import { useIo } from "../../hooks/useIo"
import { WashimaZap } from "./WashimaZap"
import { useUser } from "../../hooks/useUser"
import { useNotification } from "../../hooks/useNotification"
import { NoChat } from "./WashimaChat/NoChat"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { WashimaSidebar, WashimaSidebarProps } from "./WashimaSidebar"
import { slugify } from "../../tools/normalize"
import { Title2 } from "../../components/Title"
import { WashimasTable } from "./WashimasTable"
import { WashimaFormModal } from "./WashimaFormModal"

interface WashimaProps {}

export const WashimaPage: React.FC<WashimaProps> = ({}) => {
    const { darkMode } = useDarkMode()
    const { company, user } = useUser()
    const io = useIo()
    const notify = useNotification()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const [washimas, setWashimas] = useState<Washima[]>([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [currentWashima, setCurrentWashima] = useState<Washima | null>(null)

    const isTable = useMemo(() => pathname === "/business/contas" || pathname === "/business/contas/", [pathname])

    const addWashima = (washima: Washima) => setWashimas((values) => [...values.filter((item) => item.id !== washima.id), washima])

    const onWashimaSelect = (washima: Washima) => {
        setCurrentWashima(washima)
        navigate(`/business/${slugify(washima.name)}`)
    }

    const fetchWashimas = async () => {
        setLoading(true)
        try {
            const response = await api.get("/washima", { params: { company_id: company?.id } })
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
            if (data.companies.find((item) => item.id === company?.id)) addWashima(data)
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

    const navigateBack = () => {
        navigate("/business/contas")
        setCurrentWashima(null)
        fetchWashimas()
    }

    const createWashima = async () => {
        try {
            setCurrentWashima(null)
            setShowForm(true)
            const response = await api.post("/washima", { company_id: company?.id }, { params: { user_id: user?.id } })
            addWashima(response.data)
            setCurrentWashima(response.data)
        } catch (error) {
            console.log(error)
        }
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

    const SidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <Box sx={{ flex: 1 }}>
            <WashimaSidebar washimas={washimas} currentWashima={currentWashima} onClick={onWashimaSelect} />
            {children}
        </Box>
    )

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ flexDirection: "column", flex: 1, height: "90vh", padding: "2vw" }}>
                <Title2
                    name={`Business`}
                    left={
                        currentWashima && !isTable ? (
                            <IconButton onClick={navigateBack}>
                                <ArrowBack />
                            </IconButton>
                        ) : null
                    }
                    right={
                        currentWashima && !isTable ? null : (
                            <Box>
                                <IconButton onClick={createWashima}>
                                    <Add />
                                </IconButton>
                                <IconButton onClick={() => fetchWashimas()}>{loading ? <CircularProgress /> : <Refresh />}</IconButton>
                                {(pathname === "/business" || pathname === "/business/") && (
                                    <IconButton onClick={() => navigate("/business/contas")}>
                                        <List />
                                    </IconButton>
                                )}
                            </Box>
                        )
                    }
                />
                <Routes>
                    <Route
                        index
                        path="/"
                        element={
                            <SidebarWrapper>
                                <NoChat homepage />
                            </SidebarWrapper>
                        }
                    />

                    {currentWashima && (
                        <Route
                            path="*"
                            element={
                                <SidebarWrapper>
                                    <WashimaZap washima={currentWashima} />
                                </SidebarWrapper>
                            }
                        />
                    )}

                    <Route
                        path="/contas"
                        element={
                            <WashimasTable
                                setSelectedWashima={setCurrentWashima}
                                washimas={washimas}
                                loading={loading}
                                setLoading={setLoading}
                                selectedWashima={currentWashima}
                                setWashimas={setWashimas}
                                openSettings={() => setShowForm(true)}
                                fetchWashimas={fetchWashimas}
                            />
                        }
                    />
                </Routes>
            </Box>
            <WashimaFormModal
                open={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={addWashima}
                setCurrentWashima={setCurrentWashima}
                currentWashima={currentWashima}
            />
        </Box>
    )
}

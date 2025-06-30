import React, { useEffect, useMemo, useState } from "react"
import { Box, CircularProgress, IconButton, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { api } from "../../api"
import { Add, ArrowBack, List, Refresh } from "@mui/icons-material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { useDarkMode } from "../../hooks/useDarkMode"
import { useIo } from "../../hooks/useIo"
import { WashimaZap } from "./WashimaZap"
import { useUser } from "../../hooks/useUser"
import { useNotification } from "../../hooks/useNotification"
import { NoChat } from "../Zap/NoChat"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { WashimaSidebar } from "./WashimaSidebar"
import { slugify } from "../../tools/normalize"
import { Title2 } from "../../components/Title"
import { WashimasTable } from "./WashimasTable"
import { WashimaFormModal } from "./WashimaFormModal"

interface WashimaProps {}

const SidebarWrapper: React.FC<{
    children: React.ReactNode
    washimas: Washima[]
    currentWashima: Washima | null
    onWashimaSelect: (washima: Washima) => void
}> = ({ children, currentWashima, onWashimaSelect, washimas }) => (
    <Box sx={{ flex: 1, height: "90%" }}>
        <WashimaSidebar washimas={washimas} currentWashima={currentWashima} onClick={onWashimaSelect} />
        {children}
    </Box>
)

export const WashimaPage: React.FC<WashimaProps> = ({}) => {
    const { darkMode } = useDarkMode()
    const { user } = useUser()
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
    const isHome = useMemo(() => pathname === "/business" || pathname === "/business/", [pathname])

    const addWashima = (washima: Washima) => setWashimas((values) => [...values.filter((item) => item.id !== washima.id), washima])

    const onWashimaSelect = (washima: Washima) => {
        setCurrentWashima(washima)
        navigate(`/business/${slugify(washima.name)}`)
    }

    const fetchWashimas = async () => {
        setLoading(true)
        try {
            const response = await api.get("/washima", { params: { user_id: user?.id } })
            console.log(response.data)
            setWashimas(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const listen = () => {
        io.on("washima:delete", (data: Washima | null) => {
            if (!data) return
            setWashimas((values) => values.filter((item) => item.id !== data.id))
            if (currentWashima?.id === data.id) {
                setCurrentWashima(null)
            }
        })

        io.on("washima:list", (washimas: Washima[]) => setWashimas(washimas))
    }

    const unlisten = () => {
        io.off("washima:delete")
        io.off("washima:list")
    }

    const navigateBack = () => {
        navigate("/business")
        setCurrentWashima(null)
        fetchWashimas()
    }

    const createWashima = async () => {
        try {
            setCurrentWashima(null)
            setShowForm(true)
            // const response = await api.post("/washima", { company_id: company?.id }, { params: { user_id: user?.id } })
            // addWashima(response.data)
            // setCurrentWashima(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onWashimaUpdate = (washima: Washima) => {
        if (!washimas.find((item) => item.id === washima.id)) return
        setWashimas((washimas) => [...washimas.filter((item) => item.id !== washima.id), washima])
    }

    useEffect(() => {
        // const washima = washimas.find((item) => item.id === currentWashima?.id)
        // if (washima) {
        //     setCurrentWashima(washima)
        // }

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

    useEffect(() => {
        io.on("washima:update", (washima: Washima) => {
            onWashimaUpdate(washima)
            if (currentWashima?.id === washima.id) {
                setCurrentWashima(washima)
            }
        })
        return () => {
            io.off("washima:update")
        }
    }, [washimas, currentWashima])

    useEffect(() => {
        if (currentWashima) {
            io.on("washima:ready", (id) => {
                if (id === currentWashima?.id) {
                }
            })

            io.on(`washima:${currentWashima.id}:init`, (status: string, progress: number) => {
                console.log(status)
                console.log(progress)

                if (progress === 4) {
                    setTimeout(() => {
                        currentWashima!.ready = true
                        // setSyncStatus("Iniciando")
                        // setSyncProgress(0)
                    }, 1000)
                }
            })

            return () => {
                io.off("washima:ready")
                io.off(`washima:${currentWashima!.id}:init`)
            }
        }
    }, [currentWashima])

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ flexDirection: "column", flex: 1, height: "90vh", padding: isMobile ? "5vw" : "2vw" }}>
                <Title2
                    name={`Business`}
                    left={
                        currentWashima || !isHome ? (
                            <IconButton onClick={navigateBack}>
                                <ArrowBack />
                            </IconButton>
                        ) : null
                    }
                    right={
                        <Box>
                            {user?.admin && (
                                <IconButton onClick={createWashima}>
                                    <Add />
                                </IconButton>
                            )}
                            <IconButton onClick={() => fetchWashimas()}>
                                {loading ? <CircularProgress sx={{ color: "text.secondary" }} /> : <Refresh />}
                            </IconButton>
                            {!isTable && user?.admin && (
                                <IconButton onClick={() => navigate("/business/contas")}>
                                    <List />
                                </IconButton>
                            )}
                        </Box>
                    }
                />
                <Routes>
                    <Route
                        index
                        path="/"
                        element={
                            isMobile ? (
                                <WashimaSidebar washimas={washimas} currentWashima={currentWashima} onClick={onWashimaSelect} />
                            ) : (
                                <SidebarWrapper currentWashima={currentWashima} onWashimaSelect={onWashimaSelect} washimas={washimas}>
                                    <NoChat homepage />
                                </SidebarWrapper>
                            )
                        }
                    />

                    {currentWashima && (
                        <Route
                            path="*"
                            element={
                                isMobile ? (
                                    <WashimaZap washima={currentWashima} />
                                ) : (
                                    <SidebarWrapper currentWashima={currentWashima} onWashimaSelect={onWashimaSelect} washimas={washimas}>
                                        <WashimaZap washima={currentWashima} />
                                    </SidebarWrapper>
                                )
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
                                onWashimaUpdate={onWashimaUpdate}
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

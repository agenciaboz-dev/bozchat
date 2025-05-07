import React, { useEffect, useState } from "react"
import { Badge, Box, Chip, CircularProgress, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { useApi } from "../../hooks/useApi"
import { useFetchedData } from "../../hooks/useFetchedData"
import { AdminCompany } from "../../types/server/class/Company"
import { useUser } from "../../hooks/useUser"
import { Title2 } from "../../components/Title"
import { Refresh, WhatsApp } from "@mui/icons-material"
import { AdminTable } from "./AdminTable"
import { api } from "../../api"
import { Washima } from "../../types/server/class/Washima/Washima"

interface AdminProps {}

export const Admin: React.FC<AdminProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const apiHelper = useApi()
    const { user } = useUser()

    const [companies, setCompanies, { refresh, loading }] = useFetchedData<AdminCompany>("companies")
    const [washimaInitializing, setWashimaInitializing] = useState<Washima[]>([])
    const [washimaWaiting, setWashimaWaiting] = useState<Washima[]>([])

    const fetchWashimaInitInfo = async () => {
        try {
            const response = await api.get("/washima/init-status")
            const { initializing, waitingList } = response.data
            setWashimaInitializing(initializing)
            setWashimaWaiting(waitingList)
        } catch (error) {
            console.log(error)
        }
    }

    const addOrUpdateCompany = (company: AdminCompany) => setCompanies((list) => [...list.filter((item) => item.id !== company.id), company])

    const updateCompany = async (data: Partial<AdminCompany> & { id: string }) => {
        if (!user) return

        const updatedCompany = await apiHelper.admin.patchCompany(data, { params: { company_id: data.id, user_id: user.id } })
        const adminCompany = companies.find((item) => item.id === updatedCompany.id)!
        addOrUpdateCompany({ ...adminCompany, ...updatedCompany } as AdminCompany)
    }

    useEffect(() => {
        if (loading) fetchWashimaInitInfo()
    }, [loading])

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ flexDirection: "column", gap: "1vw", padding: "2vw" }}>
                <Title2
                    name="Administração"
                    right={
                        <Box sx={{ alignItems: "center" }}>
                            <Tooltip
                                title={
                                    <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
                                        <Typography>
                                            Instâncias em inicialização:
                                            <Chip label={washimaInitializing.length} size="small" color="primary" sx={{ marginLeft: "0.5vw" }} />
                                        </Typography>
                                        <Box sx={{ gap: "0.5vw", flexWrap: "wrap" }}>
                                            {washimaInitializing.map((washima) => (
                                                <Chip key={washima.id} size="small" label={washima.name} color="primary" />
                                            ))}
                                        </Box>
                                        <Typography>
                                            Instâncias em espera:
                                            <Chip label={washimaWaiting.length} size="small" color="warning" sx={{ marginLeft: "0.5vw" }} />
                                        </Typography>
                                        <Box sx={{ gap: "0.5vw", flexWrap: "wrap" }}>
                                            {washimaWaiting.map((washima) => (
                                                <Chip key={washima.id} size="small" label={washima.name} color="warning" />
                                            ))}
                                        </Box>
                                    </Box>
                                }
                            >
                                <IconButton>
                                    <Badge
                                        badgeContent={washimaInitializing.length}
                                        color="primary"
                                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                    >
                                        <Badge
                                            badgeContent={washimaWaiting.length}
                                            color="warning"
                                            anchorOrigin={{ vertical: "top", horizontal: "left" }}
                                        >
                                            <WhatsApp />
                                        </Badge>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={refresh}>{loading ? <CircularProgress sx={{ color: "text.secondary" }} /> : <Refresh />}</IconButton>
                        </Box>
                    }
                />
                <AdminTable companies={companies} loading={loading} updateCompany={updateCompany} />
            </Box>
        </Box>
    )
}

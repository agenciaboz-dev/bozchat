import React from "react"
import { Box, CircularProgress, IconButton, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { useApi } from "../../hooks/useApi"
import { useFetchedData } from "../../hooks/useFetchedData"
import { AdminCompany } from "../../types/server/class/Company"
import { useUser } from "../../hooks/useUser"
import { Title2 } from "../../components/Title"
import { Refresh } from "@mui/icons-material"
import { AdminTable } from "./AdminTable"

interface AdminProps {}

export const Admin: React.FC<AdminProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const api = useApi()
    const { user } = useUser()

    const [companies, setCompanies, { refresh, loading }] = useFetchedData<AdminCompany>("companies")

    const addOrUpdateCompany = (company: AdminCompany) => setCompanies((list) => [...list.filter((item) => item.id !== company.id), company])

    const updateCompany = async (data: Partial<AdminCompany> & { id: string }) => {
        if (!user) return

        const updatedCompany = await api.admin.patchCompany(data, { params: { company_id: data.id, user_id: user.id } })
        const adminCompany = companies.find((item) => item.id === updatedCompany.id)!
        addOrUpdateCompany({ ...adminCompany, ...updatedCompany } as AdminCompany)
    }

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ flexDirection: "column", gap: "1vw", padding: "2vw" }}>
                <Title2 name="Administração" right={<IconButton onClick={refresh}>{loading ? <CircularProgress /> : <Refresh />}</IconButton>} />
                <AdminTable companies={companies} loading={loading} updateCompany={updateCompany} />
            </Box>
        </Box>
    )
}

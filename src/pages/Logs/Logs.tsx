import React, { useEffect, useMemo, useState } from "react"
import { Box, IconButton, Paper } from "@mui/material"
import { Log, MuiColor } from "../../types/server/class/Log"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header"
import { DataGrid, GridColDef, GridFilterPanel } from "@mui/x-data-grid"
import { useUser } from "../../hooks/useUser"
import { api } from "../../api"
import { Check, Delete, Edit, Refresh, Warning } from "@mui/icons-material"
import { Title2 } from "../../components/Title"

interface LogsProps {}

const icons = {
    success: Check,
    error: Delete,
    warning: Warning,
    info: Edit,
}

export const Logs: React.FC<LogsProps> = ({}) => {
    const { company } = useUser()

    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)

    const formatted_logs = useMemo(() => logs.map((log) => ({ ...log, user_name: log.user.name })), [logs])

    const columns: GridColDef[] = [
        {
            field: "color",
            headerName: "Tipo",
            disableColumnMenu: true,
            renderCell: (cell) => {
                const value = cell.value as keyof typeof icons
                const Icon = icons[value]

                return <Icon color={value} sx={{ height: 50, width: 25 }} />
            },
            flex: 0.05,
            align: "center",
        },
        {
            field: "timestamp",
            headerName: "Data",
            flex: 0.15,
            renderCell: (cell) => {
                const date = new Date(cell.value)
                return date.toLocaleString("pt-br")
            },
        },
        { field: "user_name", headerName: "Usuário", flex: 0.25 },

        { field: "text", headerName: "Ação", flex: 0.55 },
    ]

    const fetchLogs = async () => {
        if (!company) return

        try {
            setLoading(true)
            const response = await api.get("/company/logs", { params: { company_id: company.id } })
            setLogs(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <Box sx={backgroundStyle}>
            <Header />
            <Box sx={{ padding: "2vw", flex: 1, flexDirection: "column" }}>
                <Title2
                    name="Logs"
                    right={
                        <IconButton onClick={fetchLogs}>
                            <Refresh />
                        </IconButton>
                    }
                />
                <Paper sx={{ flex: 1 }}>
                    <DataGrid
                        loading={loading}
                        rows={formatted_logs}
                        columns={columns}
                        initialState={{
                            sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
                            pagination: { paginationModel: { page: 1, pageSize: 50 } },
                        }}
                        pageSizeOptions={[50, 100, 500, -1]}
                        sx={{ border: 0, height: "76vh" }}
                        slots={{ filterPanel: () => <GridFilterPanel /> }}
                    />
                </Paper>
            </Box>
        </Box>
    )
}

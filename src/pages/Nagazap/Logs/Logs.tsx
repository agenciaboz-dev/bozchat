import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { ArrowBack, Refresh } from "@mui/icons-material"
import { LogsList } from "./LogsList"
import { useUser } from "../../../hooks/useUser"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { FailedMessageLog, SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Title2 } from "../../../components/Title"

interface LogsProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

const mask = new Inputmask({ mask: "(99) 9999-9999", placeholder: "", greedy: false }) as any

export const Logs: React.FC<LogsProps> = ({ nagazap, setNagazap, setShowInformations }) => {
    const { company } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("")

    const refresh = async () => {
        if (!company) return
        setLoading(true)

        try {
            const response = await api.get("/nagazap", { params: { company_id: company.id, nagazap_id: nagazap.id } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const sentMessagesColumns: (GridColDef & { field: keyof WithoutFunctions<SentMessageLog> })[] = [
        {
            field: "timestamp",
            headerName: "Data",
            flex: 0.3,
            renderCell: (cell) => {
                const date = new Date(Number(cell.value))
                return date.toLocaleString("pt-br")
            },
        },
        {
            field: "data",
            headerName: "Telefone",
            flex: 0.25,
            valueFormatter: (value: any) => mask.format(value.contacts[0].wa_id.slice(2)),
        },
        { field: "template_name", headerName: "Template", flex: 0.5 },
    ]

    const failedMessagesColumns: (GridColDef & { field: keyof WithoutFunctions<FailedMessageLog> })[] = [
        {
            field: "timestamp",
            headerName: "Data",
            flex: 0.3,
            renderCell: (cell) => {
                const date = new Date(Number(cell.value))
                return date.toLocaleString("pt-br")
            },
        },
        {
            field: "number",
            headerName: "Telefone",
            flex: 0.25,
            valueFormatter: (value) => mask.format(value),
        },
        {
            field: "data",
            headerName: "Erro",
            flex: 0.45,
            valueFormatter: (value: any) => value.error?.message,
        },
    ]

    useEffect(() => {
        refresh()
    }, [])

    return nagazap ? (
        <Subroute
            title="Logs"
            right={
                <IconButton
                    onClick={() => {
                        refresh()
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
            left={
                isMobile ? (
                    <IconButton
                        onClick={() => {
                            setShowInformations(false)
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                ) : undefined
            }
        >
            <Box sx={{ marginTop: "-1vw", gap: "1vw" }}>
                <Box sx={{ flex: 1, flexDirection: "column" }}>
                    <Title2 name="Sucesso" />
                    <Paper>
                        <DataGrid
                            loading={loading}
                            rows={nagazap.sentMessages}
                            columns={sentMessagesColumns}
                            initialState={{
                                sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
                                pagination: { paginationModel: { page: 0, pageSize: 20 } },
                            }}
                            pageSizeOptions={[20, 50, 100, 200]}
                            sx={{
                                border: 0,
                                height: "61vh",
                                "& .MuiDataGrid-row": {
                                    cursor: "pointer",
                                },
                            }}
                            getRowId={(row: SentMessageLog) => row.timestamp + row.data.messages[0].id}
                        />
                    </Paper>
                </Box>
                <Box sx={{ flexDirection: "column", flex: 1 }}>
                    <Title2 name="Falhas" />
                    <Paper>
                        <DataGrid
                            loading={loading}
                            rows={nagazap.failedMessages}
                            columns={failedMessagesColumns}
                            initialState={{
                                sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
                                pagination: { paginationModel: { page: 0, pageSize: 20 } },
                            }}
                            pageSizeOptions={[20, 50, 100, 200]}
                            sx={{
                                border: 0,
                                height: "61vh",
                                "& .MuiDataGrid-row": {
                                    cursor: "pointer",
                                },
                            }}
                            getRowId={(row: FailedMessageLog) => row.timestamp + row.number}
                        />
                    </Paper>
                </Box>
            </Box>
        </Subroute>
    ) : null
}

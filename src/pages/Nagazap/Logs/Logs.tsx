import React, { useEffect, useState } from "react"
import { Box, CircularProgress, IconButton, Paper, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { ArrowBack, Refresh } from "@mui/icons-material"
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
const extra9Mask = new Inputmask({ mask: "(99) 99999-9999", placeholder: "", greedy: false }) as any

export const Logs: React.FC<LogsProps> = ({ nagazap, setNagazap, setShowInformations }) => {
    const { company } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)

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
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "data",
            headerName: "Telefone",
            flex: 0.25,
            valueFormatter: (value: any) => mask.format(value.contacts[0].wa_id.slice(2)),
            minWidth: isMobile ? 150 : undefined,
        },
        { field: "template_name", headerName: "Template", flex: 0.5, minWidth: isMobile ? 150 : undefined },
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
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "number",
            headerName: "Telefone",
            flex: 0.25,
            valueFormatter: (value) => extra9Mask.format(value),
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "data",
            headerName: "Erro",
            flex: 0.45,
            valueFormatter: (value: any) => value.error?.message,
            minWidth: isMobile ? 150 : undefined,
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
                    {loading ? <CircularProgress size="1.5rem" sx={{ color: "text.secondary" }} /> : <Refresh />}
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
            <Box sx={{ marginTop: "-1vw", gap: isMobile ? "5vw" : "1vw", flex: 1, flexDirection: isMobile ? "column" : "row" }}>
                <Box sx={{ flex: 1, flexDirection: "column" }}>
                    <Title2 name="Sucesso" space={isMobile} />
                    <Paper sx={{ marginTop: isMobile ? "2vw" : "1vw" }}>
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
                                height: isMobile ? "40vh" : "60vh",
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
                    <Paper sx={{ marginTop: isMobile ? "2vw" : "1vw" }}>
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
                                height: isMobile ? "40vh" : "60vh",
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

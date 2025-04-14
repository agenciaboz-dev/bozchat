import React, { useEffect, useState } from "react"
import { CircularProgress, IconButton, Menu, MenuItem, Paper, useMediaQuery } from "@mui/material"
import { BlacklistLog, Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { ArrowBack, MoreHoriz, Refresh } from "@mui/icons-material"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import Inputmask from "inputmask"

interface BlacklistProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
    setShowInformations: React.Dispatch<React.SetStateAction<boolean>>
}

const mask = new Inputmask({ mask: "(99) 9999-9999", placeholder: "", greedy: false }) as anys

export const Blacklist: React.FC<BlacklistProps> = ({ nagazap, setNagazap, setShowInformations }) => {
    const { company, user } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const [loading, setLoading] = useState(false)
    const [blacklist, setBlacklist] = useState<BlacklistLog[]>([])
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedLog, setSelectedLog] = useState<BlacklistLog | null>(null)

    const handleDelete = async () => {
        if (!selectedLog) return
        try {
            const response = await api.delete("/nagazap/blacklist", {
                data: { number: selectedLog.number },
                params: { nagazap_id: nagazap.id, user_id: user?.id },
            })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        }
    }

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

    const columns: (GridColDef & { field: keyof WithoutFunctions<BlacklistLog & { action: null }> })[] = [
        {
            field: "timestamp",
            headerName: "Data",
            flex: 0.15,
            renderCell: (cell) => {
                const date = new Date(Number(cell.value))
                return date.toLocaleString("pt-br")
            },
        },
        { field: "name", headerName: "Nome", flex: 0.55 },
        { field: "number", headerName: "Telefone", flex: 0.25, valueFormatter: (value: string) => mask.format(value) },
        {
            field: "action",
            headerName: "Ações",
            renderCell: () => {
                return (
                    <IconButton onClick={(ev) => setMenuAnchor(ev.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>
                )
            },
            align: "center",
            sortable: false,
            filterable: false,
            minWidth: isMobile ? 150 : undefined,
        },
    ]

    useEffect(() => {
        if (nagazap) {
            setBlacklist(nagazap.blacklist)
        }
    }, [nagazap?.blacklist])

    return (
        <Subroute
            title="Lista negra"
            right={
                <IconButton
                    onClick={() => {
                        refresh()
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size="1.5rem" color={darkMode ? "secondary" : "inherit"} /> : <Refresh />}
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
            <Paper sx={{ flex: 1, marginTop: "-2.5vw" }}>
                <DataGrid
                    loading={loading}
                    rows={blacklist}
                    columns={columns}
                    initialState={{
                        sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
                        pagination: { paginationModel: { page: 0, pageSize: 20 } },
                    }}
                    pageSizeOptions={[20, 50, 100, 200]}
                    sx={{
                        border: 0,
                        height: "68vh",
                        "& .MuiDataGrid-row": {
                            cursor: "pointer",
                        },
                    }}
                    getRowId={(row) => row.number}
                    onRowSelectionModelChange={(model) => {
                        if (model.length > 0) return
                        setSelectedLog(blacklist.find((item) => item.number === model[0]) || null)
                    }}
                />

                <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                    <MenuItem onClick={() => handleDelete()} disabled={!user?.admin}>
                        Remover da lista negra
                    </MenuItem>
                </Menu>
            </Paper>
        </Subroute>
    )
}

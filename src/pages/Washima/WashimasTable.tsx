import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, CircularProgress, IconButton, Menu, MenuItem, Paper, Tooltip, useMediaQuery } from "@mui/material"
import { Washima, WashimaDiskMetrics, WashimaStatus } from "../../types/server/class/Washima/Washima"
import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { Circle, MoreHoriz, QrCode } from "@mui/icons-material"
import { api } from "../../api"
import numeral from "numeral"
import { useNavigate } from "react-router-dom"
import { slugify } from "../../tools/normalize"
import { useUser } from "../../hooks/useUser"
import { useIo } from "../../hooks/useIo"
import { useConfirmDialog } from "burgos-confirm"
import { phoneMask } from "../../tools/masks"
import { Chat } from "../../types/Chat"
import { QRCode } from "react-qrcode-logo"

interface WashimasTableProps {
    washimas: Washima[]
    loading?: boolean
    setSelectedWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    selectedWashima: Washima | null
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setWashimas: React.Dispatch<React.SetStateAction<Washima[]>>
    openSettings: () => void
}

interface CustomRow extends WithoutFunctions<Washima> {
    storage_messages: string
    storage_media: string
}

export const WashimasTable: React.FC<WashimasTableProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const isMenu = useRef(false)
    const navigate = useNavigate()
    const { user, company } = useUser()
    const io = useIo()
    const { confirm } = useConfirmDialog()

    const [rows, setRows] = useState<CustomRow[]>(props.washimas.map((washima) => ({ ...washima, storage_media: "", storage_messages: "" })))
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const columns: (GridColDef & { field: keyof WithoutFunctions<CustomRow> })[] = [
        {
            field: "status",
            headerName: "Status",
            flex: 0.1,
            display: "flex",
            renderCell: (params) => {
                const washima = params.row as Washima
                const value = washima.status

                return value === "loading" ? (
                    <CircularProgress color="primary" />
                ) : value === "ready" ? (
                    <Paper sx={{ borderRadius: "100%" }}>
                        <Circle color={value === "ready" ? "success" : "warning"} fontSize="small" />
                    </Paper>
                ) : (
                    <Tooltip title={<QRCode value={washima.qrcode} size={250} />} arrow>
                        <IconButton>
                            <QrCode />
                        </IconButton>
                    </Tooltip>
                )
            },
            align: "center",
        },
        { field: "name", headerName: "Nome", flex: 0.4 },
        { field: "info", headerName: "Nome de exibição", flex: 0.5, valueFormatter: (_, row: Washima) => row.info?.pushname },
        { field: "number", headerName: "Número", flex: 0.3, valueFormatter: (value) => phoneMask.format(value) },
        { field: "chats", headerName: "Conversas", flex: 0.2, valueFormatter: (value: Chat[]) => value.length },
        { field: "storage_messages", headerName: "Armazenamento: mensagens", flex: 0.35 },
        { field: "storage_media", headerName: "Armazenamento: mídia", flex: 0.3 },
        {
            field: "id",
            headerName: "Ações",
            renderCell: () => {
                return (
                    <IconButton onClick={onActionsButtonPress}>
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


    const fetchWashimaMetrics = async (washima: Washima) => {
        const response = await api.get("/washima/tools/disk-usage", { params: { washima_id: washima.id } })
        const metrics = response.data as WashimaDiskMetrics
        setRows((rows) => [
            ...rows.filter((item) => item.id !== washima.id),
            {
                ...washima,
                storage_media: numeral(metrics.media * 1000 * 1000).format("0.00 b"),
                storage_messages: numeral(metrics.messages * 1000 * 1000).format("0.00 b"),
            },
        ])
    }

    const onActionsButtonPress = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // ev.stopPropagation()
        isMenu.current = true
        setMenuAnchor(ev.currentTarget)
    }

    const closeMenu = () => {
        setMenuAnchor(null)
        isMenu.current = false
        props.setSelectedWashima(null)
    }

    const navigateToWashima = (washima: Washima) => {
        navigate(`/business/${slugify(washima.name)}`)
    }

    const onRowClick = (params: GridRowParams<Washima>) => {
        const washima = params.row
        if ((washima.id === props.selectedWashima?.id || isMenu.current === false) && washima.status === 'ready') {
            navigateToWashima(washima)
        } else {
            props.setSelectedWashima(washima)
        }
    }

    

    const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
        if (rowSelectionModel.length === 0) return
        console.log(rowSelectionModel[0])
        const washima = props.washimas.find((washima) => washima.id === rowSelectionModel[0])
        if (washima) {
            props.setSelectedWashima(washima)
        }
    }

    const onSettingsPress = () => {
        props.openSettings()
        setMenuAnchor(null)
        isMenu.current = false
        
    }

    const onRestartPress = async () => {
        if (props.loading || !props.selectedWashima) return
        closeMenu()

        try {
            const response = await api.post("/washima/restart", { washima_id: props.selectedWashima.id }, { params: { user_id: user?.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const onDeletePress = async () => {
        if (!props.selectedWashima) return
        const washima = {...props.selectedWashima} as Washima
        closeMenu()

        confirm({
            title: "Deletar Business",
            content: "Tem certeza que deseja deletar essa instância do Business? Essa ação é irreversível.",
            onConfirm: async () => {
                washima.status = 'loading'
                
                onWashimaUpdate(washima)
                try {
                    const response = await api.delete("/washima", { data: { washima_id: washima.id }, params: { user_id: user?.id } })
                    props.setSelectedWashima(null)
                } catch (error) {
                    console.log(error)
                }
            },
        })
    }

    const onSyncMessages = async () => {
        if (props.loading || !props.selectedWashima) return
        closeMenu()

        try {
            const response = await api.post(
                "/washima/fetch-messages-whatsappweb",
                { id: props.selectedWashima.id, options: { groupOnly: false } },
                { timeout: 0 }
            )
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const onWashimaUpdate = (washima: Washima) => {
        if (!props.washimas.find((item) => item.id === washima.id)) return
        props.setWashimas((washimas) => [...washimas.filter((item) => item.id !== washima.id), washima])
        // setRows((rows) => {
        //     const row = rows.find((item) => item.id === washima.id)
        //     if (!row) {
        //         return rows
        //     }

        //     const filteredRows = rows.filter((item) => item.id !== washima.id)
        //     return [...filteredRows, { ...washima, storage_media: row.storage_media, storage_messages: row.storage_messages }]
        // })
    }

    useEffect(() => {
        io.on("washima:update", (washima: Washima) => {
            onWashimaUpdate(washima)
            if (props.selectedWashima?.id === washima.id) {
                props.setSelectedWashima(washima)
            }
        })

        return () => {
            io.off("washima:update")
        }
    }, [props.washimas, props.selectedWashima])

    useEffect(() => {
        if (props.selectedWashima) {
            io.on("washima:ready", (id) => {
                if (id === props.selectedWashima?.id) {
                }
            })

            io.on(`washima:${props.selectedWashima.id}:init`, (status: string, progress: number) => {
                console.log(status)
                console.log(progress)

                if (progress === 4) {
                    setTimeout(() => {
                        props.selectedWashima!.ready = true
                        // setSyncStatus("Iniciando")
                        // setSyncProgress(0)
                    }, 1000)
                }
            })

            io.on(`washima:${props.selectedWashima.id}:sync:messages`, () => {
                // setFetchingMessages(true)
            })

            return () => {
                io.off("washima:ready")
                io.off(`washima:${props.selectedWashima!.id}:init`)
                io.off(`washima:${props.selectedWashima!.id}:sync:messages`)
            }
        }
    }, [props.selectedWashima])

    useEffect(() => {
        setRows(rows => props.washimas.map((washima) => {
            const row = rows.find(item => item.id === washima.id)
            return ({ ...washima, storage_media: row?.storage_media || '', storage_messages: row?.storage_messages || '' })
        }))
        props.washimas.forEach((washima) => fetchWashimaMetrics(washima))
    }, [props.washimas])

    return (
        <Paper sx={{}}>
            <DataGrid
                loading={props.loading}
                rows={rows}
                columns={columns}
                initialState={{
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                    pagination: { paginationModel: { page: 0, pageSize: 20 } },
                }}
                pageSizeOptions={[20, 50, 100, 200]}
                sx={{
                    border: 0,
                    height: "74vh",
                    "& .MuiDataGrid-row": {
                        cursor: "pointer",
                    },
                }}
                onRowSelectionModelChange={onRowSelectionModelChange}
                onRowClick={onRowClick}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                <MenuItem onClick={onSettingsPress} disabled={!user?.admin}>
                    Configurações
                </MenuItem>
                <MenuItem onClick={onSyncMessages} disabled={!user?.admin || props.selectedWashima?.status !== "ready"}>
                    Sincronizar mensagens
                </MenuItem>
                <MenuItem onClick={onRestartPress} disabled={!user?.admin || props.selectedWashima?.status === "loading"}>
                    Reiniciar
                </MenuItem>
                <MenuItem onClick={onDeletePress} disabled={!user?.admin}>
                    Deletar
                </MenuItem>
            </Menu>
        </Paper>
    )
}

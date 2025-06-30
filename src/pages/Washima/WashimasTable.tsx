import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, CircularProgress, IconButton, LinearProgress, Menu, MenuItem, Paper, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Washima, WashimaDiskMetrics, WashimaStatus } from "../../types/server/class/Washima/Washima"
import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { Abc, Circle, MoreHoriz, QrCode } from "@mui/icons-material"
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
import { SyncMessagesContainer } from "./SyncMessagesContainer"
import { useSnackbar } from "burgos-snackbar"
import { PairingCode } from "./PairingCode"
import { WashimaAccessModal } from "./WashimaAccessModal"

interface WashimasTableProps {
    washimas: Washima[]
    loading?: boolean
    setSelectedWashima: React.Dispatch<React.SetStateAction<Washima | null>>
    selectedWashima: Washima | null
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setWashimas: React.Dispatch<React.SetStateAction<Washima[]>>
    openSettings: () => void
    fetchWashimas: () => void
    onWashimaUpdate: (washima: Washima) => void
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
    const { snackbar } = useSnackbar()

    const [rows, setRows] = useState<CustomRow[]>(props.washimas.map((washima) => ({ ...washima, storage_media: "", storage_messages: "" })))
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [accessModal, setAccessModal] = useState(false)

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
                ) : value === "ready" || value === "error" || value === "stopped" ? (
                    <Tooltip
                        title={
                            value === "ready"
                                ? "Conectado"
                                : value === "stopped"
                                ? "Instância inativa. Você pode reiniciá-la nas ações ao lado."
                                : "Instância com erro"
                        }
                        arrow
                    >
                        <Paper sx={{ borderRadius: "100%" }}>
                            <Circle color={value === "ready" ? "success" : value === "stopped" ? "disabled" : "error"} fontSize="small" />
                        </Paper>
                    </Tooltip>
                ) : value === "pairingcode" ? (
                    <Tooltip title={<PairingCode code={washima.qrcode!} />} arrow>
                        <IconButton>
                            <Abc />
                        </IconButton>
                    </Tooltip>
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
        { field: "name", headerName: "Nome", flex: 0.4, minWidth: isMobile ? 200 : undefined },
        {
            field: "number",
            headerName: "Número",
            flex: 0.25,
            valueFormatter: (value) => phoneMask.format(value),
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "chats",
            headerName: "Conversas",
            flex: 0.3,
            display: "flex",
            renderCell: (params) => {
                const washima = params.row as Washima
                return (
                    <Box sx={{ flexDirection: "column", height: "100%", justifyContent: "center" }}>
                        <Typography>{washima.chats.length}</Typography>
                        {washima.syncing && <SyncMessagesContainer washima={washima} type="chat" />}
                    </Box>
                )
            },
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "storage_messages",
            headerName: "Armazenamento: mensagens",
            flex: 0.35,
            display: "flex",
            renderCell: (params) => {
                const washima = params.row as Washima
                return (
                    <Box sx={{ flexDirection: "column", height: "100%", justifyContent: "center" }}>
                        <Typography>{params.value}</Typography>
                        {washima.syncing && <SyncMessagesContainer washima={washima} type="messages" />}
                    </Box>
                )
            },
            minWidth: isMobile ? 300 : undefined,
        },
        { field: "storage_media", headerName: "Armazenamento: mídia", flex: 0.3, minWidth: isMobile ? 300 : undefined },
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

    const openAccess = () => {
        setAccessModal(true)
    }

    const closeAccess = () => {
        setAccessModal(false)
        closeMenu()
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
        if ((washima.id === props.selectedWashima?.id || isMenu.current === false) && washima.status === "ready") {
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

    const onRestartPress = async () => {
        if (props.loading || !props.selectedWashima) return
        closeMenu()
        snackbar({ severity: "warning", text: "Reiniciando" })

        try {
            const response = await api.post("/washima/restart", { washima_id: props.selectedWashima.id }, { params: { user_id: user?.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const onStopPress = async () => {
        if (!props.selectedWashima) return
        closeMenu()
        snackbar({ severity: "warning", text: "Parando instância" })

        try {
            const response = await api.get("/washima/stop-start", { params: { user_id: user?.id, washima_id: props.selectedWashima.id } })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onDeletePress = async () => {
        if (!props.selectedWashima) return
        const washima = { ...props.selectedWashima } as Washima
        closeMenu()

        confirm({
            title: "Deletar Business",
            content: "Tem certeza que deseja deletar essa instância do Business? Essa ação é irreversível.",
            onConfirm: async () => {
                washima.status = "loading"

                props.onWashimaUpdate(washima)
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

        confirm({
            title: "Sincronizar mensagens",
            content: "Este processo pode demorar vários minutos, caso a integração tenha muitas conversas. Prosseguir?",
            onConfirm: async () => {
                if (props.loading || !props.selectedWashima) return
                try {
                    const response = await api.post(
                        "/washima/fetch-messages-whatsappweb",
                        { id: props.selectedWashima.id, options: { groupOnly: false } },
                        { timeout: 0 }
                    )
                    console.log(response.data)
                } catch (error) {
                    console.log(error)
                }
            },
        })
    }

    const deleteMedia = async () => {
        if (props.loading || !props.selectedWashima) return
        const washima_id = props.selectedWashima.id
        closeMenu()

        confirm({
            title: "Deletar mensagens",
            content: "Essa ação é irreversível. Deseja continuar?",
            onConfirm: async () => {
                try {
                    const response = await api.delete("/washima/tools/media", {
                        data: { washima_id: washima_id },
                        params: { user_id: user?.id, company_id: company?.id },
                    })
                    console.log(response.data)
                    props.fetchWashimas()
                } catch (error) {
                    console.log(error)
                }
            },
        })
    }

    const deleteMessages = async () => {
        if (props.loading || !props.selectedWashima) return
        const washima_id = props.selectedWashima.id
        closeMenu()

        confirm({
            title: "Deletar mensagens",
            content: "Essa ação é irreversível. Deseja continuar?",
            onConfirm: async () => {
                try {
                    const response = await api.delete("/washima/tools/messages", {
                        data: { washima_id: washima_id },
                        params: { user_id: user?.id, company_id: company?.id },
                    })
                    console.log(response.data)
                    props.fetchWashimas()
                } catch (error) {
                    console.log(error)
                }
            },
        })
    }

    useEffect(() => {
        setRows((rows) =>
            props.washimas.map((washima) => {
                const row = rows.find((item) => item.id === washima.id)
                return { ...washima, storage_media: row?.storage_media || "", storage_messages: row?.storage_messages || "" }
            })
        )
        props.washimas.forEach((washima) => fetchWashimaMetrics(washima))
    }, [props.washimas])

    useEffect(() => {
        closeMenu()
    }, [])

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
                <MenuItem onClick={onSyncMessages} disabled={!user?.admin || props.selectedWashima?.status !== "ready"}>
                    Sincronizar mensagens
                </MenuItem>
                <MenuItem onClick={deleteMessages} disabled={!user?.admin || props.selectedWashima?.syncing}>
                    Limpar mensagens
                </MenuItem>
                <MenuItem onClick={deleteMedia} disabled={!user?.admin || props.selectedWashima?.syncing}>
                    Limpar mídia
                </MenuItem>
                <MenuItem onClick={onStopPress} disabled={!user?.admin || props.selectedWashima?.status === "stopped"}>
                    Interromper
                </MenuItem>
                <MenuItem onClick={onRestartPress} disabled={!user?.admin}>
                    Reiniciar
                </MenuItem>
                {user?.admin && (
                    <MenuItem onClick={onDeletePress} disabled={!user?.admin}>
                        Deletar
                    </MenuItem>
                )}
                <MenuItem onClick={openAccess} disabled={!user?.admin}>
                    Configurar acessos
                </MenuItem>
            </Menu>

            {props.selectedWashima && (
                <WashimaAccessModal washima={props.selectedWashima} onClose={closeAccess} open={accessModal} onSave={props.onWashimaUpdate} />
            )}
        </Paper>
    )
}

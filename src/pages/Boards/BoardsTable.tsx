import React, { useEffect, useMemo, useRef, useState } from "react"
import { Badge, Box, IconButton, Menu, MenuItem, Paper, SvgIconTypeMap, useMediaQuery } from "@mui/material"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../hooks/useUser"
import {
    DataGrid,
    GridActionsCellItem,
    GridCallbackDetails,
    GridCellEditStopParams,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    GridTreeNode,
    MuiBaseEvent,
    MuiEvent,
} from "@mui/x-data-grid"
import { Delete, Edit, Hub, MoreHoriz, WhatsApp } from "@mui/icons-material"
import { User } from "../../types/server/class/User"
import { Board } from "../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { useNavigate } from "react-router-dom"
import { slugify } from "../../tools/normalize"
import { OverridableComponent } from "@mui/material/OverridableComponent"

interface BoardsTableProps {
    boards: Board[]
    users: User[]
    loading?: boolean
    updateBoard: (
        data: Partial<Board> & {
            id: string
        }
    ) => Promise<void>
    onDeleteBoard: (data: Board) => void
    openBoardSettings: (board: Board) => void
    setSelectedBoard: React.Dispatch<React.SetStateAction<Board | null>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface CustomRow extends WithoutFunctions<Board> {
    chats: number
    roomsCount: number
    unreadCount: number
    syncsCount: { washima: number; nagazap: number }
}

const IntegrationIcon: React.FC<{
    quantity: number
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    }
}> = (props) => {
    const Icon = props.icon
    return (
        <Badge badgeContent={props.quantity} color="primary">
            <Icon color={props.quantity > 0 ? "success" : "disabled"} />
        </Badge>
    )
}

export const BoardsTable: React.FC<BoardsTableProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const isMenu = useRef(false)
    const navigate = useNavigate()

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const rows: CustomRow[] = useMemo(
        () =>
            props.boards.map((board) => ({
                ...board,
                roomsCount: board.rooms.length,
                chats: board.rooms.reduce((total, room) => (total += room.chats.length), 0),
                syncsCount: { washima: board.washima_settings.length, nagazap: board.nagazap_settings.length },
                unreadCount: board.rooms.reduce((total, room) => (total += room.chats.filter((chat) => chat.unread_count > 0).length), 0),
            })),
        [props.boards]
    )

    const columns: (GridColDef & { field: keyof CustomRow | "actions" })[] = [
        {
            field: "syncsCount",
            headerName: "Integração",
            flex: 0.03,
            display: "flex",
            align: "center",
            renderCell: (params) => (
                <Box sx={{ gap: isMobile ? "5vw" : "1vw" }}>
                    <IntegrationIcon quantity={params.value.washima} icon={WhatsApp} />
                    <IntegrationIcon quantity={params.value.nagazap} icon={Hub} />
                </Box>
            ),
            minWidth: isMobile ? 150 : undefined,
        },
        { field: "name", headerName: "Nome", flex: 0.1, minWidth: isMobile ? 150 : undefined },
        { field: "roomsCount", headerName: "Salas", flex: 0.1, minWidth: isMobile ? 150 : undefined },
        { field: "chats", headerName: "Conversas", flex: 0.1, minWidth: isMobile ? 150 : undefined },
        { field: "unreadCount", headerName: "Não respondidas", flex: 0.1, minWidth: isMobile ? 200 : undefined },
        {
            field: "actions",
            type: "actions",
            headerName: "Ações",
            getActions(params) {
                return [
                    // <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                    <GridActionsCellItem
                        label="Editar"
                        showInMenu
                        onClick={() => props.openBoardSettings(params.row)}
                        icon={<Edit />}
                        disabled={!user?.admin}
                    />,
                    <GridActionsCellItem
                        label="Deletar"
                        showInMenu
                        onClick={() => props.onDeleteBoard(params.row)}
                        icon={<Delete />}
                        disabled={!user?.admin}
                    />,
                ]
            },
            minWidth: isMobile ? 150 : undefined,
        },
    ]

    const onRowClick = (params: GridRowParams<Board>) => {
        const board = params.row
        props.setLoading(true)
        props.setSelectedBoard(board)
        setTimeout(() => navigateToBoard(board), 300)
    }

    const onCellEditStop = (cell: GridCellEditStopParams<Board, any, any>, event: MuiEvent<MuiBaseEvent>) => {
        const new_value = (event as unknown as any).target.value as string | undefined
        const old_value = props.boards.find((board) => board.id === cell.row.id)![cell.field as keyof Board]
        if (!new_value || new_value === old_value) {
            return
        } else {
            props.updateBoard({ id: cell.row.id, [cell.field]: new_value })
            snackbar({ severity: "info", text: "salvo" })
        }
    }

    const isCellEditable = (cell: GridCellParams<Board, any, any, GridTreeNode>) => {
        if (!user?.admin) {
            return false
        }

        if (!["name"].includes(cell.field)) {
            return false
        }

        return true
    }
    const navigateToBoard = (board: Board) => {
        navigate(slugify(board.name))
    }

    return (
        <Paper sx={{ flex: 1 }}>
            <DataGrid
                loading={props.loading}
                rows={rows}
                columns={columns}
                initialState={{
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{
                    border: 0,
                    height: "74vh",
                    "& .MuiDataGrid-row": {
                        cursor: "pointer",
                    },
                    "& .MuiDataGrid-overlay .MuiCircularProgress-root": {
                        color: "text.secondary",
                    },
                }}
                onCellEditStop={onCellEditStop}
                isCellEditable={isCellEditable}
                onRowClick={onRowClick}
            />
        </Paper>
    )
}

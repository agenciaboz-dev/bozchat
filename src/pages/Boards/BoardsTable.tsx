import React, { useEffect, useMemo, useRef, useState } from "react"
import { Autocomplete, Box, Chip, IconButton, Menu, MenuItem, Paper, TextField, Tooltip } from "@mui/material"
import { Department } from "../../types/server/class/Department"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../hooks/useUser"
import {
    DataGrid,
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
import { MoreHoriz } from "@mui/icons-material"
import { User } from "../../types/server/class/User"
import { Board } from "../../types/server/class/Board/Board"
import { Room } from "../../types/server/class/Board/Room"
import { WithoutFunctions } from "../../types/server/class/helpers"

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
}

interface CustomRow extends WithoutFunctions<Board> {
    chats: number
    roomsCount: number
    businessSync: boolean
    unreadCount: number
}

export const BoardsTable: React.FC<BoardsTableProps> = (props) => {
    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const isMenu = useRef(false)

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)

    const deleteBoard = () => {
        if (!selectedBoard) return

        props.onDeleteBoard(selectedBoard)
        setMenuAnchor(null)
    }

    const rows: CustomRow[] = useMemo(
        () =>
            props.boards.map((board) => ({
                ...board,
                roomsCount: board.rooms.length,
                chats: board.rooms.reduce((total, room) => (total += room.chats.length), 0),
                businessSync: board.receive_washima_message.length > 0,
                unreadCount: board.rooms.reduce((total, room) => (total += room.chats.filter((chat) => chat.unread_count > 0).length), 0),
            })),
        [props.boards]
    )

    const columns: (GridColDef & { field: keyof CustomRow })[] = [
        {
            field: "businessSync",
            headerName: "Sincronizado",
            flex: 0.04,
            display: "flex",
            align: "center",
            renderCell: (params) => (
                <Paper
                    elevation={5}
                    sx={{ width: "1vw", height: "1vw", bgcolor: params.value ? "success.main" : "error.main", borderRadius: "100%" }}
                />
            ),
        },
        { field: "name", headerName: "Nome", flex: 0.1, editable: user?.admin },
        { field: "roomsCount", headerName: "Salas", flex: 0.1 },
        { field: "chats", headerName: "Conversas", flex: 0.1 },
        { field: "unreadCount", headerName: "Não respondidas", flex: 0.1 },

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
        },
    ]

    const onActionsButtonPress = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        isMenu.current = true
        setMenuAnchor(ev.currentTarget)
    }

    const closeMenu = () => {
        setMenuAnchor(null)
        isMenu.current = false
    }

    const navigateToBoard = (board: Board) => {
        console.log(`navegar para o quadro ${board.name}`)
    }

    const onRowClick = (params: GridRowParams<Board>) => {
        const board = params.row
        if (board.id === selectedBoard?.id) {
            navigateToBoard(board)
        } else {
            setSelectedBoard(board)
        }
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

    const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
        if (rowSelectionModel.length === 0) return
        console.log(rowSelectionModel[0])
        const selected_department = props.boards.find((department) => department.id === rowSelectionModel[0])
        if (selected_department) {
            setSelectedBoard(selected_department)
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

    useEffect(() => {
        if (selectedBoard && !isMenu.current) {
            navigateToBoard(selectedBoard)
        }
    }, [selectedBoard])

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
                    "& .MuiDataGrid-cell": {
                        color: "secondary.main",
                        cursor: "pointer",
                    },
                }}
                onCellEditStop={onCellEditStop}
                onRowSelectionModelChange={onRowSelectionModelChange}
                isCellEditable={isCellEditable}
                onRowClick={onRowClick}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                <MenuItem onClick={deleteBoard} disabled={!user?.admin}>
                    Deletar
                </MenuItem>
            </Menu>
        </Paper>
    )
}

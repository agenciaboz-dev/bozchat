import React, { useMemo, useRef, useState } from "react"
import { Autocomplete, Box, Chip, IconButton, Menu, MenuItem, Paper, TextField, Tooltip } from "@mui/material"
import { Department } from "../../types/server/class/Department"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../hooks/useUser"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
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
    const newUsersValue = useRef<User[] | null>(null)

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
                unreadCount: board.rooms.reduce((total, room) => (total += room.chats.filter(chat => chat.unread_count > 0).length), 0),
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
                    <IconButton onClick={(ev) => setMenuAnchor(ev.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>
                )
            },
            align: "center",
            sortable: false,
            filterable: false,
        },
    ]

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
                sx={{ border: 0, height: "74vh" }}
                // slots={{ filterPanel: () => <GridFilterPanel /> }}
                onCellEditStop={(cell, event) => {
                    const new_value = newUsersValue.current || ((event as unknown as any).target.value as string | undefined)
                    const old_value = props.boards.find((board) => board.id === cell.row.id)![cell.field as keyof Board]
                    if (!new_value || new_value === old_value) {
                        return
                    } else {
                        props.updateBoard({ id: cell.row.id, [cell.field]: new_value })
                        newUsersValue.current = null
                        snackbar({ severity: "info", text: "salvo" })
                    }
                }}
                onRowSelectionModelChange={(params) => {
                    if (params.length === 0) return
                    console.log(params[0])
                    const selected_department = props.boards.find((department) => department.id === params[0])
                    if (selected_department) {
                        setSelectedBoard(selected_department)
                    }
                }}
                isCellEditable={(cell) => {
                    if (!user?.admin) {
                        return false
                    }

                    if (!["name"].includes(cell.field)) {
                        return false
                    }

                    return true
                }}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                <MenuItem onClick={deleteBoard} disabled={!user?.admin}>
                    Deletar
                </MenuItem>
            </Menu>
        </Paper>
    )
}

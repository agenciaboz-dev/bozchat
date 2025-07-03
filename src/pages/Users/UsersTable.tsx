import React, { useRef, useState } from "react"
import { Autocomplete, IconButton, Menu, MenuItem, Paper, TextField, useMediaQuery } from "@mui/material"
import { User } from "../../types/server/class/User"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { AdminPanelSettings, Circle, MoreHoriz } from "@mui/icons-material"
import { useClipboard } from "@mantine/hooks"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../hooks/useUser"
import { Department } from "../../types/server/class/Department"
import { textFieldStyle } from "../../style/textfield"

interface UsersTableProps {
    users: User[]
    departments: Department[]
    loading?: boolean
    updateUser: (data: Partial<User> & { id: string }) => void
    onDeleteUser: (user: User) => void
}

export const UsersTable: React.FC<UsersTableProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const clipboard = useClipboard({ timeout: 1000 })
    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const newDepartmentsValue = useRef<Department[] | null>(null)

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const copyId = () => {
        clipboard.copy(selectedUser?.id)
        snackbar({ severity: "success", text: "copiado" })
        setMenuAnchor(null)
    }

    const deleteUser = () => {
        if (!selectedUser) return

        props.onDeleteUser(selectedUser)
        setMenuAnchor(null)
    }

    const columns: (GridColDef & { field: keyof User })[] = [
        {
            field: "active",
            headerName: "Ativo",
            disableColumnMenu: true,
            renderCell: (cell) => {
                const active = !!cell.value

                return (
                    <IconButton
                        sx={{ width: 40 }}
                        disabled={!user?.admin || cell.row.owner || cell.row.id === user?.id}
                        onClick={() => props.updateUser({ id: cell.row.id, active: !active })}
                    >
                        <Circle color={active ? "success" : "disabled"} sx={{ width: 15 }} />
                    </IconButton>
                )
            },
            flex: 0.03,
            align: "center",
            minWidth: isMobile ? 100 : undefined,
        },
        {
            field: "admin",
            headerName: "Admin",
            disableColumnMenu: true,
            renderCell: (cell) => {
                const admin = !!cell.value

                return (
                    <IconButton
                        sx={{ width: 40 }}
                        disabled={!user?.admin || cell.row.owner || cell.row.id === user?.id}
                        onClick={() => props.updateUser({ id: cell.row.id, admin: !admin })}
                    >
                        <AdminPanelSettings color={admin ? "warning" : "disabled"} sx={{ width: 40 }} />
                    </IconButton>
                )
            },
            flex: 0.035,
            align: "center",
            minWidth: isMobile ? 100 : undefined,
        },
        { field: "name", headerName: "Nome", flex: 0.15, editable: user?.admin, minWidth: isMobile ? 200 : undefined },
        { field: "email", headerName: "E-mail", flex: 0.15, editable: user?.admin, minWidth: isMobile ? 200 : undefined },
        {
            field: "password",
            headerName: "Senha",
            flex: 0.1,
            sortable: false,
            filterable: false,
            valueFormatter: () => "***************",
            editable: user?.admin,
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "departments",
            headerName: "Setores",
            flex: 0.12,
            editable: user?.admin,
            valueFormatter: (value: Department[]) => value.map((item) => item.name).join(", "),
            renderEditCell: (params) => {
                return (
                    <Autocomplete
                        options={props.departments}
                        renderInput={(props) => <TextField {...props} label="Setores" variant="standard" />}
                        getOptionLabel={(option) => option.name}
                        value={params.row.departments}
                        fullWidth
                        open
                        multiple
                        onChange={(_, newValue) => {
                            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })
                            newDepartmentsValue.current = newValue
                        }}
                        disableCloseOnSelect
                        renderTags={(value) => ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                )
            },
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "id",
            headerName: "Ações",
            renderCell: (cell) => {
                return (
                    <IconButton onClick={(ev) => setMenuAnchor(ev.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>
                )
            },
            align: "center",
            sortable: false,
            filterable: false,
            minWidth: isMobile ? 100 : undefined,
        },
    ]

    return (
        <Paper sx={{ flex: 1, marginTop: isMobile ? "5vw" : undefined }}>
            <DataGrid
                loading={props.loading}
                rows={props.users}
                columns={columns}
                initialState={{
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{ border: 0, height: "auto" }}
                // slots={{ filterPanel: () => <GridFilterPanel /> }}
                onCellEditStop={(cell, event) => {
                    const new_value = newDepartmentsValue.current || ((event as unknown as any).target.value as string | undefined)
                    const old_value = props.users.find((user) => user.id === cell.row.id)![cell.field as keyof User]
                    console.log({ new_value, cell })
                    if (!new_value || new_value === old_value) {
                        return
                    } else {
                        props.updateUser({ id: cell.row.id, [cell.field]: new_value })
                        newDepartmentsValue.current = null
                        snackbar({ severity: "info", text: "salvo" })
                    }
                }}
                onRowSelectionModelChange={(params) => {
                    if (params.length === 0) return
                    console.log(params[0])
                    const selected_user = props.users.find((user) => user.id === params[0])
                    if (selected_user) {
                        setSelectedUser(selected_user)
                    }
                }}
                isCellEditable={(cell) => {
                    if (cell.row.owner && user?.owner) {
                        return true
                    }

                    if (!user?.admin || cell.row.owner) {
                        return false
                    }

                    if (!["name", "email", "password", "departments"].includes(cell.field)) {
                        return false
                    }

                    return true
                }}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                <MenuItem onClick={copyId}>Copiar ID</MenuItem>
                {user?.admin && (
                    <MenuItem onClick={deleteUser} disabled={selectedUser?.id === user?.id || selectedUser?.owner}>
                        Deletar
                    </MenuItem>
                )}
            </Menu>
        </Paper>
    )
}

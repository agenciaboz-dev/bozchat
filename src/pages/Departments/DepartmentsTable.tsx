import React, { useRef, useState } from "react"
import { Autocomplete, Box, Chip, IconButton, Menu, MenuItem, Paper, TextField, Tooltip } from "@mui/material"
import { Department } from "../../types/server/class/Department"
import { useSnackbar } from "burgos-snackbar"
import { useUser } from "../../hooks/useUser"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { MoreHoriz } from "@mui/icons-material"
import { User } from "../../types/server/class/User"

interface DepartmentsTableProps {
    departments: Department[]
    users: User[]
    loading?: boolean
    updateDepartment: (
        data: Partial<Department> & {
            id: string
        }
    ) => Promise<void>
    onDeleteDepartment: (data: Department) => void
}

export const DepartmentsTable: React.FC<DepartmentsTableProps> = (props) => {
    const { snackbar } = useSnackbar()
    const { user } = useUser()
    const newUsersValue = useRef<User[] | null>(null)

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

    const deleteDepartment = () => {
        if (!selectedDepartment) return

        props.onDeleteDepartment(selectedDepartment)
        setMenuAnchor(null)
    }

    const columns: (GridColDef & { field: keyof Department })[] = [
        { field: "name", headerName: "Nome", flex: 0.6, editable: user?.admin },
        {
            field: "users",
            headerName: "Usuários",
            flex: 0.4,
            editable: user?.admin,
            valueFormatter: (value: User[]) => value.map((user) => user.name).join(", "),
            renderEditCell: (params) => {
                return (
                    <Autocomplete
                        options={props.users}
                        renderInput={(props) => <TextField {...props} label="Usuários" variant="standard" />}
                        getOptionLabel={(option) => option.name}
                        value={params.row.users}
                        fullWidth
                        open
                        multiple
                        onChange={(_, newValue) => {
                            params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue })
                            newUsersValue.current = newValue
                        }}
                        disableCloseOnSelect
                        renderTags={(value) => ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                )
            },
        },

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
                rows={props.departments}
                columns={columns}
                initialState={{
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{ border: 0, height: "74vh" }}
                // slots={{ filterPanel: () => <GridFilterPanel /> }}
                onCellEditStop={(cell, event) => {
                    const new_value = newUsersValue.current || (event as unknown as any).target.value as string | undefined
                    const old_value = props.departments.find((department) => department.id === cell.row.id)![cell.field as keyof Department]
                    if (!new_value || new_value === old_value) {
                        return
                    } else {
                        props.updateDepartment({ id: cell.row.id, [cell.field]: new_value })
                        newUsersValue.current = null
                        snackbar({ severity: "info", text: "salvo" })
                    }
                }}
                onRowSelectionModelChange={(params) => {
                    if (params.length === 0) return
                    console.log(params[0])
                    const selected_department = props.departments.find((department) => department.id === params[0])
                    if (selected_department) {
                        setSelectedDepartment(selected_department)
                    }
                }}
                isCellEditable={(cell) => {
                    if (!user?.admin) {
                        return false
                    }

                    if (!["name", 'users'].includes(cell.field)) {
                        return false
                    }

                    return true
                }}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                <MenuItem onClick={deleteDepartment} disabled={!user?.admin}>
                    Deletar
                </MenuItem>
            </Menu>
        </Paper>
    )
}

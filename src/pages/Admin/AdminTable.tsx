import React, { useState } from "react"
import { IconButton, Menu, MenuItem, Paper, Switch } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { AdminCompany } from "../../types/server/class/Company"
import { Circle, Send } from "@mui/icons-material"
import { useUser } from "../../hooks/useUser"
import { useNavigate } from "react-router-dom"
import { useConfirmDialog } from "burgos-confirm"

interface AdminTableProps {
    loading?: boolean
    companies: AdminCompany[]
    updateCompany: (data: Partial<AdminCompany> & { id: string }) => void
}

export const AdminTable: React.FC<AdminTableProps> = (props) => {
    const { onLogin, user } = useUser()
    const { confirm } = useConfirmDialog()
    const navigate = useNavigate()
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const columns: (GridColDef & { field: keyof AdminCompany })[] = [
        {
            field: "active",
            headerName: "Ativo",
            disableColumnMenu: true,
            renderCell: (cell) => {
                const active = !!cell.value

                return (
                    <IconButton
                        sx={{ width: 40 }}
                        onClick={() => {
                            if (active) {
                                confirm({
                                    title: "Desativar cliente",
                                    content: "Esta ação irá desativar este cliente. Prosseguir?",
                                    onConfirm: () => props.updateCompany({ id: cell.row.id, active: false }),
                                })
                            } else {
                                props.updateCompany({ id: cell.row.id, active: true })
                            }
                        }}
                    >
                        <Circle color={active ? "success" : "disabled"} sx={{ width: 15 }} />
                    </IconButton>
                )
            },
            flex: 0.05,
            align: "center",
        },
        { field: "business_name", headerName: "Nome Fantasia", flex: 0.2 },
        { field: "full_name", headerName: "Razão Social", flex: 0.2 },
        { field: "document", headerName: "CNPJ", flex: 0.1 },
        { field: "usersCount", headerName: "Usuários", flex: 0.05 },
        { field: "washimaCount", headerName: "Business", flex: 0.05 },
        { field: "nagazapCount", headerName: "Broadcast", flex: 0.05 },
        {
            field: "getBots",
            headerName: "Bots",
            flex: 0.05,
            renderCell: () => <Switch checked />,
        },
        {
            field: "getLogs",
            headerName: "Quadros",
            flex: 0.05,
            renderCell: () => <Switch checked />,
        },
        { field: "diskUsed", headerName: "Armazenamento", flex: 0.08 },
        {
            field: "id",
            headerName: "Acessar",
            renderCell: (cell) => {
                return (
                    <IconButton
                        onClick={() => {
                            onLogin({ company: cell.row, user: user! })
                            navigate("/")
                        }}
                    >
                        <Send />
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
                rows={props.companies}
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
                }}
                // onCellEditStop={onCellEditStop}
                // onRowSelectionModelChange={onRowSelectionModelChange}
                // isCellEditable={isCellEditable}
                // onRowClick={onRowClick}
            />

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                <MenuItem>Acessar</MenuItem>
                <MenuItem>Deletar</MenuItem>
            </Menu>
        </Paper>
    )
}

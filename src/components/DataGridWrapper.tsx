import { useState } from "react"
import { DataGrid, DataGridProps, GridRenderCellParams, GridColDef } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

export const DataGridWrapper = (props: DataGridProps) => {
    const [editingCell, setEditingCell] = useState<{ id: string | number; field: string } | null>(null)
    const [hoveredCell, setHoveredCell] = useState<{ id: string | number; field: string } | null>(null)
    const { onCellEditStart, onCellEditStop, ...otherProps } = props

    const processedColumns = props.columns.map((column) => {
        const originalRenderCell = (column as GridColDef).renderCell

        return {
            ...column,
            renderCell: (params: GridRenderCellParams) => {
                const isEditable = props.isCellEditable ? props.isCellEditable(params) : column.editable
                const isEditing = editingCell?.id === params.id && editingCell?.field === params.field
                const isHovered = hoveredCell?.id === params.id && hoveredCell?.field === params.field
                const showEditHint = isEditable && !isEditing && isHovered
                const cellStyle = {
                    justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start",
                }

                return (
                    <Box
                        onMouseEnter={() => setHoveredCell({ id: params.id, field: params.field })}
                        onMouseLeave={() => setHoveredCell(null)}
                        sx={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Box sx={{ flex: 1, overflow: "hidden", ...cellStyle }}>
                            {originalRenderCell ? originalRenderCell(params) : params.formattedValue}
                        </Box>
                        {showEditHint && (
                            <Box
                                sx={{
                                    gap: 1,
                                    fontSize: "1rem",
                                    color: "text.secondary",
                                    opacity: 0.5,
                                    position: "relative",
                                }}
                            >
                                <Typography
                                    sx={{
                                        marginRight: 4,
                                        cursor: "default",
                                    }}
                                >
                                    Clique duplo para editar
                                </Typography>
                                <EditIcon
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 4,
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )
            },
        }
    })

    return (
        <DataGrid
            {...otherProps}
            columns={processedColumns}
            onCellEditStart={(params, event, details) => {
                setEditingCell({ id: params.id, field: params.field })
                if (onCellEditStart) onCellEditStart(params, event, details)
            }}
            onCellEditStop={(params, event, details) => {
                setEditingCell(null)
                if (onCellEditStop) onCellEditStop(params, event, details)
            }}
        />
    )
}

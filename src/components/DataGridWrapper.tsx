import { useState, useEffect, useRef } from "react"
import { DataGrid, DataGridProps, GridRenderCellParams, GridColDef } from "@mui/x-data-grid"
import { Box, ClickAwayListener, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

export const DataGridWrapper = (props: DataGridProps) => {
    const [editingCell, setEditingCell] = useState<{ id: string | number; field: string } | null>(null)
    const [selectedCell, setSelectedCell] = useState<{ id: string | number; field: string } | null>(null)
    // const timeoutRef = useRef<number | null>(null)
    const gridWrapperRef = useRef<HTMLDivElement>(null)

    const handleCellClick = (params: any) => {
        // if (timeoutRef.current) {
        //     clearTimeout(timeoutRef.current)
        // }
        
        setSelectedCell({ id: params.id, field: params.field })
        
        // timeoutRef.current = window.setTimeout(() => {
        //     setSelectedCell(null)
        // }, 2000)
    }

    const handleClickAway = () => {
        setSelectedCell(null)
        // if (timeoutRef.current) {
        //     clearTimeout(timeoutRef.current)
        //     timeoutRef.current = null
        // }
    }

    const processedColumns = props.columns.map((column) => {
        const originalRenderCell = (column as GridColDef).renderCell

        return {
            ...column,
            renderCell: (params: GridRenderCellParams) => {
                const isEditable = props.isCellEditable ? props.isCellEditable(params) : column.editable
                const isEditing = editingCell?.id === params.id && editingCell?.field === params.field
                const isSelected = selectedCell?.id === params.id && selectedCell?.field === params.field
                const cellStyle = {
                    justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start",
                }

                return (
                    <Box sx={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                    }}>
                        <Box sx={{ flex: 1, overflow: "hidden", ...cellStyle }}>
                            {originalRenderCell ? originalRenderCell(params) : params.formattedValue}
                        </Box>
                        {isEditable && isSelected && !isEditing && (
                            <Box sx={{
                                gap: 1,
                                fontSize: "1rem",
                                color: "text.secondary",
                                opacity: 0.5,
                                position: "relative"
                            }}>
                                <Typography sx={{
                                    marginRight: 4,
                                    cursor: "default"
                                }}>Clique duplo para editar</Typography>
                                <EditIcon
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 4
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )
            }
        }
    })

    useEffect(() => {
        const handleGridClick = (e: MouseEvent) => {
            if (!gridWrapperRef.current) return
            
            const cellElement = (e.target as Element).closest(".MuiDataGrid-cell")
            if (cellElement) return
            
            handleClickAway()
        }
        const gridElement = gridWrapperRef.current
        if (gridElement) {
            gridElement.addEventListener("click", handleGridClick)
        }

        return () => {
            if (gridElement) {
                gridElement.removeEventListener("click", handleGridClick)
            }

            // if (timeoutRef.current) {
            //     clearTimeout(timeoutRef.current)
            // }
        }
    }, [])
    
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box
                ref={gridWrapperRef}
                sx={{ 
                    height: "100%", 
                    width: "100%",
                    overflow: "hidden"
                }}
            >
                <DataGrid
                    {...props}
                    columns={processedColumns}
                    onCellClick={handleCellClick}
                    onCellEditStart={(params) => {
                        // if (timeoutRef.current) {
                        //     clearTimeout(timeoutRef.current)
                        // }
                        setEditingCell({ id: params.id, field: params.field })
                    }}
                    onCellEditStop={() => {
                        setEditingCell(null)
                        setSelectedCell(null)
                    }}
                />
            </Box>
        </ClickAwayListener>
    )
}
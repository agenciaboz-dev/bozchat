import React from "react"
import { Box, CircularProgress, IconButton, LinearProgress, Paper } from "@mui/material"
import { Delete } from "@mui/icons-material"

interface DiskMetricContainerProps {
    label: string
    value?: number
    max_value?: number
    onDeletePress?: () => void
    deleting?: boolean
}

export const DiskMetricContainer: React.FC<DiskMetricContainerProps> = ({ label, value, onDeletePress, deleting, max_value = 100 }) => {
    const progress_value = ((value || 0) * 100) / max_value

    console.log(progress_value)

    return (
        <Paper sx={{ padding: "1vw", gap: "1vw", flex: 1, flexDirection: "column" }}>
            <Box sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    {label}: {value !== undefined ? `${value.toFixed(2)} Mb` : null}
                </Box>
                {onDeletePress && (
                    <IconButton onClick={onDeletePress} sx={{ padding: 0 }}>
                        {deleting ? <CircularProgress size={"1.5rem"} color="warning" /> : <Delete />}
                    </IconButton>
                )}
            </Box>
            <LinearProgress value={progress_value} variant={value === undefined ? "indeterminate" : "determinate"} />
        </Paper>
    )
}

import React from "react"
import { Box, Chip } from "@mui/material"
import { Engineering, Replay } from "@mui/icons-material"

interface TodoChipProps {}

export const TodoChip: React.FC<TodoChipProps> = ({}) => {
    return (
        <Chip
            sx={{
                padding: "0.5vw",
                height: "auto",
                "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                },
            }}
            label={`em desenvolvimento`}
            color="warning"
            icon={<Engineering />}
        />
    )
}

export const ErrorChip: React.FC<TodoChipProps> = ({}) => {
    return (
        <Chip
            sx={{
                padding: "0.5vw",
                height: "auto",
                "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                },
            }}
            label={`tentar novamente`}
            color="error"
            icon={<Replay />}
        />
    )
}

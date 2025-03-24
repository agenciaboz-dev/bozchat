import React from "react"
import { Box, Chip } from "@mui/material"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"

interface DateChipProps {
    timestamp: number
}

export const DateChip: React.FC<DateChipProps> = ({ timestamp }) => {
    const formatTime = useFormatMessageTime()

    return (
        <Chip
            label={formatTime(new Date(timestamp), "date-only")}
            sx={{
                width: "fit-content",
                alignSelf: "center",
                margin: "2vw 0",
                fontSize: "0.8rem",
                padding: "1vw",
                color: "text.secondary",
            }}
        />
    )
}

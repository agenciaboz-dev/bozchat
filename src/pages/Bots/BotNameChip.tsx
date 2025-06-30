import React from "react"
import { Box, Chip, Tooltip, useMediaQuery } from "@mui/material"
import { Android } from "@mui/icons-material"

interface BotNameChipProps {
    name: string
}

export const BotNameChip: React.FC<BotNameChipProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Tooltip title={props.name} arrow placement="left">
            <Box sx={{ marginBottom: isMobile ? "2vw" : "0.5vw" }}>
                <Chip
                    label={props.name}
                    icon={<Android />}
                    size="small"
                    color="success"
                    sx={{
                        // marginBottom: "0.5vw",
                        "& .MuiChip-label": {
                            whiteSpace: "nowrap",
                            maxWidth: isMobile ? "33vw" : "6vw",
                            textOverflow: "ellipsis",
                        },
                    }}
                />
            </Box>
        </Tooltip>
    )
}

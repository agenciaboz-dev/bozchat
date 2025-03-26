import React from "react"
import { Box, Chip, Tooltip, Typography } from "@mui/material"
import { Hub, WhatsApp } from "@mui/icons-material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Nagazap } from "../../types/server/class/Nagazap"

interface IntegrationChipProps {
    washima?: Washima
    nagazap?: Nagazap
}

export const IntegrationChip: React.FC<IntegrationChipProps> = (props) => {
    const Icon = props.washima ? <WhatsApp color="success" /> : <Hub color="success" />
    const name = props.washima ? props.washima.name : props.nagazap?.displayName

    return (
        <Tooltip
            arrow
            title={
                <Box>
                    <Typography sx={{ fontSize: "0.8rem" }}>
                        recebendo novas mensagens de{" "}
                        <Typography sx={{ color: "success.main", display: "inline", fontWeight: "bold", alignItems: "center" }}>{name}</Typography>{" "}
                        nesta sala
                    </Typography>
                </Box>
            }
        >
            <Chip icon={Icon} label={name} size="small" sx={{ color: "success.main" }} />
        </Tooltip>
    )
}

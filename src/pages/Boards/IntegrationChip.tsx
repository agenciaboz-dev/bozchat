import React from "react"
import { Box, Chip, CircularProgress, Tooltip, Typography } from "@mui/material"
import { Hub, WhatsApp } from "@mui/icons-material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Nagazap } from "../../types/server/class/Nagazap"

interface IntegrationChipProps {
    washima?: Washima
    nagazap?: Nagazap
    chatVariant?: boolean
}

export const IntegrationChip: React.FC<IntegrationChipProps> = (props) => {
    const Icon = props.washima ? (
        <WhatsApp color={props.washima?.status === "stopped" ? "error" : "success"} />
    ) : props.nagazap ? (
        <Hub color="success" />
    ) : (
        <CircularProgress size={"1rem"} color="primary" sx={{}} />
    )
    const name = props.washima ? props.washima.name : props.nagazap?.displayName

    const IntegrationName = () => (
        <Typography sx={{ color: "success.main", display: "inline", fontWeight: "bold", alignItems: "center" }}>{name}</Typography>
    )

    return (
        <Tooltip
            arrow
            title={
                <Box>
                    {props.chatVariant ? (
                        <Typography sx={{ fontSize: "0.8rem" }}>
                            Conversa de <IntegrationName />
                        </Typography>
                    ) : props.washima?.status === "stopped" ? (
                        <Typography sx={{ fontSize: "0.8rem" }}>Esta instância do Business está desativada.</Typography>
                    ) : (
                        <Typography sx={{ fontSize: "0.8rem" }}>
                            Recebendo novas mensagens de <IntegrationName /> nesta sala
                        </Typography>
                    )}
                </Box>
            }
        >
            <Chip
                icon={Icon}
                label={name}
                size="small"
                sx={{ color: props.washima?.status === "stopped" ? "error.main" : "success.main", overflow: "hidden" }}
            />
        </Tooltip>
    )
}

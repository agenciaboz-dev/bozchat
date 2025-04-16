import React from "react"
import { Box, CircularProgress, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { QrCodeScanner } from "@mui/icons-material"

export interface WashimaSidebarProps {
    washimas: Washima[]
    currentWashima: Washima | null
    onClick: (washima: Washima) => void
}

export const WashimaSidebar: React.FC<WashimaSidebarProps> = (props) => {
    const isMobile = useMediaQuery('(orientation: portrait)')
    return (
        <Paper
            sx={{
                flex: isMobile ? 1 : 0.1,
                flexDirection: "column",
                alignItems: "center",
                padding: isMobile ? "5vw" : "2vw",
            }}
        >
            {props.washimas
                .sort((a, b) => Number(b.created_at) - Number(a.created_at))
                .map((item) => {
                    const active = props.currentWashima?.id === item.id
                    return (
                        <MenuItem
                            key={item.id}
                            sx={{
                                width: 1,
                                margin: "0 -2vw",
                                flexShrink: 0,
                                outline: active ? "1px solid" : "",
                                borderRadius: "0.3vw",
                                justifyContent: "space-between",
                            }}
                            onClick={() => {
                                props.onClick(item)
                            }}
                        >
                            <Typography
                                style={{
                                    maxWidth: "calc(100% - 1.5vw)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {item.name}
                            </Typography>
                            {item.status === 'loading' && <CircularProgress size="1rem" color="warning" />}
                            {item.status === 'qrcode' && <QrCodeScanner color="warning" sx={{ width: isMobile ? "7vw" : "1.3vw", height: isMobile ? "7vw" : "1.3vw" }} />}
                        </MenuItem>
                    )
                })}
        </Paper>
    )
}

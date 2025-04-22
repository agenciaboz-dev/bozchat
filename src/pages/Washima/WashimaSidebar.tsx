import React from "react"
import { Box, CircularProgress, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Circle, QrCodeScanner } from "@mui/icons-material"
import { phoneMask } from "../../tools/masks"

export interface WashimaSidebarProps {
    washimas: Washima[]
    currentWashima: Washima | null
    onClick: (washima: Washima) => void
}

export const WashimaSidebar: React.FC<WashimaSidebarProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Paper
            sx={{
                flex: isMobile ? 1 : undefined,
                flexDirection: "column",
                alignItems: "center",
                padding: isMobile ? "5vw" : "0vw",
                height: "75vh",
                width: "15vw",
                overflowY: "auto",
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
                                width: "15vw",
                                flexShrink: 0,
                                borderRadius: "0.3vw",
                                justifyContent: "space-between",
                                whiteSpace: "normal",
                                padding: 0,
                            }}
                            onClick={() => {
                                props.onClick(item)
                            }}
                            disabled={item.status !== "ready"}
                        >
                            <Paper elevation={active ? 2 : 0} sx={{ padding: "1vw", flex: 1, flexDirection: "column" }}>
                                <Typography
                                    sx={{
                                        maxWidth: "13vw",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color: "secondary.main", fontSize: "0.8rem" }}>{phoneMask.format(item.number)}</Typography>
                                    {item.status === "ready" && (
                                        <Paper sx={{ borderRadius: "100%" }}>
                                            <Circle fontSize="small" color="success" />
                                        </Paper>
                                    )}
                                    {item.status === "loading" && <CircularProgress size="1.2rem" color="warning" />}
                                    {item.status === "qrcode" && <QrCodeScanner color="secondary" fontSize="small" />}
                                </Box>
                            </Paper>
                        </MenuItem>
                    )
                })}
        </Paper>
    )
}

import React from "react"
import { Box, CircularProgress, MenuItem, Paper, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Circle, QrCodeScanner } from "@mui/icons-material"
import { phoneMask } from "../../tools/masks"
import { QRCode } from "react-qrcode-logo"

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
                width: "15vw",
                overflowY: "auto",
            }}
        >
            {props.washimas
                .sort((a, b) => Number(b.created_at) - Number(a.created_at))
                .map((item) => {
                    const active = props.currentWashima?.id === item.id
                    return (
                        <Tooltip title={item.status === "qrcode" ? <QRCode value={item.qrcode} size={250} /> : null} arrow placement="right">
                            <MenuItem
                                key={item.id}
                                sx={{
                                    width: "15vw",
                                    flexShrink: 0,
                                    borderRadius: "0.3vw",
                                    justifyContent: "space-between",
                                    whiteSpace: "normal",
                                    padding: 0,
                                    backgroundColor: active ? "action.hover" : undefined,
                                }}
                                onClick={() => {
                                    if (item.status !== "ready") return
                                    props.onClick(item)
                                }}
                                // disabled={item.status !== "ready"}
                                disableRipple={item.status !== "ready"}
                            >
                                <Paper elevation={active ? 2 : 1} sx={{ padding: "1vw", flex: 1, flexDirection: "column" }}>
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
                                        <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>{phoneMask.format(item.number)}</Typography>
                                        {item.status === "ready" && (
                                            <Paper sx={{ borderRadius: "100%" }}>
                                                <Circle fontSize="small" color="success" />
                                            </Paper>
                                        )}
                                        {item.status === "loading" && <CircularProgress size="1.2rem" color="warning" />}
                                        {item.status === "qrcode" && <QrCodeScanner color="action" fontSize="small" />}
                                    </Box>
                                </Paper>
                            </MenuItem>
                        </Tooltip>
                    )
                })}
        </Paper>
    )
}

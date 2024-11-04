import React from "react"
import { Box, Skeleton } from "@mui/material"
import { QRCode } from "react-qrcode-logo"

interface QrCodeProps {
    qrcode: string
}

export const QrCode: React.FC<QrCodeProps> = ({ qrcode }) => {
    const vw = window.innerWidth / 100
    return (
        <Box sx={{ flexDirection: "column", alignItems: "center", gap: "2vw", padding: "2vw", color: "text.secondary" }}>
            <p>whatsapp não conectado, {!!qrcode ? "escaneie o qrcode" : "carregando qrcode"}</p>
            {!!qrcode ? (
                <QRCode value={qrcode} size={30 * vw} />
            ) : (
                <Skeleton variant="rounded" sx={{ width: "30vw", height: "30vw" }} animation="wave" />
            )}
        </Box>
    )
}

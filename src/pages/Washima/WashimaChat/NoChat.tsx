import React from "react"
import { Box, Paper } from "@mui/material"
import { WhatsappWebSvg } from "../WhatsappWebSvg"
import { Lock } from "@mui/icons-material"

interface NoChatProps {}

export const NoChat: React.FC<NoChatProps> = ({}) => {
    return (
        <Paper
            sx={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1vw",
                color: "text.secondary",
                padding: "1vw",
            }}
        >
            <WhatsappWebSvg />
            <Box sx={{ fontSize: "2rem" }}>Whatsapp Web</Box>
            <Box>Envie e receba mensagens sem precisar do celular conectado a conta.</Box>
            <Box>Use o WhatsApp em quantos dispositivos quiser, ao mesmo tempo.</Box>

            <Box sx={{ position: "absolute", bottom: 0, gap: "0.5vw", paddingBottom: "1vw", alignItems: "center" }}>
                <Lock sx={{ width: "0.7vw", height: "0.7vw" }} />
                <Box fontSize={"0.8rem"}>Suas mensagens são protegidas no nosso banco de dados.</Box>
            </Box>
        </Paper>
    )
}

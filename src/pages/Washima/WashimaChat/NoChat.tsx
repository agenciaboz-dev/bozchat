import React from "react"
import { Box, Paper } from "@mui/material"
import { WhatsappWebSvg } from "../WhatsappWebSvg"
import { Lock } from "@mui/icons-material"

interface NoChatProps {
    nagazap?: boolean
}

export const NoChat: React.FC<NoChatProps> = ({ nagazap }) => {
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
            <Box sx={{ fontSize: "2rem" }}>WhatsApp {nagazap ? "Broadcast" : "Business"}</Box>
            <Box>Envie mensagens em massa a partir de uma planilha de contatos.</Box>
            <Box>Você pode enviar templates pré-aprovados ou responder conversas.</Box>

            <Box
                sx={{
                    position: nagazap ? undefined : "absolute",
                    bottom: 0,
                    gap: "0.5vw",
                    paddingBottom: "1vw",
                    alignItems: "center",
                    marginTop: nagazap ? "3vw" : undefined,
                    marginBottom: nagazap ? "-3vw" : undefined,
                }}
            >
                <Lock sx={{ width: "0.7vw", height: "0.7vw" }} />
                <Box fontSize={"0.8rem"}>Suas mensagens são protegidas no nosso banco de dados.</Box>
            </Box>
        </Paper>
    )
}

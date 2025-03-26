import React from "react"
import { Box, Paper, useMediaQuery } from "@mui/material"
import { WhatsappForm } from "../../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Title2 } from "../../../components/Title"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface BatchProps {
    batch: WhatsappForm[]
    nagazap?: Nagazap
    index: number
}

export const Batch: React.FC<BatchProps> = ({ batch, nagazap, index }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    return nagazap ? (
        <Paper sx={{ flexDirection: "column", padding: "1vw", gap: "1vw", height: "100%", opacity: nagazap.paused ? 0.4 : 1 }}>
            <Title2
                name={`${index + 1}`}
                center
                right={
                    nagazap.paused ? null : (
                        <Box sx={{ fontSize: "0.9rem" }}>
                            {new Date(Number(nagazap.lastMessageTime) + Number(nagazap.frequency) * 60 * 1000 * (index + 1)).toLocaleString("pt-br")}
                        </Box>
                    )
                }
            />

            <Box sx={{ flexDirection: "column" }}>
                {batch.map((message, index) => (
                    <Box key={index + message.number} sx={{ color: "text.secondary", justifyContent: "space-between" }}>
                        {message.number}
                        <Box
                            sx={{
                                fontSize: "0.75rem",
                                alignSelf: "flex-end",
                                opacity: darkMode ? 0.5 : 1,
                                width: isMobile ? undefined : "7vw",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                justifyContent: "flex-end",
                            }}
                            title={message.template}
                        >
                            {message.template}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    ) : null
}

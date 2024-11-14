import React from "react"
import { Box, Paper } from "@mui/material"
import { WhatsappForm } from "../../../types/server/Meta/WhatsappBusiness/WhatsappForm"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Title2 } from "../../../components/Title"

interface BatchProps {
    batch: WhatsappForm[]
    nagazap?: Nagazap
    index: number
}

export const Batch: React.FC<BatchProps> = ({ batch, nagazap, index }) => {
    return nagazap ? (
        <Paper sx={{ flexDirection: "column", padding: "1vw", gap: "1vw", height: "100%", opacity: nagazap.paused ? 0.4 : 1 }}>
            <Title2
                name={`${index + 1}`}
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
                    <Box key={index + message.number} sx={{ color: "secondary.main", justifyContent: "space-between" }}>
                        {message.number}
                        <Box
                            sx={{
                                fontSize: "0.6rem",
                                alignSelf: "flex-end",
                                opacity: 0.5,
                                width: "7vw",
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

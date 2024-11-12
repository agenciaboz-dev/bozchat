import React from "react"
import { Box, useTheme } from "@mui/material"
import { BlacklistLog, SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { parseISO, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface MessagesChartProps {
    messages: SentMessageLog[]
}

interface dataCountByDate {
    date: string
    Quantidade?: number
}

const formatMessagesByDate = (messages: SentMessageLog[]): dataCountByDate[] => {
    const messageCountByDate: Record<string, number> = {}

    messages.forEach((msg) => {
        const date = format(parseISO(new Date(parseInt(msg.timestamp)).toISOString()), "yyyy-MM-dd")

        if (messageCountByDate[date]) {
            messageCountByDate[date] += 1
        } else {
            messageCountByDate[date] = 1
        }
    })

    return Object.entries(messageCountByDate).map(([date, Quantidade]) => ({ date, Quantidade }))
}

export const MessagesChart: React.FC<MessagesChartProps> = ({ messages }) => {
    const { palette } = useTheme()
    const messagesData = formatMessagesByDate(messages)

    return (
        <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
            <Box sx={{ color: "secondary.main", fontWeight: "bold", paddingLeft: "2vw" }}>Mensagens enviadas</Box>
            <ResponsiveContainer style={{ flex: 1 }} height={290}>
                <AreaChart data={messagesData} margin={{ left: -20 }} style={{ flex: 1 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("pt-br")} />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type={"monotone"}
                        dataKey={"Quantidade"}
                        strokeOpacity={0}
                        fillOpacity={0.5}
                        fill={palette.primary.main}
                        dot={{ fill: palette.primary.main, r: 5, opacity: 0.6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}

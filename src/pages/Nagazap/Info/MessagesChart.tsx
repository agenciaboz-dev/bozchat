import React from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { parseISO, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MessagesChartProps {
    messages: SentMessageLog[]
}

interface MessageCountByDate {
    date: string
    count: number
}

// Function to format timestamp and count messages
const formatMessagesByDate = (messages: SentMessageLog[]): MessageCountByDate[] => {
    const messageCountByDate: Record<string, number> = {}

    messages.forEach((msg) => {
        const date = format(parseISO(new Date(parseInt(msg.timestamp)).toISOString()), "yyyy-MM-dd")

        if (messageCountByDate[date]) {
            messageCountByDate[date] += 1
        } else {
            messageCountByDate[date] = 1
        }
    })

    return Object.entries(messageCountByDate).map(([date, count]) => ({ date, count }))
}

export const MessagesChart: React.FC<MessagesChartProps> = ({ messages }) => {
    const { palette } = useTheme()
    const formattedData = formatMessagesByDate(messages)
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <ResponsiveContainer
            style={{
                flex: isMobile ? undefined : 0.5,
                padding: isMobile ? "20px 20px 0 0" : undefined,
            }}
            height={330}
        >
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke={palette.primary.main} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

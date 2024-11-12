import React from "react"
import { Box, useTheme } from "@mui/material"
import { BlacklistLog, SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { parseISO, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface MessagesChartProps {
    messages: SentMessageLog[]
    blacklist: BlacklistLog[]
}

interface dataCountByDate {
    date: string
    Enviadas?: number
    Parou_promocoes?: number
}

const mergeData = (messagesData: dataCountByDate[], blacklistData: dataCountByDate[]): dataCountByDate[] => {
    const combinedData: Record<string, dataCountByDate> = {}

    // Aggregate sent messages
    messagesData.forEach((data) => {
        if (!combinedData[data.date]) {
            combinedData[data.date] = { date: data.date, Enviadas: data.Enviadas, Parou_promocoes: 0 }
        } else {
            combinedData[data.date].Enviadas = data.Enviadas
        }
    })

    // Aggregate blacklist counts
    blacklistData.forEach((data) => {
        if (!combinedData[data.date]) {
            combinedData[data.date] = { date: data.date, Enviadas: 0, Parou_promocoes: data.Parou_promocoes }
        } else {
            combinedData[data.date].Parou_promocoes = data.Parou_promocoes
        }
    })

    // Convert the combined data record back to an array
    return Object.values(combinedData).sort((a, b) => a.date.localeCompare(b.date))
}

// Function to format timestamp and count messages
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

    return Object.entries(messageCountByDate).map(([date, Enviadas]) => ({ date, Enviadas }))
}

const formatBlacklistByDate = (blacklist: BlacklistLog[]): dataCountByDate[] => {
    const blacklistCountByDate: Record<string, number> = {}

    blacklist.forEach((msg) => {
        const date = format(parseISO(new Date(parseInt(msg.timestamp)).toISOString()), "yyyy-MM-dd")

        if (blacklistCountByDate[date]) {
            blacklistCountByDate[date] += 1
        } else {
            blacklistCountByDate[date] = 1
        }
    })

    return Object.entries(blacklistCountByDate).map(([date, Parou_promocoes]) => ({ date, Parou_promocoes }))
}

export const MessagesChart: React.FC<MessagesChartProps> = ({ messages, blacklist }) => {
    const { palette } = useTheme()
    const messagesData = formatMessagesByDate(messages)
    const blacklistData = formatBlacklistByDate(blacklist)
    const formattedData = mergeData(messagesData, blacklistData)

    return (
        <ResponsiveContainer style={{ flex: 0.5 }} height={330}>
            <AreaChart height={330} data={formattedData} margin={{ left: -20 }} style={{ flex: 0.5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("pt-br")} />
                <YAxis />
                <Tooltip />
                {/* sent messages */}
                <Area
                    type={"monotone"}
                    dataKey={"Enviadas"}
                    strokeOpacity={0}
                    fillOpacity={0.5}
                    fill={palette.primary.main}
                    dot={{ fill: palette.primary.main, r: 5, opacity: 0.6 }}
                />

                {/* blacklisted numbers */}
                <Area
                    type={"monotone"}
                    dataKey={"Parou_promocoes"}
                    strokeOpacity={0}
                    fillOpacity={0.5}
                    fill={palette.error.main}
                    dot={{ fill: palette.error.main, r: 5, opacity: 0.6 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

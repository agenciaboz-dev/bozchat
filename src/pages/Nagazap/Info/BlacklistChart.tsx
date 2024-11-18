import React from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { BlacklistLog, SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { parseISO, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

interface BlacklistChartProps {
    blacklist: BlacklistLog[]
}

interface dataCountByDate {
    date: string
    Quantidade?: number
}

const formatBlacklistByDate = (blacklist: BlacklistLog[]): dataCountByDate[] => {
    const blacklistCountByDate: Record<string, number> = {}

    blacklist.forEach((msg) => {
        const originalDate = new Date(Number(msg.timestamp))
        const parsedDate = new Date(originalDate.getFullYear(), originalDate.getMonth() + 1, originalDate.getDate() + 1)
        const date = format(parseISO(parsedDate.toISOString()), "yyyy-MM-dd")

        if (blacklistCountByDate[date]) {
            blacklistCountByDate[date] += 1
        } else {
            blacklistCountByDate[date] = 1
        }
    })

    return Object.entries(blacklistCountByDate).map(([date, Quantidade]) => ({ date, Quantidade }))
}

export const BlacklistChart: React.FC<BlacklistChartProps> = ({ blacklist }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { palette } = useTheme()
    const blacklistData = formatBlacklistByDate(blacklist)

    return (
        <Box sx={{ flexDirection: "column", gap: "0.5vw" }}>
            <Box sx={{ color: "secondary.main", fontWeight: "bold", paddingLeft: "2vw" }}>Parar promoções</Box>
            <ResponsiveContainer style={{ flex: 1, paddingRight: isMobile ? 20 : undefined }} height={290}>
                <AreaChart data={blacklistData} margin={{ left: -20 }} style={{ flex: 1 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("pt-br")} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("pt-br")} />
                    <Area
                        type={"monotone"}
                        dataKey={"Quantidade"}
                        strokeOpacity={0}
                        fillOpacity={0.5}
                        fill={palette.error.main}
                        dot={{ fill: palette.error.main, r: 5, opacity: 0.6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}

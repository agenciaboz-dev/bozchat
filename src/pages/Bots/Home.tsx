import React, { useMemo, useState } from "react"
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography, Tooltip as MuiTooltip } from "@mui/material"
import { Bot } from "../../types/server/class/Bot/Bot"
import { Subroute } from "../Nagazap/Subroute"
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useColors } from "../../hooks/useColors"
import { OnlinePrediction, ThreeP } from "@mui/icons-material"

interface HomeProps {
    bots: Bot[]
}

const total_label = "Total de conversas iniciadas"
const active_now_label = "Conversas neste momento"

export const Home: React.FC<HomeProps> = ({ bots }) => {
    const colors = useColors()

    const [chartKey, setChartKey] = useState<keyof Bot>("triggered")

    const chartLabel = useMemo(() => (chartKey === "active_on" ? active_now_label : total_label), [chartKey])

    const CustomTooltip: React.FC<{
        active?: boolean
        payload: any
        label: string
    }> = (props) => {
        return props.active ? (
            <Paper elevation={5} sx={{ flexDirection: "column", padding: "1vw" }}>
                <Typography sx={{ fontWeight: "bold" }}>{props.label}</Typography>
                <Typography>
                    {chartLabel}: {props.payload[0].value}
                </Typography>

                {/* <Typography sx={{ fontSize: "0.7rem", opacity: 0.5 }}>Clique na barra para ver mais detalhes</Typography> */}
            </Paper>
        ) : null
    }

    return (
        <Subroute
            title="Início"
            right={
                <ToggleButtonGroup value={chartKey} exclusive onChange={(_, value) => (value ? setChartKey(value) : null)}>
                    <MuiTooltip title={total_label}>
                        <ToggleButton value={"triggered"}>
                            <ThreeP />
                        </ToggleButton>
                    </MuiTooltip>
                    <MuiTooltip title={active_now_label}>
                        <ToggleButton value={"active_on"}>
                            <OnlinePrediction />
                        </ToggleButton>
                    </MuiTooltip>
                </ToggleButtonGroup>
            }
        >
            <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={bots.map((bot) => ({ ...bot, active_on: bot.active_on.length }))}>
                        <CartesianGrid strokeDasharray={"3 3"} />
                        <XAxis dataKey={"name"} />
                        <YAxis />
                        <Tooltip
                            cursor={{ opacity: 0.05, fill: colors.secondary }}
                            content={(props) => <CustomTooltip active={props.active} label={props.label} payload={props.payload} />}
                        />
                        <Bar
                            dataKey={chartKey}
                            fill={colors.primary}
                            maxBarSize={20}
                            activeBar={<Rectangle fill={colors.terciary} cursor={"pointer"} />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Subroute>
    )
}

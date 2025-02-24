import React, { useMemo, useState } from "react"
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography, Tooltip as MuiTooltip, IconButton } from "@mui/material"
import { Bot } from "../../types/server/class/Bot/Bot"
import { Subroute } from "../Nagazap/Subroute"
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useColors } from "../../hooks/useColors"
import { OnlinePrediction, Refresh, SmartToy, ThreeP } from "@mui/icons-material"

interface HomeProps {
    bots: Bot[]
    fetchBots: () => Promise<void>
}

const total_label = "Total de conversas iniciadas"
const active_now_label = "Ativo agora em"

export const Home: React.FC<HomeProps> = ({ bots, fetchBots }) => {
    const colors = useColors()

    const CustomTooltip: React.FC<{
        active?: boolean
        payload: any
        label: string
    }> = (props) => {
        return props.active ? (
            <Paper elevation={5} sx={{ flexDirection: "column", padding: "1vw", bgcolor: "background.default", color: "secondary.main" }}>
                <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>{props.label}</Typography>
                <Typography>
                    {total_label}: <span style={{ fontWeight: "bold", color: colors.primary }}>{props.payload[0].value}</span>
                </Typography>
                <Typography>
                    {active_now_label}: <span style={{ fontWeight: "bold", color: colors.primary }}>{props.payload[1].value}</span>
                </Typography>

                {/* <Typography sx={{ fontSize: "0.7rem", opacity: 0.5 }}>Clique na barra para ver mais detalhes</Typography> */}
            </Paper>
        ) : null
    }

    return (
        <Subroute
            title="Início"
            right={
                <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
                    <IconButton onClick={fetchBots} sx={{ flexShrink: 0 }}>
                        <Refresh />
                    </IconButton>
                    {/* <ToggleButtonGroup value={chartKey} exclusive onChange={(_, value) => (value ? setChartKey(value) : null)}>
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
                    </ToggleButtonGroup> */}
                </Box>
            }
        >
            <Box sx={{ flex: 1 }}>
                {!!bots.length ? (
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <BarChart data={bots.map((bot) => ({ ...bot, active_on: bot.active_on.length }))}>
                            <CartesianGrid strokeDasharray={"3 3"} />
                            <XAxis dataKey={"name"} />
                            <YAxis />
                            <Tooltip
                                cursor={{ opacity: 0.05, fill: colors.secondary }}
                                content={(props) => <CustomTooltip active={props.active} label={props.label} payload={props.payload} />}
                            />
                            <Bar dataKey={"triggered"} fill={colors.primary} barSize={50} activeBar={<Rectangle fill={colors.terciary} />} />
                            <Bar dataKey={"active_on"} fill={colors.success} barSize={50} activeBar={<Rectangle fill={colors.warning} />} />
                            <Legend formatter={(value) => (value === "triggered" ? "Total de conversas" : "Ativo agora")} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Box
                        sx={{ flexDirection: "column", gap: "1vw", color: "secondary.main", justifyContent: "center", alignItems: "center", flex: 1 }}
                    >
                        <Typography sx={{ fontSize: "3rem" }}>você não criou nenhum bot ainda</Typography>
                        <SmartToy sx={{ width: "10vw", height: "auto" }} />
                    </Box>
                )}
            </Box>
        </Subroute>
    )
}

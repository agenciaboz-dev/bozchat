import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, CircularProgress, IconButton, LinearProgress, Paper, Typography, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { Refresh } from "@mui/icons-material"
import { api } from "../../../api"
import { NagazapLink } from "../../../types/server/class/NagazapLink"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { washima_colors } from "../../../style/colors"
import { WagaLoading } from "../../../components/WagaLoading"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { useColors } from "../../../hooks/useColors"
import { buildDetailedResult } from "./buildDetailedResult"

interface ResultsProps {
    nagazap: Nagazap
}

type DataLink = Omit<WithoutFunctions<NagazapLink>, "clicks"> & { clicks: number }

const CustomTooltip: React.FC<{
    active?: boolean
    payload: any
    label: string
    currentLink: NagazapLink | null
    setCurrentLink: React.Dispatch<React.SetStateAction<NagazapLink | null>>
    links: NagazapLink[]
}> = (props) => {
    useEffect(() => {
        if (props.active) {
            const data_link = props.payload[0].payload as DataLink
            const index = props.links.findIndex((link) => link.template_name === data_link.template_name)
            const link = props.links[index]
            props.setCurrentLink(link)
        } else {
            props.setCurrentLink(null)
        }
    }, [props.active])

    return props.active ? (
        <Paper elevation={5} sx={{ flexDirection: "column", padding: "1vw" }}>
            <Typography sx={{ fontWeight: "bold" }}>{props.label}</Typography>
            <Typography>Total de acessos: {props.payload[0].value}</Typography>

            <Typography sx={{ fontSize: "0.7rem", opacity: 0.5 }}>Clique na barra para ver mais detalhes</Typography>
        </Paper>
    ) : null
}

export const Results: React.FC<ResultsProps> = ({ nagazap }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const colors = useColors()

    const [loading, setLoading] = useState(true)
    const [links, setLinks] = useState<NagazapLink[]>([])
    const [currentLink, setCurrentLink] = useState<NagazapLink | null>(null)
    const [showDetailedData, setShowDetailedData] = useState(false)

    const clickedLinks: DataLink[] = useMemo(() => links.map((link) => ({ ...link, clicks: link.clicks.length })), [links])
    const dateClicks = useMemo(() => (currentLink ? buildDetailedResult(currentLink.clicks) : []), [currentLink])

    const fetchLinks = async () => {
        setLoading(true)

        try {
            const response = await api.get("/nagazap/links", { params: { nagazap_id: nagazap.id } })
            setLinks(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => setLoading(false), 1000)
        }
    }

    useEffect(() => {
        fetchLinks()

        return () => {
            setLinks([])
        }
    }, [nagazap])

    return (
        <Subroute
            title="Resultados"
            space={isMobile ? true : undefined}
            right={
                <IconButton onClick={fetchLinks} disabled={loading}>
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
        >
            {loading ? (
                <Box sx={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <WagaLoading />
                </Box>
            ) : (
                <Box sx={{ flex: 1 }}>
                    {!!clickedLinks.length ? (
                        showDetailedData && !!currentLink ? (
                            <Box sx={{ flex: 1, flexDirection: "column", gap: "1vw" }}>
                                <Box sx={{ justifyContent: "space-between" }}>
                                    <Box sx={{ flexDirection: "column" }}>
                                        <Typography sx={{ fontWeight: "bold" }}>{currentLink.template_name}</Typography>
                                        <Typography
                                            className="link"
                                            onClick={() => window.open(currentLink.new_url, "_new")}
                                            sx={{ maxWidth: "65vw", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
                                        >
                                            {currentLink.new_url}
                                        </Typography>
                                    </Box>

                                    <Button variant="outlined" sx={{}} onClick={() => setShowDetailedData(false)}>
                                        Voltar
                                    </Button>
                                </Box>
                                <ResponsiveContainer width={"100%"} height={"90%"}>
                                    <AreaChart data={dateClicks}>
                                        <CartesianGrid strokeDasharray={"3 3"} />
                                        <XAxis dataKey={"date"} />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type={"monotone"} dataKey={"clicks"} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <BarChart data={clickedLinks}>
                                    <CartesianGrid strokeDasharray={"3 3"} />
                                    <XAxis dataKey={"template_name"} />
                                    <YAxis />
                                    <Tooltip
                                        cursor={{ opacity: 0.05, fill: colors.secondary }}
                                        content={(props) => (
                                            <CustomTooltip
                                                active={props.active}
                                                label={props.label}
                                                payload={props.payload}
                                                currentLink={currentLink}
                                                setCurrentLink={setCurrentLink}
                                                links={links}
                                            />
                                        )}
                                    />
                                    <Bar
                                        dataKey={"clicks"}
                                        fill={colors.primary}
                                        maxBarSize={20}
                                        activeBar={<Rectangle fill={colors.terciary} cursor={"pointer"} onClick={() => setShowDetailedData(true)} />}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    ) : (
                        <Box>Nenhum botão com link foi adicionado ainda</Box>
                    )}
                </Box>
            )}
        </Subroute>
    )
}

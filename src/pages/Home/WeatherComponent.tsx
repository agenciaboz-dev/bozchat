import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import clear_day from "../../assets/icons/SVG/2nd Set - Color/clear-day.svg"
import clear_night from "../../assets/icons/SVG/2nd Set - Color/clear-night.svg"
import cloudy from "../../assets/icons/SVG/2nd Set - Color/cloudy.svg"
import fog from "../../assets/icons/SVG/2nd Set - Color/fog.svg"
import hail from "../../assets/icons/SVG/2nd Set - Color/hail.svg"
import partly_cloudy_day from "../../assets/icons/SVG/2nd Set - Color/partly-cloudy-day.svg"
import partly_cloudy_night from "../../assets/icons/SVG/2nd Set - Color/partly-cloudy-night.svg"
import rain_snow_showers_day from "../../assets/icons/SVG/2nd Set - Color/rain-snow-showers-day.svg"
import rain_snow_showers_night from "../../assets/icons/SVG/2nd Set - Color/rain-snow-showers-night.svg"
import rain_snow from "../../assets/icons/SVG/2nd Set - Color/rain-snow.svg"
import rain from "../../assets/icons/SVG/2nd Set - Color/rain.svg"
import showers_day from "../../assets/icons/SVG/2nd Set - Color/showers-day.svg"
import showers_night from "../../assets/icons/SVG/2nd Set - Color/showers-night.svg"
import sleet from "../../assets/icons/SVG/2nd Set - Color/sleet.svg"
import snow_showers_day from "../../assets/icons/SVG/2nd Set - Color/snow-showers-day.svg"
import snow_showers_night from "../../assets/icons/SVG/2nd Set - Color/snow-showers-night.svg"
import snow from "../../assets/icons/SVG/2nd Set - Color/snow.svg"
import thunder_rain from "../../assets/icons/SVG/2nd Set - Color/thunder-rain.svg"
import thunder_showers_day from "../../assets/icons/SVG/2nd Set - Color/thunder-showers-day.svg"
import thunder_showers_night from "../../assets/icons/SVG/2nd Set - Color/thunder-showers-night.svg"
import thunder from "../../assets/icons/SVG/2nd Set - Color/thunder.svg"
import wind from "../../assets/icons/SVG/2nd Set - Color/wind.svg"
import { Divider, Paper, Skeleton } from "@mui/material"
import axios from "axios"
import { useArray } from "burgos-array"
import { ContainerSkeleton } from "./ContainerSkeleton"
import colors from "../../style/colors"
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll"

interface WeatherComponentProps {}

const iconMappings: { [key: string]: string } = {
    "clear-day": clear_day,
    snow: snow,
    rain: rain,
    wind: wind,
    fog: fog,
    cloudy: cloudy,
    hail: hail,
    sleet: sleet,
    thunder: thunder,
    "clear-night": clear_night,
    "snow-showers-day": snow_showers_day,
    "snow-showers-night": snow_showers_night,
    "thunder-rain": thunder_rain,
    "thunder-showers-day": thunder_showers_day,
    "thunder-showers-night": thunder_showers_night,
    "showers-day": showers_day,
    "showers-night": showers_night,
    "partly-cloudy-day": partly_cloudy_day,
    "partly-cloudy-night": partly_cloudy_night,
    "rain-snow-showers-day": rain_snow_showers_day,
    "rain-snow-showers-night": rain_snow_showers_night,
    "rain-snow-": rain_snow,
}
const climaMappings: { [key: string]: string } = {
    "clear-day": "Dia Limpo",
    snow: "Neve",
    rain: "Chuva",
    wind: "Vento forte",
    fog: "Névoa",
    cloudy: "Nublado",
    hail: hail,
    sleet: "Granizo",
    thunder: "Raios",
    "clear-night": "Noite Limpa",
    "thunder-rain": "Chuva com raios",
    "thunder-showers-day": thunder_showers_day,
    "thunder-showers-night": thunder_showers_night,
    "showers-day": showers_day,
    "showers-night": showers_night,
    "partly-cloudy-day": "Parcialmente nublado",
    "partly-cloudy-night": "Parcialmente nublado",
    "rain-snow-showers-day": rain_snow_showers_day,
    "rain-snow-showers-night": rain_snow_showers_night,
    "rain-snow": rain_snow,
}
export const WeatherComponent: React.FC<WeatherComponentProps> = ({}) => {
    const scrollRef = useHorizontalScroll()
    const currentDateTime = new Date()
    const formattedDateTime = format(currentDateTime, "EEEE, HH:mm", { locale: ptBR })
    const [data, setData] = useState<any>()
    const token = "JTZPXAPR4ZHRJ22NJGRWJNT87"

    const dateTime = formattedDateTime.charAt(0).toUpperCase() + formattedDateTime.slice(1)

    const climate = async () => {
        try {
            const response = await axios.get(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Curitiba?key=${token}`
            )
            setData(response.data)
            console.log({ opa: response.data.days })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        climate()
    }, [])

    return data ? (
        <Paper
            sx={{
                height: "39vh",
                width: "100%",
                bgcolor: "background.default",
                color: "primary.main",
                // borderRadius: "0 3vw",
                padding: "2vw",
                flexDirection: "column",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderBottom: "solid 3px",
                borderBottomColor: "primary.main",
                overflowY: "auto",
                gap: "1vw",
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    width: "1",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "0vw",
                }}
            >
                <Box sx={{ width: 1, height: 0.6, flexDirection: "column" }}>
                    <Box sx={{ width: 1, height: 0.45 }}>
                        <Box sx={{ flexDirection: "row", justifyContent: "space-between", width: 1 }}>
                            <Box sx={{ flexDirection: "row", justifyContent: "space-between", width: 0.5 }}>
                                <Box sx={{ flexDirection: "row", gap: "1vw" }}>
                                    <img
                                        src={data && iconMappings[data.currentConditions.icon]}
                                        style={{ width: "3.5vw", height: "3.5vw" }}
                                    />
                                    <Box sx={{ alignItems: "start", gap: "0.3vw" }}>
                                        <p style={{ fontSize: "2.8rem", fontWeight: "600", margin: 0, padding: 0 }}>
                                            {data && ((data.currentConditions.temp - 32) / 1.8).toFixed(0)}
                                        </p>
                                        <p style={{ fontSize: "1.5rem", position: "relative", top: "0.6vw" }}>°C</p>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ flexDirection: "column", alignItems: "end" }}>
                                <p style={{ fontWeight: "600", fontSize: "1.2rem" }}>Curitiba</p>
                                <p style={{ fontSize: "0.9rem" }}>{dateTime}</p>
                                <p style={{ fontSize: "0.8rem" }}> {data && climaMappings[data.currentConditions.icon]}</p>
                            </Box>
                        </Box>
                    </Box>
                    <Divider />
                    <Box
                        ref={scrollRef}
                        sx={{
                            width: 1,
                            height: 0.55,
                            gap: "1vw",
                            overflowX: "auto",
                            overflowY: "hidden",
                            pt: "0.5vw",
                            "&::-webkit-scrollbar": {
                                width: "0.3vw",
                                height: "0.4vw",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#f1f1f1",
                                borderRadius: "0.4vw",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: colors.primary,
                                borderRadius: "0.4vw",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                background: "primary.main",
                            },
                        }}
                    >
                        {data &&
                            data.days[1].hours
                                .filter((item: any) => {
                                    const horaItem = parseInt(item.datetime.split(":")[0]) // Extrair a hora do item
                                    return horaItem >= new Date().getHours() // Filtrar itens a partir do horário atual
                                })
                                .map((item: any, index: number) => (
                                    <Box sx={{ flexDirection: "column", alignItems: "center", gap: "0.3vw" }} key={index}>
                                        <p style={{ fontSize: "0.8rem" }}>
                                            {item.datetime.split(":")[0] + ":" + item.datetime.split(":")[1]}
                                        </p>
                                        <img src={iconMappings[item.icon]} style={{ width: "1.4vw", height: "1.4vw" }} />
                                        <p style={{ fontSize: "0.8rem" }}>{data && ((item.temp - 32) / 1.8).toFixed(0)}°</p>
                                    </Box>
                                ))}
                        {data &&
                            data.days[2].hours
                                .filter((item: any) => {
                                    const horaItem = parseInt(item.datetime.split(":")[0]) // Extrair a hora do item
                                    return horaItem < new Date().getHours() // Filtrar itens a partir do horário atual
                                })
                                .map((item: any, index: number) => (
                                    <Box sx={{ flexDirection: "column", alignItems: "center", gap: "0.3vw" }} key={index}>
                                        <p style={{ fontSize: "0.8rem" }}>
                                            {item.datetime.split(":")[0] + ":" + item.datetime.split(":")[1]}
                                        </p>
                                        <img src={iconMappings[item.icon]} style={{ width: "1.4vw", height: "1.4vw" }} />
                                        <p style={{ fontSize: "0.8rem" }}>{data && ((item.temp - 32) / 1.8).toFixed(0)}°</p>
                                    </Box>
                                ))}
                    </Box>
                    <Divider />
                </Box>
                <Box
                    sx={{
                        width: 1,
                        height: 0.42,
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflowX: "auto",
                        overflowY: "hidden",
                        pt: "0.7vw",
                    }}
                >
                    {data && (
                        <Box sx={{ flexDirection: "column", alignItems: "center", gap: "0.3vw" }}>
                            <p style={{ fontSize: "1rem", fontWeight: "bold1" }}>Hoje</p>
                            <img
                                src={data.days && iconMappings[data.days[1].icon]}
                                style={{ width: "2vw", height: "2vw" }}
                            />
                            <Box sx={{ flexDirection: "column" }}>
                                <p style={{ fontSize: "1rem", color: "orange" }}>
                                    {data.days && ((data.days[1].tempmax - 32) / 1.8).toFixed(0)}°
                                </p>
                                <p style={{ fontSize: "1rem" }}>
                                    {data.days && ((data.days[1].tempmin - 32) / 1.8).toFixed(0)}°
                                </p>
                            </Box>
                        </Box>
                    )}
                    {data &&
                        data.days.slice(2, 11).map((item: any, index: any) => (
                            <Box sx={{ flexDirection: "column", alignItems: "center", gap: "0.3vw" }} key={index}>
                                <p style={{ fontSize: "1rem" }}>{format(new Date(item.datetime), "dd/MM")}</p>
                                <img src={iconMappings[item.icon]} style={{ width: "2vw", height: "2vw" }} />
                                <Box sx={{ flexDirection: "column" }}>
                                    <p style={{ fontSize: "1rem", color: "orange" }}>
                                        {data && ((item.tempmax - 32) / 1.8).toFixed(0)}°
                                    </p>
                                    <p style={{ fontSize: "1rem" }}>{data && ((item.tempmin - 32) / 1.8).toFixed(0)}°</p>
                                </Box>
                            </Box>
                        ))}
                </Box>
                {/* //aqui */}
                {/* <Box sx={{ flexDirection: "row", alignItems: "center", gap: "3vw", width: "65%" }}>
                    {loading ? (
                        <CircularProgress sx={{ color: "white" }} />
                    ) : (
                        <img src={iconMappings[icon]} style={{ width: "17vw", height: "17vw" }} />
                    )}
                    <Box sx={{ flexDirection: "row", gap: "1vw" }}>
                        <p style={{ fontSize: "8vw" }}>{data?.temp && ((data?.temp - 32) / 1.8).toFixed(0)}</p>
                        <p style={{ fontSize: "2.8vw", paddingTop: "3vw" }}>°C </p>
                    </Box>
                </Box>
                <Box sx={{ width: "35%", alignItems: "end" }}>
                    <p style={{ fontWeight: "600", fontSize: "3.5vw" }}>Clima</p>
                    <p style={{ fontSize: "2.9vw" }}>{dateTime}</p>
                    <p style={{ fontSize: "3vw" }}> {data?.icon && climaMappings[data.icon]}</p>
                </Box> */}
            </Box>
        </Paper>
    ) : (
        <ContainerSkeleton />
    )
}

import React from "react"
import { GeneralStat } from "../../types/GeneralStat"
import { Box, CircularProgress, Paper, useMediaQuery } from "@mui/material"

interface DataContainerProps {
    stat: GeneralStat
}

export const DataContainer: React.FC<DataContainerProps> = ({ stat }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const Icon = stat.icon

    return (
        <Paper
            sx={[
                {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                    padding: isMobile ? "3vw" : "1vw",
                    height: "5.7rem",
                },
            ]}
        >
            <Box sx={{ flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <Box sx={[{ fontSize: "0.9rem", fontWeight: "bold", color: "secondary.main" }]}>{stat.title}</Box>
                {stat.loading ? (
                    <CircularProgress size={"1.5rem"} sx={[{ alignSelf: "flex-start" }]} />
                ) : (
                    <Box sx={[{ fontSize: "1.5rem", fontWeight: "bold", color: "primary.main" }]}>{stat.value}</Box>
                )}
            </Box>

            <Paper
                sx={[
                    {
                        backgroundColor: "primary.main",
                        aspectRatio: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        width: isMobile ? "8vw" : "2.5vw",
                        height: isMobile ? "8vw" : "2.5vw",
                    },
                ]}
            >
                <Icon color="secondary" sx={{ width: isMobile ? "6vw" : "1.5vw", height: isMobile ? "6vw" : "1.5vw" }} />
            </Paper>
        </Paper>
    )
}

import React from "react"
import { GeneralStat } from "../../types/GeneralStat"
import { Box, CircularProgress, Paper } from "@mui/material"

interface DataContainerProps {
    stat: GeneralStat
}

export const DataContainer: React.FC<DataContainerProps> = ({ stat }) => {
    const Icon = stat.icon

    return (
        <Paper sx={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flex: 1, padding: "1vw", height: "5.7rem" }]}>
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
                        width: "2.5vw",
                        height: "2.5vw",
                    },
                ]}
            >
                <Icon color="secondary" sx={{ width: "1.5vw", height: "1.5vw" }} />
            </Paper>
        </Paper>
    )
}

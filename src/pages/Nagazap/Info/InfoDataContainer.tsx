import React from "react"
import { Box, Skeleton } from "@mui/material"
import { GeneralStat } from "../../../types/GeneralStat"

interface InfoDataContainerProps {
    data: GeneralStat
}

export const InfoDataContainer: React.FC<InfoDataContainerProps> = ({ data }) => {
    const Icon = data.icon
    return (
        <Box sx={{}}>
            <Box sx={{ flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
                    <Icon color="secondary" sx={{ width: "1vw", height: "1vw" }} />
                    <Box sx={[{ fontSize: "0.9rem", fontWeight: "bold", color: "secondary.main" }]}>{data.title}</Box>
                </Box>
                {data.loading ? (
                    <Skeleton variant="rounded" animation="wave" sx={{ height: "2.4vw", width: "20vw" }} />
                ) : (
                    <Box sx={[{ fontSize: "1.5rem", fontWeight: "bold", color: "primary.main" }]}>{data.value}</Box>
                )}
            </Box>
        </Box>
    )
}

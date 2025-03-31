import React from "react"
import { Box, Grid, useMediaQuery } from "@mui/material"
import { GeneralStat } from "../../types/GeneralStat"
import { DataContainer } from "./DataContainer"

interface GeneralStatsListProps {
    list: GeneralStat[]
}

export const GeneralStatsList: React.FC<GeneralStatsListProps> = ({ list }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Grid container columns={isMobile ? 1 : 2} spacing={isMobile ? "5vw" : "0.5vw"}>
            {list.map((stat) => (
                <Grid item xs={1} key={stat.title}>
                    <DataContainer stat={stat} />
                </Grid>
            ))}
        </Grid>
    )
}

import React from "react"
import { Box, Grid } from "@mui/material"
import { GeneralStat } from "../../types/GeneralStat"
import { DataContainer } from "./DataContainer"

interface GeneralStatsListProps {
    list: GeneralStat[]
}

export const GeneralStatsList: React.FC<GeneralStatsListProps> = ({ list }) => {
    return (
        <Box sx={{}}>
            <Grid container columns={2} spacing={"1vw"}>
                {list.map((stat) => (
                    <Grid item xs={1} key={stat.title}>
                        <DataContainer stat={stat} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

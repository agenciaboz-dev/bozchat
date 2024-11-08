import React from "react"
import { Box, IconButton } from "@mui/material"
import { Title2 } from "../../components/Title"
import { Replay } from "@mui/icons-material"

interface NagazapStatisticsProps {}

export const NagazapStatistics: React.FC<NagazapStatisticsProps> = ({}) => {
    return (
        <Box sx={{ flex: 1, flexDirection: "column" }}>
            <Title2
                name="Nagazap"
                right={
                    <IconButton>
                        <Replay />
                    </IconButton>
                }
            />
        </Box>
    )
}

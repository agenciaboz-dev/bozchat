import React from "react"
import { Box, IconButton, Skeleton } from "@mui/material"
import { GeneralStat } from "../../../types/GeneralStat"
import { CopyAll } from "@mui/icons-material"

interface InfoDataContainerProps {
    data: GeneralStat & { copy?: boolean }
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
                    <Skeleton variant="rounded" animation="wave" sx={{ height: "1.765vw", width: "20vw" }} />
                ) : (
                    <Box sx={[{ fontSize: "1.5rem", fontWeight: "bold", color: "primary.main", gap: "0.5vw" }]}>
                        {data.value}
                        {data.copy && !!data.value && (
                            <IconButton onClick={() => navigator.clipboard.writeText(data.value!.toString())}>
                                <CopyAll />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

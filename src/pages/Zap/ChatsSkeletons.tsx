import React from "react"
import { Box, Skeleton } from "@mui/material"
import { useArray } from "burgos-array"
import { useMediaQuery } from "@mui/material"

interface ChatsSkeletonsProps {}

export const ChatsSkeletons: React.FC<ChatsSkeletonsProps> = ({}) => {
    const isMobile = useMediaQuery('(orientation: portrait)')
    const skeletons = useArray().newArray(10)

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", width: "100%" }}>
            {skeletons.map((index) => (
                <Skeleton key={index} variant="rounded" sx={{ width: isMobile ? "100%" : "30%", height: "5vw" }} animation="wave" />
            ))}
        </Box>
    )
}

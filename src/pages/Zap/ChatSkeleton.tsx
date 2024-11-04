import React from "react"
import { Box, Skeleton } from "@mui/material"

interface ChatSkeletonProps {}

export const ChatSkeleton: React.FC<ChatSkeletonProps> = ({}) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "5vw",
                borderRadius: "0.5vw",
                borderBottom: "2px solid",
                padding: "1vw",
                alignItems: "center",
                gap: "1vw",
                flex: 1,
            }}
        >
            <Skeleton variant="circular" animation="wave" sx={{ width: "3vw", height: "3vw" }} />

            <Box sx={{ flexDirection: "column", justifyContent: "space-between", height: "100%", flex: 1 }}>
                <Box sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Skeleton variant="rounded" animation="wave" sx={{ width: "8vw" }} />
                    <Skeleton variant="rounded" animation="wave" sx={{ width: "3vw", height: "0.6vw" }} />
                </Box>

                <Skeleton variant="rounded" animation="wave" sx={{ width: "18vw" }} />
            </Box>
        </Box>
    )
}

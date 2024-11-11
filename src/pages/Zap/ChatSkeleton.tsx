import React from "react"
import { Box, Skeleton, useMediaQuery } from "@mui/material"

interface ChatSkeletonProps {}

export const ChatSkeleton: React.FC<ChatSkeletonProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box
            sx={{
                width: isMobile ? "95vw" : "100%",
                height: isMobile ? "20vw" : "5vw",
                borderRadius: isMobile ? "3vw" : "0.5vw",
                borderBottom: "2px solid",
                padding: isMobile ? "2vw 1vw" : "1vw",
                alignItems: "center",
                gap: isMobile ? "3vw" : "1vw",
                // flex: 1,
            }}
        >
            <Skeleton variant="circular" animation="wave" sx={{ width: isMobile ? "15vw" : "3vw", height: isMobile ? "15vw" : "3vw" }} />

            <Box
                sx={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    flex: 1,
                }}
            >
                <Box sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Skeleton variant="rounded" animation="wave" sx={{ width: isMobile ? "50%" : "8vw" }} />
                    <Skeleton variant="rounded" animation="wave" sx={{ width: isMobile ? "20%" : "3vw", height: isMobile ? "3vw" : "0.6vw" }} />
                </Box>

                <Skeleton variant="rounded" animation="wave" sx={{ width: isMobile ? "85%" : "18vw" }} />
            </Box>
        </Box>
    )
}

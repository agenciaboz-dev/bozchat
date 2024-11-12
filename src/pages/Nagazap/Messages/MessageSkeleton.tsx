import React from "react"
import { Box, Skeleton } from "@mui/material"

interface MessageSkeletonProps {}

export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({}) => {
    const randomHeight = 3 + Math.random() * 10
    return <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, height: `${randomHeight}vw` }} />
}

import React from "react"
import { Box, Grid, Skeleton } from "@mui/material"

interface ContainerSkeletonProps {}

export const ContainerSkeleton: React.FC<ContainerSkeletonProps> = ({}) => {
    return (
        <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
                height: "39vh",
                width: "100%",
                // borderRadius: "0 3vw",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderBottom: "solid 3px",
                borderBottomColor: "primary.main",
            }}
        />
    )
}

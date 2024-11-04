import React from "react"
import { Box, Grid, Paper, Skeleton } from "@mui/material"
import { ContainerWrapper } from "./ContainerWrapper"
import { useUser } from "../../hooks/useUser"
import { UserAvatar } from "../Admin/Stats/StatusLogs"
import { ContainerSkeleton } from "./ContainerSkeleton"

interface UsersContainerProps {
    user: User
}

export const UsersContainer: React.FC<UsersContainerProps> = ({ user }) => {
    const { connectedList } = useUser()

    // const connectedList = list.filter((item) => item.status == 1)

    return !!connectedList.length ? (
        <Paper
            sx={{
                height: "100%",
                maxHeight: "100%",
                width: "16vw", // Garante que ocupe 20% da largura
                bgcolor: "background.default",
                color: "primary.main",
                // borderRadius: "0 3vw",
                padding: "2vw",
                flexDirection: "column",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderBottom: "solid 3px",
                borderBottomColor: "primary.main",
                overflowY: "auto",
                gap: "1vw",
            }}
        >
            <Box sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Coleguinhas ({connectedList.length})</Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {connectedList.map((user) => (
                    <Box sx={{ width: "100%", p: 1 }} key={user.id}>
                        <UserAvatar user={user} />
                    </Box>
                ))}
            </Box>
        </Paper>
    ) : (
        <Skeleton
            sx={{
                height: "100vh",
                maxHeight: "90vh",
                width: "20vw", // Garante que ocupe 20% da largura
                bgcolor: "background.default",
                color: "primary.main",
                borderRadius: "0 3vw",
                padding: "2vw",
                flexDirection: "column",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderBottom: "solid 3px",
                borderBottomColor: "primary.main",
            }}
        />
    )
}

import React, { useState } from "react"
import { Box, Pagination } from "@mui/material"
import { ContainerWrapper } from "./ContainerWrapper"
import { useUser } from "../../hooks/useUser"
import { Status } from "../Admin/Stats/StatusLogs"
import { ContainerSkeleton } from "./ContainerSkeleton"

interface StatusLogsContainerProps {
    user: User
}

const Log: React.FC<{ log: StatusLog }> = ({ log }) => {
    return (
        <Box sx={{ width: "100%", justifyContent: "space-between" }}>
            <Status status={log.status} />
            <Box sx={{ justifyContent: "space-between", width: "50%" }}>
                <p>{new Date(log.datetime).toLocaleDateString("pt-br")}</p>
                <p>{new Date(log.datetime).toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })}</p>
            </Box>
        </Box>
    )
}

export const StatusLogsContainer: React.FC<StatusLogsContainerProps> = ({ user }) => {
    const { logs } = useUser()
    const [page, setPage] = useState(1)
    const itemsPerPage = 9
    const noOfPages = Math.ceil(logs.status.length / itemsPerPage)

    const handleChangePage = (event: any, value: any) => {
        setPage(value)
    }
    return logs.status.length ? (
        <ContainerWrapper>
            <Box sx={{ flexDirection: "column", height: "80%" }}>
                <Box sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Status</Box>
                <Box sx={{ flexDirection: "column" }}>
                    {logs.status
                        .sort((a, b) => b.id - a.id)
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((log) => (
                            <Log key={log.id} log={log} />
                        ))}
                </Box>
                <Pagination
                    count={noOfPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 2, alignSelf: "center" }}
                />
            </Box>
        </ContainerWrapper>
    ) : (
        <ContainerSkeleton />
    )
}

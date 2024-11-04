import React from "react"
import { Box, Grid } from "@mui/material"
import { FailedMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"

interface FailedLogContainerProps {
    log: FailedMessageLog
}

export const FailedLogContainer: React.FC<FailedLogContainerProps> = ({ log }) => {
    const date = new Date(Number(log.timestamp)).toLocaleString("pt-br")
    const number = log.number.slice(2)

    return (
        <Grid container columns={4} spacing={2}>
            <Grid item xs={1}>
                <Box sx={{ alignItems: "center", gap: "1vw" }}>
                    <Box
                        sx={{
                            bgcolor: "error.main",
                            width: "1vw",
                            height: "1vw",
                            borderRadius: "100%",
                        }}
                    />
                    <Box>{number}</Box>
                </Box>
            </Grid>
            <Grid item xs={1}>
                <Box sx={{ color: "secondary.main", fontSize: "0.8rem" }}>{date}</Box>
            </Grid>
            <Grid item xs={2}>
                <Box sx={{ width: "100%", justifyContent: "flex-end" }}>{log.data.error.message}</Box>
            </Grid>
        </Grid>
    )
}

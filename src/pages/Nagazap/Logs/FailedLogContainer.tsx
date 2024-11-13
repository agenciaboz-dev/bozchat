import React from "react"
import { Box, Grid, useMediaQuery } from "@mui/material"
import { FailedMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"

interface FailedLogContainerProps {
    log: FailedMessageLog
}

export const FailedLogContainer: React.FC<FailedLogContainerProps> = ({ log }) => {
    const date = new Date(Number(log.timestamp)).toLocaleString("pt-br")
    const number = log.number.slice(2)
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Grid container columns={4} spacing={2} sx={{ alignItems: "center" }}>
            <Grid item xs={isMobile ? 2 : 1}>
                <Box sx={{ alignItems: "center", gap: isMobile ? "2vw" : "1vw" }}>
                    <Box
                        sx={{
                            bgcolor: "error.main",
                            width: isMobile ? "3vw" : "1vw",
                            height: isMobile ? "3vw" : "1vw",
                            borderRadius: "100%",
                        }}
                    />
                    {isMobile ? (
                        <Grid item>
                            <Box>{number}</Box>
                            <Box sx={{ color: "secondary.main", fontSize: "0.8rem" }}>{date}</Box>
                        </Grid>
                    ) : (
                        <Box>{number}</Box>
                    )}
                </Box>
            </Grid>
            {!isMobile ? (
                <Grid item xs={1}>
                    <Box sx={{ color: "secondary.main", fontSize: "0.8rem" }}>{date}</Box>
                </Grid>
            ) : null}
            <Grid item xs={2}>
                <Box sx={{ width: "100%", justifyContent: "flex-end" }}>{log.data.error.message}</Box>
            </Grid>
        </Grid>
    )
}

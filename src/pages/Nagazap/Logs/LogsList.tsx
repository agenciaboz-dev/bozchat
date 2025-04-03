import React from "react"
import { Box, Divider, Grid, Paper, useMediaQuery } from "@mui/material"
import { LogContainer } from "./LogContainer"
import { FailedMessageLog, SentMessageLog } from "../../../types/server/Meta/WhatsappBusiness/Logs"
import { FailedLogContainer } from "./FailedLogContainer"
import { Title2 } from "../../../components/Title"

interface LogsListProps {
    list: SentMessageLog[] | FailedMessageLog[]
    type: "success" | "error"
}

export const LogsList: React.FC<LogsListProps> = ({ list, type }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Grid item xs={1} sx={{ paddingBottom: isMobile ? "5vw" : "2vw" }}>
            <Paper sx={{ flexDirection: "column", padding: isMobile ? "5vw" : "1vw", gap: isMobile ? "3vw" : "0.5vw" }}>
                <Title2 name={type == "success" ? "Enviadas" : "Falhas"} />
                {list
                    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                    .map((item, index, arr) =>
                        type == "success" ? (
                            <>
                                <LogContainer key={item.timestamp} log={item as SentMessageLog} />
                                {index !== arr.length - 1 && <Divider />}
                            </>
                        ) : (
                            <>
                                <FailedLogContainer key={item.timestamp} log={item as FailedMessageLog} />
                                {index !== arr.length - 1 && <Divider />}
                            </>
                        )
                    )}
            </Paper>
        </Grid>
    )
}

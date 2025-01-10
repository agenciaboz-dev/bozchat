import React from "react"
import { Box, IconButton, Skeleton, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { GeneralStat } from "../../../types/GeneralStat"
import { CopyAll } from "@mui/icons-material"
import { useClipboard } from "@mantine/hooks"

interface InfoDataContainerProps {
    data: GeneralStat & { copy?: boolean }
}

export const InfoDataContainer: React.FC<InfoDataContainerProps> = ({ data }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const Icon = data.icon

    const clipboard = useClipboard({ timeout: 1000 })

    return (
        <Box sx={{}}>
            <Box
                sx={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    gap: isMobile ? "1vw" : "",
                }}
            >
                <Box
                    sx={{
                        gap: isMobile ? "1vw" : "0.5vw",
                        alignItems: "center",
                    }}
                >
                    <Icon color="secondary" sx={{ width: isMobile ? "5vw" : "1vw", height: isMobile ? "5vw" : "1vw" }} />
                    <Box sx={[{ fontSize: "0.9rem", fontWeight: "bold", color: "secondary.main" }]}>{data.title}</Box>
                </Box>
                {data.loading ? (
                    <Skeleton variant="rounded" animation="wave" sx={{ height: isMobile ? "9vw" : "1.72vw", width: isMobile ? "80vw" : "15vw" }} />
                ) : (
                    <Box
                        sx={[
                            {
                                gap: "0.5vw",
                                width: isMobile ? "90vw" : undefined,
                                alignItems: "center",
                            },
                        ]}
                    >
                        <Tooltip title={data.value} placement="bottom" arrow>
                            <Typography
                                sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                    color: "primary.main",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: isMobile ? undefined : "15vw",
                                }}
                            >
                                {data.value}
                            </Typography>
                        </Tooltip>

                        {data.copy && !!data.value && (
                            <IconButton onClick={() => clipboard.copy(data.value?.toString())} sx={{ padding: 0, width: "2vw", height: "2vw" }}>
                                <CopyAll sx={{ width: "1.5vw", height: "1.5vw" }} color={clipboard.copied ? "success" : undefined} />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

import React from "react"
import { Box, IconButton, Skeleton, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { GeneralStat } from "../../../types/GeneralStat"
import { CopyAll } from "@mui/icons-material"
import { useClipboard } from "@mantine/hooks"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { default_colors } from "../../../style/colors"

interface InfoDataContainerProps {
    data: GeneralStat & { copy?: boolean }
}

export const InfoDataContainer: React.FC<InfoDataContainerProps> = ({ data }) => {
    const { darkMode } = useDarkMode()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const Icon = data.icon

    const clipboard = useClipboard({ timeout: 1000 })

    return (
        <Box>
            <Box
                sx={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        gap: isMobile ? "1vw" : "0.5vw",
                        alignItems: "center",
                    }}
                >
                    <Icon color={darkMode ? "secondary" : "action"} sx={{ width: isMobile ? "5vw" : "1vw", height: isMobile ? "5vw" : "1vw" }} />
                    <Box sx={[{ fontSize: "0.9rem", fontWeight: "bold", color: "text.secondary" }]}>{data.title}</Box>
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
                                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                                    fontWeight: "bold",
                                    color: "primary.main",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: isMobile ? "65vw" : "15vw",
                                }}
                            >
                                {data.value}
                            </Typography>
                        </Tooltip>

                        {data.copy && !!data.value && (
                            <IconButton
                                onClick={() => clipboard.copy(data.value?.toString())}
                                sx={{ padding: isMobile ? "0 5vw" : 0, width: "2vw", height: "2vw" }}
                            >
                                <CopyAll
                                    sx={{ width: isMobile ? "5vw" : "1.5vw", height: isMobile ? "5vw" : "1.5vw" }}
                                    color={clipboard.copied ? "success" : undefined}
                                />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

import React from "react"
import { Avatar, Box, IconButton, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { Delete } from "@mui/icons-material"

interface BotMessageContainerProps {
    node: FlowNode | null
    nodeData?: FlowNodeData
    removeMedia?: () => void
}

export const BotMessageContainer: React.FC<BotMessageContainerProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const lightModePrimary = "#bbdeff"
    const lightModeSecondary = "#e0e0e0"
    const primary = "#0F6787"
    const secondary = "#2a323c"

    return (
        <Paper
            elevation={0}
            sx={{
                marginTop: "auto",
                flexDirection: "column",
                gap: isMobile ? "2vw" : "0.5vw",
                padding: isMobile ? "4vw" : "0.5vw",
                position: "relative",
                borderRadius: "4px",
                borderTopLeftRadius: props.node?.type === "message" ? undefined : 0,
                borderTopRightRadius: props.node?.type === "message" ? 0 : undefined,
                color: "text.secondary",
                width: "fit-content",
                minWidth: isMobile ? "70%" : "5vw",
                minHeight: "2vw",
                alignSelf: props.node?.type === "message" ? "flex-end" : undefined,
                bgcolor: props.node?.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary,
                maxWidth: "17vw",
                margin: isMobile ? "1vw 0" : undefined,
            }}
        >
            {props.nodeData?.media && (
                <>
                    {props.nodeData.media.type === "image" && (
                        <PhotoView src={props.nodeData.media.url}>
                            <MenuItem sx={{ padding: 0, justifyContent: "center" }}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        width: "15vw",
                                        height: "auto",
                                        maxHeight: "15vw",
                                    }}
                                    src={props.nodeData.media.url}
                                />
                            </MenuItem>
                        </PhotoView>
                    )}

                    {props.nodeData.media.type === "video" && (
                        <video
                            src={props.nodeData.media.url}
                            style={{
                                width: "15vw",
                                height: "auto",
                                maxHeight: "15vw",
                            }}
                            controls
                        />
                    )}
                    {props.removeMedia && (
                        <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                            <IconButton onClick={props.removeMedia}>
                                <Delete color="error" />
                            </IconButton>
                        </Box>
                    )}
                </>
            )}
            <Typography
                color="#fff"
                sx={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    color: "text.secondary",
                    maxWidth: isMobile ? "100%" : "15vw",
                }}
            >
                {props.nodeData?.value}
            </Typography>

            {props.nodeData?.media?.type === "audio" && (
                <AudioPlayer
                    containerSx={{
                        height: isMobile ? undefined : "3vw",
                        paddingBottom: isMobile ? "4vw" : undefined,
                    }}
                    media={{
                        source: props.nodeData?.media.url,
                        ext: props.nodeData?.media.url.split(".")[props.nodeData?.media.url.split(".").length - 1],
                    }}
                    inBoards
                />
            )}

            <TrianguloFudido
                alignment={props.node?.type === "message" ? "right" : "left"}
                color={props.node?.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary}
            />
        </Paper>
    )
}

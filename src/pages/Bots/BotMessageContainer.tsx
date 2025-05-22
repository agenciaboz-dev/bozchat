import React from "react"
import { Avatar, Box, Button, IconButton, MenuItem, Paper, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { Close, Delete, Reply } from "@mui/icons-material"
import { custom_colors } from "../../style/colors"
import { WhastappButtonAction } from "../../types/server/class/Nagazap"

interface BotMessageContainerProps {
    node: FlowNode | null
    nodeData?: FlowNodeData
    removeMedia?: () => void
    editButton: (id: string | null) => void
    edittingButton: string | null
    setNodeData?: React.Dispatch<React.SetStateAction<FlowNodeData>>
}

export const BotMessageContainer: React.FC<BotMessageContainerProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

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
                bgcolor:
                    props.node?.type === "message"
                        ? darkMode
                            ? custom_colors.darkMode_emittedMsg
                            : custom_colors.lightMode_emittedMsg
                        : darkMode
                        ? custom_colors.darkMode_receivedMsg
                        : custom_colors.lightMode_receivedMsg,
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

            {props.nodeData?.interactive?.type === "button" && (
                <Box sx={{ flexDirection: "column" }}>
                    {(props.nodeData.interactive.action as WhastappButtonAction).buttons?.map((button, index) => (
                        <Tooltip
                            key={button.reply.id}
                            // placement="left"
                            title={
                                <Box sx={{ flexDirection: "column", padding: "0.5vw" }}>
                                    <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Editar botão</Typography>
                                        <IconButton sx={{ padding: "0.3vw" }} onClick={() => props.editButton(null)}>
                                            <Close />
                                        </IconButton>
                                    </Box>
                                    <TextField
                                        value={button.reply.title}
                                        variant="standard"
                                        onChange={(ev) =>
                                            props.setNodeData?.((data) => {
                                                const action = data.interactive?.action as WhastappButtonAction
                                                action.buttons[index].reply.title = ev.target.value
                                                return { ...data, interactive: { ...data.interactive!, action: action } }
                                            })
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    onClick={() =>
                                                        props.setNodeData?.((data) => {
                                                            const action = data.interactive?.action as WhastappButtonAction
                                                            action.buttons = action.buttons.filter((item) => item.reply.id !== button.reply.id)
                                                            return { ...data, interactive: { ...data.interactive!, action: action } }
                                                        })
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                </Box>
                            }
                            arrow
                            open={props.edittingButton === button.reply.id}
                        >
                            <Button
                                variant="text"
                                // fullWidth
                                sx={{
                                    textTransform: "none",
                                    color: "secondary.main",
                                    fontWeight: "bold",
                                    borderTop: "1px solid",
                                    borderColor: "#e1e1e188",
                                    borderRadius: 0,
                                    margin: "0 -0.5vw",
                                    minWidth: "10vw",
                                }}
                                startIcon={<Reply />}
                                onClick={() => props.editButton(button.reply.id)}
                            >
                                {button.reply.title}
                            </Button>
                        </Tooltip>
                    ))}
                </Box>
            )}

            <TrianguloFudido
                alignment={props.node?.type === "message" ? "right" : "left"}
                color={
                    props.node?.type === "message"
                        ? darkMode
                            ? custom_colors.darkMode_emittedMsg
                            : custom_colors.lightMode_emittedMsg
                        : darkMode
                        ? custom_colors.darkMode_receivedMsg
                        : custom_colors.lightMode_receivedMsg
                }
            />
        </Paper>
    )
}

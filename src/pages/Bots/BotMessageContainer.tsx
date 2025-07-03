import React from "react"
import { Avatar, Box, Button, ClickAwayListener, IconButton, MenuItem, Paper, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { Close, Delete, List, Reply } from "@mui/icons-material"
import { custom_colors } from "../../style/colors"
import { WhastappButtonAction, WhatsappListAction } from "../../types/server/class/Nagazap"
import { uid } from "uid"

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
                minHeight: isMobile ? "5vw" : "2vw",
                alignSelf: props.node?.type === "message" ? "flex-end" : undefined,
                bgcolor:
                    props.node?.type === "message"
                        ? darkMode
                            ? custom_colors.darkMode_emittedMsg
                            : custom_colors.lightMode_emittedMsg
                        : darkMode
                        ? custom_colors.darkMode_receivedMsg
                        : custom_colors.lightMode_receivedMsg,
                maxWidth: isMobile ? undefined : "17vw",
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
                                        width: isMobile ? "50vw" : "15vw",
                                        height: "auto",
                                        maxHeight: isMobile ? "50vw" : "15vw",
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
                                width: isMobile ? "50vw" : "15vw",
                                height: "auto",
                                maxHeight: isMobile ? "50vw" : "15vw",
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
                <ClickAwayListener onClickAway={() => props.editButton(null)}>
                    <Box sx={{ flexDirection: "column" }}>
                        {(props.nodeData.interactive.action as WhastappButtonAction).buttons?.map((button, index) => (
                            <Tooltip
                                placement={isMobile ? "top-start" : "left-end"}
                                key={button.reply.id}
                                title={
                                    <Box sx={{ flexDirection: "column", padding: isMobile ? "2vw" : "0.5vw" }}>
                                        <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography>Editar botão</Typography>
                                            <IconButton
                                                sx={{ padding: isMobile ? "3vw 1vw" : "0.3vw", color: "secondary.main" }}
                                                onClick={() => props.editButton(null)}
                                            >
                                                <Close />
                                            </IconButton>
                                        </Box>
                                        <TextField
                                            onKeyDown={(ev) => (ev.key === "Enter" ? props.editButton(null) : {})}
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
                                                        sx={{ color: "secondary.main" }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                ),
                                                sx: { color: darkMode ? "primary.main" : "secondary.main" },
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
                                        color: "text.secondary",
                                        fontWeight: "bold",
                                        borderTop: "1px solid",
                                        borderColor: darkMode
                                            ? custom_colors.darkMode_interactiveMessageBorder
                                            : custom_colors.lightMode_interactiveMessageBorder,
                                        borderRadius: 0,
                                        margin: isMobile ? "0 2vw" : "0 -0.5vw",
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
                </ClickAwayListener>
            )}

            {props.nodeData?.interactive?.type === "list" && (
                <ClickAwayListener onClickAway={() => props.editButton(null)}>
                    <Box sx={{ flexDirection: "column" }}>
                        {(props.nodeData.interactive.action as WhatsappListAction).sections?.map((section, index) => (
                            <Tooltip
                                key={section.title + index.toString()}
                                slotProps={{ tooltip: { sx: { marginRight: "1vw" } } }}
                                placement={isMobile ? "top-start" : "left-end"}
                                title={
                                    <Box sx={{ flexDirection: "column", padding: isMobile ? "3vw" : "0.5vw" }}>
                                        <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography>Editar lista</Typography>
                                            <IconButton
                                                sx={{ padding: isMobile ? "3vw 1vw" : "0.3vw", color: "secondary.main" }}
                                                onClick={() => props.editButton(null)}
                                            >
                                                <Close />
                                            </IconButton>
                                        </Box>

                                        {section.rows.map((button, button_index) => (
                                            <TextField
                                                onKeyDown={(ev) => (ev.key === "Enter" ? props.editButton(null) : {})}
                                                value={button.title}
                                                variant="standard"
                                                onChange={(ev) =>
                                                    props.setNodeData?.((data) => {
                                                        const action = data.interactive?.action as WhatsappListAction
                                                        action.sections[index].rows[button_index].title = ev.target.value
                                                        return { ...data, interactive: { ...data.interactive!, action: action } }
                                                    })
                                                }
                                                InputProps={{
                                                    startAdornment: (
                                                        <Typography
                                                            sx={{
                                                                color: "secondary.main",
                                                                fontWeight: "bold",
                                                                marginRight: isMobile ? "1vw" : "0.5vw",
                                                            }}
                                                        >
                                                            {button_index + 1}.{" "}
                                                        </Typography>
                                                    ),
                                                    endAdornment: (
                                                        <IconButton
                                                            onClick={() =>
                                                                props.setNodeData?.((data) => {
                                                                    const action = data.interactive?.action as WhatsappListAction
                                                                    action.sections[index].rows = action.sections[index].rows.filter(
                                                                        (item) => item.id !== button.id
                                                                    )

                                                                    if (action.sections[index].rows.length === 0) {
                                                                        action.sections = action.sections.filter(
                                                                            (_, item_index) => item_index !== index
                                                                        )
                                                                    }
                                                                    return { ...data, interactive: { ...data.interactive!, action: action } }
                                                                })
                                                            }
                                                            sx={{ color: "secondary.main" }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    ),
                                                    sx: { color: darkMode ? "primary.main" : "secondary.main" },
                                                }}
                                            />
                                        ))}
                                        {!(isMobile && section.rows.length === 10) && (
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    marginTop: isMobile ? "5vw" : "0.5vw",
                                                }}
                                                onClick={() =>
                                                    props.setNodeData?.((data) => {
                                                        const action = data.interactive?.action as WhatsappListAction
                                                        action.sections[index].rows.push({ description: "", id: uid(), title: "" })
                                                        return { ...data, interactive: { ...data.interactive!, action: action } }
                                                    })
                                                }
                                                disabled={section.rows.length === 10}
                                            >
                                                Nova opção
                                            </Button>
                                        )}
                                    </Box>
                                }
                                arrow
                                open={props.edittingButton === section.title + index.toString()}
                            >
                                <Button
                                    variant="text"
                                    // fullWidth
                                    sx={{
                                        textTransform: "none",
                                        color: "text.secondary",
                                        fontWeight: "bold",
                                        borderTop: "1px solid",
                                        borderColor: darkMode
                                            ? custom_colors.darkMode_interactiveMessageBorder
                                            : custom_colors.lightMode_interactiveMessageBorder,
                                        borderRadius: 0,
                                        margin: "0 -0.5vw",
                                        minWidth: "10vw",
                                    }}
                                    startIcon={<List />}
                                    onClick={() => props.editButton(section.title + index.toString())}
                                >
                                    {section.title}
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>
                </ClickAwayListener>
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

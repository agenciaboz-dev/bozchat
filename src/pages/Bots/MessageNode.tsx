import React, { useContext, useMemo, useState } from "react"
import { Avatar, Box, Button, Chip, IconButton, Menu, MenuItem, Paper, TextField, Typography, useTheme } from "@mui/material"
import { AddCircle, Delete, Edit, List, Refresh, Reply, Report } from "@mui/icons-material"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { NodeModal } from "./NodeModal"
import { FlowNode } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import BotContext from "../../contexts/bot.context"
import { custom_colors } from "../../style/colors"
import { WhastappButtonAction } from "../../types/server/class/Nagazap"

interface MessageNodeProps extends FlowNode {}

export const MessageNode: React.FC<MessageNodeProps> = (node) => {
    const theme = useTheme()
    const { darkMode } = useDarkMode()
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [mouseOver, setMouseOver] = useState(false)
    const { setLoopingNodeId, loopingNodeId, setActionsTab } = useContext(BotContext)

    const children = useMemo(() => (node.data.getChildren ? node.data.getChildren(node.id) : []), [node])
    const misconfigured_action = useMemo(() => node.data.actions?.find((action) => action.settings.misconfigured), [node.data.actions])

    const response_children = !!children.length && children.every((node) => node.type === "response")
    const can_add_children = !node.data.next_node_id && (children.length === 0 || response_children)

    const closeMenu = () => setMenuAnchor(null)

    const startAddingLoop = () => {
        setLoopingNodeId(node.id)
        closeMenu()
    }

    const addLoop = () => {
        console.log({ from: loopingNodeId, to: node.id })
        if (!loopingNodeId) return
        node.data.addLoop({ from: loopingNodeId, to: node.id })
    }

    const addNode = (type: "message" | "response") => {
        node.data.onAddChild(type)
        closeMenu()
    }

    const buttonsQuantity = node.data?.interactive?.type === "button" ? (node.data.interactive.action as WhastappButtonAction).buttons?.length : 0

    return (
        <>
            <Paper
                sx={{
                    flexDirection: "column",
                    height: nodeHeight,
                    width: nodeWidth,
                    bgcolor: custom_colors.lightMode_botEmittedMsg,
                    padding: 1,
                    position: "relative",
                    borderTopRightRadius: 0,
                }}
                elevation={5}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <TrianguloFudido alignment="right" color={darkMode ? custom_colors.darkMode_botEmittedMsg : custom_colors.lightMode_botEmittedMsg} />
                {node.data.media && (
                    <Paper sx={{ position: "absolute", top: -(nodeWidth / 8), left: -(nodeWidth / 8), borderRadius: "100%", pointerEvents: "none" }}>
                        {node.data?.media?.type === "image" && (
                            <Avatar
                                variant="rounded"
                                sx={{
                                    width: nodeWidth / 4,
                                    height: nodeWidth / 4,
                                    objectFit: "cover",
                                    borderRadius: "100%",
                                }}
                                src={node.data.media.url}
                            />
                        )}

                        {node.data.media.type === "video" && (
                            <video
                                src={node.data.media.url}
                                style={{ width: nodeWidth / 4, height: nodeWidth / 4, objectFit: "cover", borderRadius: "100%" }}
                                autoPlay
                                loop
                                muted
                            />
                        )}
                    </Paper>
                )}
                {node.data.value ? (
                    <TextField
                        value={node.data.value}
                        multiline
                        InputProps={{ sx: { fontSize: "0.8rem", padding: 1, color: "secondary.main" }, readOnly: true }}
                        inputProps={{ style: { cursor: "pointer" } }}
                        rows={
                            node.data?.interactive?.type === "button"
                                ? buttonsQuantity === 3
                                    ? 1
                                    : buttonsQuantity === 2
                                    ? 2
                                    : 3
                                : node.data?.interactive?.type === "list"
                                ? 3
                                : 5
                        }
                        onClick={() => (loopingNodeId ? addLoop() : node.data.editNode(node))}
                    />
                ) : (
                    <Button
                        color="secondary"
                        sx={{ alignItems: "center", gap: 0.5, flexDirection: "column" }}
                        onClick={() => node.data.editNode(node)}
                    >
                        <Edit color="secondary" sx={{ width: 45, height: "auto" }} />
                        Inserir resposta
                    </Button>
                )}
                {node.data?.interactive?.type === "button" && (
                    <Box
                        sx={{ flexDirection: "column", alignItems: "flex-start", padding: "0.2rem" }}
                        onClick={() => (loopingNodeId ? addLoop() : node.data.editNode(node))}
                    >
                        {(node.data.interactive.action as WhastappButtonAction).buttons?.map((button) => (
                            <Button
                                variant="text"
                                sx={{
                                    textTransform: "none",
                                    color: "secondary.main",
                                    padding: 0,
                                    fontSize: "0.8rem",
                                    pointerEvents: "none",
                                    minWidth: "auto",
                                }}
                                startIcon={<Reply />}
                            >
                                {button.reply.title}
                            </Button>
                        ))}
                    </Box>
                )}
                {node.data?.interactive?.type === "list" && (
                    <Box
                        sx={{ flexDirection: "column", alignItems: "flex-start", padding: "0.2rem" }}
                        onClick={() => (loopingNodeId ? addLoop() : node.data.editNode(node))}
                    >
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "none",
                                color: "secondary.main",
                                padding: 0,
                                fontSize: "0.8rem",
                                pointerEvents: "none",
                                minWidth: "auto",
                            }}
                            startIcon={<List />}
                        >
                            (Lista de opções)
                        </Button>
                    </Box>
                )}
                <Handle type="target" position={Position.Top} />
                {can_add_children && (
                    <Box sx={{ justifyContent: "center" }}>
                        <IconButton
                            sx={{ position: "absolute", bottom: -20 }}
                            onClick={(ev) => (response_children ? node.data.onAddChild("response") : setMenuAnchor(ev.currentTarget))}
                        >
                            <AddCircle />
                        </IconButton>
                    </Box>
                )}
                {mouseOver && (
                    <Box
                        sx={{
                            justifyContent: "flex-end",
                            position: "absolute",
                            bottom: -20,
                            right: 0,
                        }}
                    >
                        {node.data.deleteNode && (
                            <IconButton onClick={() => node.data.deleteNode!(node)}>
                                <Delete sx={{}} />
                            </IconButton>
                        )}
                    </Box>
                )}
                <Handle type="source" position={Position.Bottom} style={{}} isConnectable={false} />
                <Menu
                    open={!!menuAnchor}
                    anchorEl={menuAnchor}
                    onClose={closeMenu}
                    anchorOrigin={{ horizontal: "center", vertical: "center" }}
                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                    MenuListProps={{ sx: { bgcolor: "background.default" } }}
                >
                    <MenuItem onClick={() => addNode("message")}>Resposta do bot</MenuItem>
                    <MenuItem onClick={() => addNode("response")}>Interação do usuário</MenuItem>
                    <MenuItem onClick={() => startAddingLoop()}>Iniciar loop</MenuItem>
                </Menu>
            </Paper>
            {node.data.actions && node.data.actions.length > 0 && (
                <Chip
                    color={misconfigured_action ? "error" : "success"}
                    size="small"
                    icon={misconfigured_action ? <Report /> : undefined}
                    label={`${node.data.actions.length} ${node.data.actions.length === 1 ? "ação" : "ações"}`}
                    sx={{ position: "absolute", bottom: -30, padding: "0 0.5vw" }}
                    onClick={() => {
                        node.data.editNode(node)
                        setActionsTab(true)
                    }}
                />
            )}
            <Typography sx={{ position: "absolute", top: -10, right: -35, color: "text.disabled" }}>Bot</Typography>
            {!!node.data.next_node_id && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -65,
                        left: 0,
                        width: 1,
                        alignItems: "center",
                        flexDirection: "column",
                        pointerEvents: "none",
                    }}
                >
                    <hr style={{ height: 40, color: theme.palette.warning.main, pointerEvents: "none" }} />
                    <Chip
                        icon={<Refresh />}
                        label={"loop"}
                        size="small"
                        color="warning"
                        sx={{ pointerEvents: "auto" }}
                        onClick={() => node.data.fitNodeView(node.data.next_node_id!)}
                    />
                </Box>
            )}
        </>
    )
}

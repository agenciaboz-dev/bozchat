import React, { useMemo, useState } from "react"
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { AddCircle, Delete, Edit } from "@mui/icons-material"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { NodeModal } from "./NodeModal"
import { FlowNode } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"

interface MessageNodeProps extends FlowNode {}

export const MessageNode: React.FC<MessageNodeProps> = (node) => {
    const { darkMode } = useDarkMode()
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [mouseOver, setMouseOver] = useState(false)

    const children = useMemo(() => (node.data.getChildren ? node.data.getChildren(node.id) : []), [node])

    const response_children = !!children.length && children.every((node) => node.type === "response")
    const can_add_children = children.length === 0 || response_children

    const closeMenu = () => setMenuAnchor(null)

    const bgcolor = "#0f6787"

    const addNode = (type: "message" | "response") => {
        node.data.onAddChild(type)
        closeMenu()
    }

    return (
        <>
            <Paper
                sx={{
                    flexDirection: "column",
                    height: nodeHeight,
                    width: nodeWidth,
                    bgcolor: bgcolor,
                    padding: 1,
                    position: "relative",
                    borderTopRightRadius: 0,
                }}
                elevation={5}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <TrianguloFudido alignment="right" color={darkMode ? "#287793" : "#0f6787"} />
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
                        inputProps={{ style: { cursor: "grab" } }}
                        rows={5}
                    />
                ) : (
                    // <Typography
                    //     sx={{
                    //         color: "secondary.main",
                    //         fontWeight: "bold",
                    //         whiteSpace: "pre-wrap",
                    //         maxHeight: nodeHeight,
                    //         overflow: "scroll",
                    //         // fontSize: "0.8rem",
                    //         margin: -2,
                    //         padding: 2,
                    //     }}
                    // >
                    //     {node.data.value}
                    // </Typography>
                    <Button
                        color="secondary"
                        sx={{ alignItems: "center", gap: 0.5, flexDirection: "column" }}
                        onClick={() => node.data.editNode(node)}
                    >
                        <Edit color="secondary" sx={{ width: 45, height: "auto" }} />
                        Inserir resposta
                    </Button>
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
                        {node.data.value && (
                            <IconButton onClick={() => node.data.editNode(node)}>
                                <Edit sx={{}} />
                            </IconButton>
                        )}
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
                </Menu>
            </Paper>
            <Typography sx={{ position: "absolute", top: -10, right: -35, color: "text.disabled" }}>Bot</Typography>
        </>
    )
}

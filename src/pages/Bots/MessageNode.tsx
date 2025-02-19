import React, { useState } from "react"
import { Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { FlowNode } from "./FlowLayout"
import { AddCircle, Delete, Edit } from "@mui/icons-material"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { NodeModal } from "./NodeModal"

interface MessageNodeProps extends FlowNode {}

export const MessageNode: React.FC<MessageNodeProps> = (node) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [mouseOver, setMouseOver] = useState(false)

    const closeMenu = () => setMenuAnchor(null)

    const index = Number(node.id.split("node_")[1])

    const bgcolor = "#0f6787"

    const addNode = (type: "message" | "response") => {
        node.data.onAddChild(type)
        closeMenu()
    }

    return (
        <Paper
            sx={{
                flexDirection: "column",
                height: nodeHeight,
                width: nodeWidth,
                bgcolor: bgcolor,
                padding: 2,
                position: "relative",
                borderTopRightRadius: 0,
            }}
            elevation={5}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
        >
            <TrianguloFudido alignment="right" color={"#287793"} />

            {node.data.value ? (
                <Typography
                    sx={{
                        color: "secondary.main",
                        fontWeight: "bold",
                        whiteSpace: "pre-wrap",
                        maxHeight: nodeHeight,
                        overflow: "scroll",
                        margin: -2,
                        padding: 2,
                    }}
                >
                    {node.data.value}
                </Typography>
            ) : (
                <Button color="secondary" sx={{ alignItems: "center", gap: 0.5, flexDirection: "column" }} onClick={() => node.data.editNode(node)}>
                    <Edit color="secondary" sx={{ width: 45, height: "auto" }} />
                    Insira um valor
                </Button>
            )}

            <Box
                sx={{
                    justifyContent: "flex-end",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    transition: "0.2s",
                    opacity: mouseOver ? 1 : 0,
                }}
            >
                <IconButton onClick={() => node.data.deleteNode(node)}>
                    <Delete sx={{ width: 20, height: "auto" }} />
                </IconButton>
                {node.data.value && (
                    <IconButton onClick={() => node.data.editNode(node)}>
                        <Edit sx={{ width: 20, height: "auto" }} />
                    </IconButton>
                )}
            </Box>

            <Handle type="target" position={Position.Top} />

            {mouseOver && (
                <Box sx={{ justifyContent: "center" }}>
                    {/* {data.lastNode && ( */}
                    <IconButton sx={{ position: "absolute", bottom: -20 }} onClick={() => node.data.onAddChild("message")}>
                        <AddCircle />
                    </IconButton>
                    {/* // )} */}
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
                <MenuItem onClick={() => addNode("message")}>Mensagem</MenuItem>
                <MenuItem onClick={() => addNode("response")}>Resposta</MenuItem>
            </Menu>
        </Paper>
    )
}

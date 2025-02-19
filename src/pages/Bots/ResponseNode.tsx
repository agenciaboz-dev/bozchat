import React, { useState } from "react"
import { Box, Button, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import { FlowNode } from "./FlowLayout"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { AddCircle, Delete, Edit } from "@mui/icons-material"
import { TrianguloFudido } from "../Zap/TrianguloFudido"

interface ResponseNodeProps extends FlowNode {}

export const ResponseNode: React.FC<ResponseNodeProps> = (node) => {
    const [mouseOver, setMouseOver] = useState(false)

    const index = Number(node.id.split("node_")[1])
    const topHandle = index !== 0

    const bgcolor = "#2a323c"

    return (
        <Paper
            sx={{
                flexDirection: "column",
                height: nodeHeight,
                width: nodeWidth,
                bgcolor: "background.default",
                padding: 2,
                position: "relative",
                borderTopLeftRadius: 0,
            }}
            elevation={5}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
        >
            <TrianguloFudido alignment="left" color={bgcolor} />

            {topHandle && <Handle type="target" position={Position.Top} />}

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

            <Handle type="source" position={Position.Bottom} style={{}} isConnectable={false} />

            {mouseOver && (
                <Box sx={{ justifyContent: "center" }}>
                    {/* {data.lastNode && ( */}
                    <IconButton sx={{ position: "absolute", bottom: -20 }} onClick={() => node.data.onAddChild("message")}>
                        <AddCircle />
                    </IconButton>
                    {/* // )} */}
                </Box>
            )}
        </Paper>
    )
}

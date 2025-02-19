import React, { useState } from "react"
import { Box, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import { FlowNode } from "./FlowLayout"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { AddCircle } from "@mui/icons-material"
import { TrianguloFudido } from "../Zap/TrianguloFudido"

interface ResponseNodeProps extends FlowNode {}

export const ResponseNode: React.FC<ResponseNodeProps> = (node) => {
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
        >
            <TrianguloFudido alignment="left" color={bgcolor} />

            {topHandle && <Handle type="target" position={Position.Top} />}

            <Typography sx={{ color: "secondary.main", fontWeight: "bold" }}>Resposta: </Typography>
            <Typography>{node.data.value}</Typography>

            <Handle type="source" position={Position.Bottom} style={{}} isConnectable={false} />

            <Box sx={{ justifyContent: "center" }}>
                {/* {data.lastNode && ( */}
                <IconButton sx={{ position: "absolute", bottom: -20 }} onClick={() => node.data.onAddChild("message")}>
                    <AddCircle />
                </IconButton>
                {/* // )} */}
            </Box>
        </Paper>
    )
}

import React, { useMemo, useState } from "react"
import { Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { nodeHeight, nodeWidth } from "./CustomNode"
import { Handle, Position } from "@xyflow/react"
import { AddCircle, Delete, Edit, EmergencyRecording } from "@mui/icons-material"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { FlowNode } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { custom_colors } from "../../style/colors"

interface ResponseNodeProps extends FlowNode {}

export const ResponseNode: React.FC<ResponseNodeProps> = (node) => {
    const { darkMode } = useDarkMode()
    const [mouseOver, setMouseOver] = useState(false)

    const children = useMemo(() => (node.data.getChildren ? node.data.getChildren(node.id) : []), [node])

    const can_add_children = children.length === 0

    const topHandle = node.id !== "node_0"

    return (
        <>
            <Paper
                sx={{
                    flexDirection: "column",
                    height: nodeHeight,
                    width: nodeWidth,
                    bgcolor: "background.default",
                    padding: 1,
                    position: "relative",
                    borderTopLeftRadius: 0,
                }}
                elevation={5}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <TrianguloFudido alignment="left" color={darkMode ? custom_colors.darkMode_botReceivedMsg : custom_colors.lightMode_botReceivedMsg} />

                {topHandle && <Handle type="target" position={Position.Top} />}

                {node.data.value ? (
                    <TextField
                        value={node.data.value}
                        multiline
                        InputProps={{ sx: { fontSize: "0.8rem", padding: 1, color: "text.secondary" }, readOnly: true }}
                        inputProps={{ style: { cursor: "grab" } }}
                        rows={5}
                        onClick={() => node.data.editNode(node)}
                    />
                ) : (
                    // <Typography
                    //     sx={{
                    //         color: "text.secondary",
                    //         fontWeight: "bold",
                    //         whiteSpace: "pre-wrap",
                    //         maxHeight: nodeHeight,
                    //         overflow: "scroll",
                    //         margin: -2,
                    //         padding: 2,
                    //     }}
                    // >
                    //     {node.data.value}
                    // </Typography>
                    <Button
                        sx={{ alignItems: "center", gap: 0.5, flexDirection: "column", margin: "0 -1vw", height: "100%", color: "text.secondary" }}
                        onClick={() => node.data.editNode(node)}
                    >
                        <Typography sx={{ fontWeight: "bold", fontSize: "5rem", lineHeight: "0.1vw", marginTop: "1.6vw" }}>*</Typography>
                        Qualquer mensagem
                    </Button>
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
                        {/* {node.data.value && (
                            <IconButton onClick={() => node.data.editNode(node)}>
                                <Edit sx={{}} />
                            </IconButton>
                        )} */}
                        {node.data.deleteNode && (
                            <IconButton onClick={() => node.data.deleteNode!(node)}>
                                <Delete sx={{}} />
                            </IconButton>
                        )}
                    </Box>
                )}

                <Handle type="source" position={Position.Bottom} style={{}} isConnectable={false} />

                {can_add_children && (
                    <Box sx={{ justifyContent: "center" }}>
                        {/* {data.lastNode && ( */}
                        <IconButton sx={{ position: "absolute", bottom: -20 }} onClick={() => node.data.onAddChild("message")}>
                            <AddCircle />
                        </IconButton>
                        {/* // )} */}
                    </Box>
                )}
            </Paper>
            <Typography sx={{ position: "absolute", top: -10, left: -45, color: "text.disabled" }}>User</Typography>
        </>
    )
}

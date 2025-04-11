import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Drawer, IconButton, Paper, Tab, Tabs, Typography } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { Close, Save } from "@mui/icons-material"
import { BotMessageTab } from "./BotMessageTab"
import { BotActionsTab } from "./BotActionsTab"
import { BotLoopTab } from "./BotLoopTab"
import { useSnackbar } from "burgos-snackbar"

interface NodeDrawerProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node_id: string, value: FlowNodeData) => void
    nodes: FlowNode[]
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({ node, onClose, saveNode, nodes }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { snackbar } = useSnackbar()

    const [nodeData, setNodeData] = useState(node?.data)
    const [currentTab, setCurrentTab] = useState<"message" | "actions" | "loop">("message")

    const onUpdateData = (data: FlowNodeData) => {
        if (!node?.id) return

        setNodeData(data)
    }

    const save = () => {
        if (!node || !nodeData) return
        saveNode(node.id, nodeData)
        snackbar({ severity: "success", text: "Salvo" })
    }

    useEffect(() => {
        setNodeData(node?.data)
        console.log("aaaa")
        console.log(node?.data)
    }, [node?.data])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.focus()
        }
    }, [inputRef.current])

    return (
        <Drawer open={!!node} onClose={onClose} anchor="right" variant="persistent">
            <Paper sx={{ flexDirection: "column", bgcolor: "background.default", flex: 1, padding: "1vw", maxWidth: "25vw", width: "25vw" }}>
                <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>
                        {node?.type === "message" ? "Resposta do bot" : "Resposta do usuário"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

                {node?.type === "message" && (
                    <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)} variant="fullWidth">
                        <Tab value={"message"} label="Mensagem" />
                        <Tab value={"actions"} label="Ações" />
                        <Tab value={"loop"} label="Loop" />
                    </Tabs>
                )}

                {currentTab === "message" && <BotMessageTab node={node} saveNode={saveNode} setNodeData={setNodeData} nodeData={nodeData} />}
                {currentTab === "actions" && <BotActionsTab node={node} data={nodeData} updateData={onUpdateData} saveNode={saveNode} />}
                {currentTab === "loop" && (
                    <BotLoopTab nodes={nodes} node={node} data={nodeData} updateData={onUpdateData} saveNode={saveNode} onClose={onClose} />
                )}

                {(currentTab === "actions" || currentTab === "loop") && (
                    <Button variant="contained" startIcon={<Save />} sx={{ alignSelf: "flex-end", marginTop: "1vw" }} onClick={save}>
                        salvar
                    </Button>
                )}
            </Paper>
        </Drawer>
    )
}

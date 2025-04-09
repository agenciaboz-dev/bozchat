import React, { useEffect, useRef, useState } from "react"
import { Box, Drawer, IconButton, Paper, Tab, Tabs, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { Close } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { BotMessageTab } from "./BotMessageTab"
import { BotActionsTab } from "./BotActionsTab"

interface NodeDrawerProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node_id: string, value: FlowNodeData) => void
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({ node, onClose, saveNode }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { snackbar } = useSnackbar()

    const [nodeData, setNodeData] = useState(node?.data)
    const [currentTab, setCurrentTab] = useState<"message" | "actions">("message")

    const onUpdateData = (data: FlowNodeData) => {
        if (!node?.id) return

        setNodeData(data)
    }

    useEffect(() => {
        setNodeData(node?.data)
        setCurrentTab("message")
    }, [node])

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
                    </Tabs>
                )}

                {currentTab === "message" && <BotMessageTab node={node} saveNode={saveNode} setNodeData={setNodeData} nodeData={nodeData} />}
                {currentTab === "actions" && <BotActionsTab node={node} data={nodeData} updateData={onUpdateData} saveNode={saveNode} />}
            </Paper>
        </Drawer>
    )
}

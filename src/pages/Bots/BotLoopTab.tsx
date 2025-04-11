import React from "react"
import { Box } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { TextInfo } from "./TextInfo"

interface BotLoopTabProps {
    data?: FlowNodeData
    updateData: (data: FlowNodeData) => void
    saveNode: (node_id: string, value: FlowNodeData) => void
    node: FlowNode | null
    nodes: FlowNode[]
}

export const BotLoopTab: React.FC<BotLoopTabProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw" }}>
            <Box sx={{ flexDirection: "column", gap: "1vw", padding: "1vw", bgcolor: "background.default", flex: 1, borderRadius: "0.5vw" }}>
                <TextInfo>Após enviar esta mensagem, a próxima etapa do fluxo será a mensagem selecionada abaixo.</TextInfo>
            </Box>
        </Box>
    )
}

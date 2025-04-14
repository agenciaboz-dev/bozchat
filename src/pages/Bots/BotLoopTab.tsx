import React, { useContext, useMemo } from "react"
import { Box, Checkbox, IconButton, Paper, Tooltip, Typography } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { TextInfo } from "./TextInfo"
import { BotMessageContainer } from "./BotMessageContainer"
import { Accordion } from "../../components/Accordion"
import BotContext from "../../contexts/bot.context"
import { InfoOutlined } from "@mui/icons-material"

interface BotLoopTabProps {
    data?: FlowNodeData
    updateData: (data: FlowNodeData) => void
    saveNode: (node_id: string, value: FlowNodeData) => void
    node: FlowNode | null
    nodes: FlowNode[]
    onClose: () => void
}

export const BotLoopTab: React.FC<BotLoopTabProps> = (props) => {
    const { setLoopingNodeId } = useContext(BotContext)
    const loopingNode = useMemo(() => props.nodes.find((node) => node.id === props.data?.next_node_id), [props.data, props.nodes])

    const removeLoop = () => {
        if (!props.data) return

        props.updateData({ ...props.data, next_node_id: undefined })
    }

    const startLoop = () => {
        setLoopingNodeId(props.node?.id || null)
        props.onClose()
    }

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", padding: "1vw", bgcolor: "background.default", flex: 1, borderRadius: "0.5vw" }}>
            <TextInfo>Após enviar esta mensagem, a próxima etapa do fluxo será a mensagem selecionada abaixo.</TextInfo>

            <Accordion
                expanded={!!loopingNode}
                titleElement={
                    <Paper
                        sx={{
                            alignItems: "center",
                            flex: 1,
                            color: loopingNode ? "primary.main" : "secondary.main",
                            padding: "0.5vw",
                            justifyContent: "space-between",
                        }}
                        onClick={() => (loopingNode ? removeLoop() : startLoop())}
                    >
                        <Box sx={{ alignItems: "center" }}>
                            <Checkbox checked={!!loopingNode} />
                            <Typography>Ativar loop</Typography>
                        </Box>
                        <Tooltip arrow title="Ao marcar esta opção, você deve selecionar qual etapa do fluxo será a próxima.">
                            <IconButton onClick={(e) => e.stopPropagation()}>
                                <InfoOutlined />
                            </IconButton>
                        </Tooltip>
                    </Paper>
                }
                expandedElement={
                    <Box sx={{ flexDirection: "column", paddingRight: "0.5vw", flex: 1, color: "secondary.main", marginTop: "0.5vw" }}>
                        {loopingNode && <BotMessageContainer node={loopingNode} nodeData={loopingNode.data} />}
                    </Box>
                }
            />
        </Box>
    )
}

import React, { useContext, useMemo, useState } from "react"
import { Box, Checkbox, ClickAwayListener, IconButton, Paper, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { TextInfo } from "./TextInfo"
import { BotMessageContainer } from "./BotMessageContainer"
import { Accordion } from "../../components/Accordion"
import BotContext from "../../contexts/bot.context"
import { InfoOutlined } from "@mui/icons-material"
import { useDarkMode } from "../../hooks/useDarkMode"
import { custom_colors } from "../../style/colors"

interface BotLoopTabProps {
    data?: FlowNodeData
    updateData: (data: FlowNodeData) => void
    saveNode: (node_id: string, value: FlowNodeData) => void
    node: FlowNode | null
    nodes: FlowNode[]
    onClose: () => void
}

export const BotLoopTab: React.FC<BotLoopTabProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
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

    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [hovered, setHovered] = useState(false)

    const handleClick = () => {
        setTooltipOpen((prev) => !prev)
    }

    const handleClickAway = () => {
        setTooltipOpen(false)
    }

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: isMobile ? "3vw" : "1vw",
                padding: isMobile ? "5vw" : "1vw",
                bgcolor: darkMode ? "background.default" : custom_colors.lightMode_botNodeDrawerBackground,
                border: darkMode ? `1px solid ${custom_colors.darkMode_border}` : `1px solid ${custom_colors.lightMode_border}`,
                boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                flex: 1,
                borderRadius: isMobile ? "4px" : "0.5vw",
            }}
        >
            <TextInfo>Após enviar esta mensagem, a próxima etapa do fluxo será a mensagem selecionada abaixo.</TextInfo>

            <Accordion
                expanded={!!loopingNode}
                titleElement={
                    <Paper
                        sx={{
                            boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                            alignItems: "center",
                            flex: 1,
                            color: loopingNode ? "primary.main" : "text.secondary",
                            padding: "0.5vw",
                            justifyContent: "space-between",
                            backgroundColor: darkMode ? undefined : "background.default",
                        }}
                        onClick={() => (loopingNode ? removeLoop() : startLoop())}
                    >
                        <Box sx={{ alignItems: "center" }}>
                            <Checkbox checked={!!loopingNode} />
                            <Typography sx={{ fontSize: isMobile ? "0.8rem" : undefined }}>Ativar loop</Typography>
                        </Box>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Tooltip
                                arrow
                                title="Ao marcar esta opção, você deve selecionar qual etapa do fluxo será a próxima."
                                open={tooltipOpen || (!isMobile && hovered)}
                                onClose={handleClickAway}
                                disableHoverListener={isMobile}
                                placement="bottom"
                            >
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClick()
                                    }}
                                    onMouseEnter={() => !isMobile && setHovered(true)}
                                    onMouseLeave={() => !isMobile && setHovered(false)}
                                >
                                    <InfoOutlined />
                                </IconButton>
                            </Tooltip>
                        </ClickAwayListener>
                    </Paper>
                }
                expandedElement={
                    <Box sx={{ flexDirection: "column", paddingRight: "0.5vw", flex: 1, color: "text.secondary", marginTop: "0.5vw" }}>
                        {loopingNode && <BotMessageContainer node={loopingNode} nodeData={loopingNode.data} />}
                    </Box>
                }
            />
        </Box>
    )
}

import React, { useCallback, useState } from "react"
import { Box, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { Handle, NodeProps, Position } from "@xyflow/react"
import { Bot, FlowObject } from "../../types/server/class/Bot/Bot"
import { Add, AddCircle, Close } from "@mui/icons-material"

interface FlowNodeProps extends NodeProps {
    data: {
        onAddChild: () => void
    }
}

const FlowItem: React.FC<{
    disabled?: boolean
    value?: string
    index: number
    title: string
    onChange: (value: string, index: number) => void
    onDelete: (index: number) => void
    multiline?: boolean
}> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", gap: "0.5vw", position: "relative" }}>
            <TextField
                disabled={props.disabled}
                variant="standard"
                value={props.value}
                onChange={(ev) => props.onChange(ev.target.value, props.index)}
                multiline={props.multiline}
                minRows={props.multiline ? 2 : undefined}
                label={props.title}
            />

            {!props.disabled && (
                <IconButton sx={{ position: "absolute", right: "-1vw", top: "-1vw" }} onClick={() => props.onDelete(props.index)}>
                    <Close />
                </IconButton>
            )}
        </Box>
    )
}

export const FlowNode: React.FC<FlowNodeProps> = ({ data }) => {
    const flow = data.flow

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const closeMenu = () => setMenuAnchor(null)

    const onChangeValue = (value: string, type: FlowObject["type"], index: number) => {
        const updated_flow = flow

        if (type === "message") {
            updated_flow.message = value
        }

        if (type === "response") {
            updated_flow.response![index].trigger = value
        }

        data.onChange(updated_flow)
    }

    const onAddFlow = (type: FlowObject["type"]) => {
        const new_flow: FlowObject = { type, position: flow.position }

        if (type === "message") {
            new_flow.message = ""
        }

        if (type === "response") {
            new_flow.response = [{ trigger: "", flow: [] }]
            new_flow.position.push(0)
        }

        data.addFlow(new_flow)
        closeMenu()
    }

    return (
        <>
            <Paper sx={{ padding: "2vw", flexDirection: "column" }}>
                {!data.disabled && <Handle type="target" position={Position.Top} isConnectable={false} />}

                {flow.type === "response" ? (
                    <Box sx={{ gap: "1vw" }}>
                        {flow.response!.map((response, index) => (
                            <FlowItem
                                key={response.trigger}
                                index={index}
                                title="Gatilho:"
                                value={response.trigger}
                                onChange={(value) => onChangeValue(value, "response", index)}
                                disabled={data.disabled}
                                onDelete={data.onRemoveFlow}
                            />
                        ))}
                    </Box>
                ) : (
                    <FlowItem
                        index={0}
                        title="Mensagem:"
                        value={flow.message}
                        onChange={(value) => onChangeValue(value, "message", 0)}
                        multiline
                        onDelete={data.onRemoveFlow}
                    />
                )}

                <Handle type="source" position={Position.Bottom} id="a" style={{}} isConnectable={false} />
                <Box sx={{ position: "relative", justifyContent: "center" }}>
                    {data.lastNode && (
                        <IconButton
                            sx={{ position: "absolute", top: "0.75vw", visibility: menuAnchor ? "hidden" : undefined }}
                            onClick={(ev) => (flow.type === "message" ? setMenuAnchor(ev.currentTarget) : onAddFlow("message"))}
                        >
                            <AddCircle />
                        </IconButton>
                    )}
                </Box>
            </Paper>

            <Menu
                open={!!menuAnchor}
                anchorEl={menuAnchor}
                onClose={closeMenu}
                anchorOrigin={{ horizontal: "center", vertical: "center" }}
                transformOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <MenuItem onClick={() => onAddFlow("message")}>Mensagem</MenuItem>
                <MenuItem onClick={() => onAddFlow("response")}>Resposta</MenuItem>
            </Menu>
        </>
    )
}

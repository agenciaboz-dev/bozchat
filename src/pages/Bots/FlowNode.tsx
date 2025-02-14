import React, { useCallback } from "react"
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material"
import { Handle, Position } from "@xyflow/react"
import { Bot, FlowObject } from "../../types/server/class/Bot/Bot"
import { Add, AddCircle } from "@mui/icons-material"

interface FlowNodeProps {
    data: {
        flow: FlowObject
        disabled?: boolean
        index: number
        onChange: (flow: FlowObject, index: number) => void
        addFlow: (flow: FlowObject) => void
        lastNode?: boolean
    }
}

export const FlowNode: React.FC<FlowNodeProps> = ({ data }) => {
    const flow = data.flow

    const onChangeTrigger = (text: string, index: number) => {
        //
    }

    const onAddFlow = () => {
        const new_flow: FlowObject = { type: "message", message: "Testando essa bagaça" }
        data.addFlow(new_flow)
    }

    return (
        <Paper sx={{ padding: "2vw", flexDirection: "column" }}>
            <Handle type="target" position={Position.Top} />

            {flow.type === "response" ? (
                <Box sx={{ gap: "1vw" }}>
                    {flow.response!.map((response, index) => (
                        <Box key={response.trigger} sx={{ flexDirection: "column", gap: "0.5vw" }}>
                            <Typography sx={{ fontWeight: "bold" }}>Gatilho:</Typography>
                            <TextField
                                disabled={data.disabled}
                                variant="standard"
                                value={response.trigger}
                                onChange={(ev) => onChangeTrigger(ev.target.value, index)}
                            />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box>
                    <Typography>{flow.message}</Typography>
                </Box>
            )}

            <Handle type="source" position={Position.Bottom} id="a" style={{}} />
            <Box sx={{ position: "relative", justifyContent: "center" }}>
                {data.lastNode && (
                    <IconButton sx={{ position: "absolute", top: "0.75vw" }} onClick={() => onAddFlow()}>
                        <AddCircle />
                    </IconButton>
                )}
            </Box>
        </Paper>
    )
}

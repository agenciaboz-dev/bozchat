import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Box, Typography } from "@mui/material"
import { Bot, FlowObject } from "../../types/server/class/Bot/Bot"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { ReactFlow } from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { FlowNode } from "./FlowNode"

interface FlowContainerProps {
    bot: Bot
}

const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
]
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

export const FlowContainer: React.FC<FlowContainerProps> = ({ bot }) => {
    const nodeTypes = useMemo(() => ({ flowObject: FlowNode }), [])
    const initial_flow: FlowObject = { type: "response", response: [{ trigger: bot.trigger, flow: bot.flow }] }

    const [flows, setFlows] = useState(bot.flow)
    const [edges, setEdges] = useState<
        {
            id: string
            source: string
            target: string
        }[]
    >([])

    const addFlow = (flow: FlowObject) => {
        const updated_flows = [...flows]
        updated_flows.push(flow)
        setFlows(updated_flows)
        const from = updated_flows.length - 2
        const target = updated_flows.length - 1

        const updated_edges = [...edges]
        updated_edges.push({ id: `e${from}-${target}`, source: from.toString(), target: target.toString() })
        setEdges(updated_edges)
    }

    const onChangeFlow = (flow: FlowObject, index: number) => {
        const updated_flows = [...flows]
        updated_flows[index] = flow
        setFlows(updated_flows)
    }

    const nodes = useMemo(
        () => [
            {
                id: "-1",
                type: "flowObject",
                position: { x: 0, y: 5 },
                data: { flow: initial_flow, index: -1, disabled: true, addFlow, lastNode: flows.length === 0 },
            },
            ...flows.map((flow, index) => ({
                id: index.toString(),
                type: "flowObject",
                position: { x: 0, y: (index + 1) * 200 },
                data: {
                    flow,
                    index,
                    onChange: onChangeFlow,
                    addFlow,
                    lastNode: flows.length === index + 1,
                },
            })),
        ],
        [flows]
    )

    useEffect(() => {
        console.log(edges)
    }, [edges])

    useEffect(() => {
        console.log(nodes)
    }, [nodes])

    return (
        // <TransformWrapper
        //     limitToBounds={false} // Ensure content doesn't snap back to bounds
        //     // minScale={0.5} // Minimum zoom level (can be adjusted as needed)
        //     // maxScale={3} // Maximum zoom level (can be adjusted as needed)
        // >
        //     <TransformComponent
        //         wrapperStyle={{ flex: 1, width: "100%", height: "100%", border: "1px solid red", cursor: "pointer" }}
        //         contentStyle={{ flex: 1, width: "100%", height: "100%" }}
        //     >
        //         <Box
        //             sx={{
        //                 flex: 1,
        //                 width: "100%",
        //                 height: "100%",
        //             }}
        //         >
        //         </Box>
        //     </TransformComponent>
        // </TransformWrapper>
        <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} />
    )
}

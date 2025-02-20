import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Background,
    ReactFlow,
    addEdge,
    ConnectionLineType,
    Panel,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    ReactFlowInstance,
    useReactFlow,
    ReactFlowJsonObject,
} from "@xyflow/react"
import dagre, { layout } from "@dagrejs/dagre"

import "@xyflow/react/dist/style.css"
import { CustomNodeComponent, nodeHeight, nodeWidth } from "./CustomNode"
import { Bot, FlowResponse } from "../../types/server/class/Bot/Bot"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { WagaLoading } from "../../components/WagaLoading"
import { Box } from "@mui/material"
import { ResponseNode } from "./ResponseNode"
import { MessageNode } from "./MessageNode"
import { NodeModal } from "./NodeModal"
import { useTheme } from "../../hooks/useTheme"

const position = { x: 0, y: 0 }
const edgeType = "smoothstep"

interface FlowLayoutProps {
    bot_id: string
    botInstances: ReactFlowJsonObject<Node, Edge>[]
    setBotInstances: React.Dispatch<React.SetStateAction<ReactFlowJsonObject<Node, Edge>[]>>
    undoToInstance: ReactFlowJsonObject<Node, Edge> | null
    setUndoToInstance: React.Dispatch<React.SetStateAction<ReactFlowJsonObject<Node, Edge> | null>>
}

export interface FlowNode extends Node {
    data: {
        onAddChild: (type: "message" | "response") => void
        value: string
        editNode: React.Dispatch<React.SetStateAction<FlowNode | null>>
        deleteNode: (node: FlowNode) => void
        // nodes: FlowNode[]
        // edges: FlowEdge[]
    }
}

interface FlowEdge extends Edge {
    type?: string
    animated?: boolean
}

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

export const FlowLayout: React.FC<FlowLayoutProps> = ({ bot_id, botInstances, setBotInstances, undoToInstance, setUndoToInstance }) => {
    const { company } = useUser()
    const { setViewport } = useReactFlow()
    const theme = useTheme()

    const [instance, setInstance] = useState<ReactFlowInstance<Node, FlowEdge> | null>(null)
    const [bot, setBot] = useState<Bot | null>(null)
    const [initializing, setInitializing] = useState(true)
    const [editingNode, setEditingNode] = useState<FlowNode | null>(null)

    const initialNodes: FlowNode[] = []

    const initialEdges: Edge[] = []

    // const updateLayout = (nodes: FlowNode[], edges: FlowEdge[], direction = "TB") => {
    //     const isHorizontal = direction === "LR"
    //     dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 100 })

    //     nodes.forEach((node) => {
    //         dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    //     })

    //     edges.forEach((edge) => {
    //         dagreGraph.setEdge(edge.source, edge.target)
    //     })

    //     dagre.layout(dagreGraph)

    //     const newNodes = nodes.map((node) => {
    //         const nodeWithPosition = dagreGraph.node(node.id)
    //         const newNode = {
    //             ...node,
    //             targetPosition: isHorizontal ? "left" : "top",
    //             sourcePosition: isHorizontal ? "right" : "bottom",
    //             // We are shifting the dagre node position (anchor=center center) to the top left
    //             // so it matches the React Flow node anchor point (top left).
    //             position: {
    //                 x: nodeWithPosition.x - nodeWidth / 2,
    //                 y: nodeWithPosition.y - nodeHeight / 2,
    //             },
    //         }

    //         return newNode
    //     })

    //     return { nodes: newNodes as FlowNode[], edges }
    // }

    const updateLayout = (nodes: FlowNode[], edges: FlowEdge[]): { nodes: FlowNode[]; edges: FlowEdge[] } => {
        const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
        dagreGraph.setGraph({ rankdir: "TB", ranksep: 100, nodesep: 100 })

        // Set custom node width and height
        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
        })

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target)
        })

        dagre.layout(dagreGraph)

        const updatedNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id)
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - nodeWidth / 2,
                    y: nodeWithPosition.y - nodeHeight / 2,
                },
            }
        })

        return { nodes: updatedNodes, edges }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = updateLayout(initialNodes, initialEdges)

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        []
    )

    const addNodeAndEdge = (
        sourceId: string,
        nodes: FlowNode[],
        setNodes: Function,
        edges: FlowEdge[],
        setEdges: Function,
        type: "response" | "message" = "response"
    ) => {
        const sourceNode = nodes.find((n) => n.id === sourceId)
        if (!sourceNode) return

        if (instance) {
            const flow = instance.toObject()
            setBotInstances((instances) => [...instances, flow])
        }

        const newNodeId = `node_${nodes.length}`
        const newNode: FlowNode = {
            id: newNodeId,
            type,
            position: { x: sourceNode.position.x, y: sourceNode.position.y + nodeHeight + 50 }, // Default offset for direct child
            data: {
                onAddChild: () => {},
                editNode: () => setEditingNode(null),
                deleteNode: () => {},
                value: "",
            },
        }

        const newNodes = [...nodes, newNode]
        const newEdges: FlowEdge[] = [
            ...edges,
            {
                id: `edge_${sourceId}-${newNodeId}`,
                source: sourceId,
                target: newNodeId,
                type: "smoothstep",
                animated: true,
                style: {
                    stroke: theme.colors.primary,
                    // strokeWidth: 5,
                    // strokeDasharray: 10,
                },
            },
        ]

        // Update layout to avoid overlap and maintain structure
        const layouted = updateLayout(newNodes, newEdges)
        setNodes(layouted.nodes)
        setEdges(layouted.edges)

        onSave()
    }

    const onSave = async () => {
        console.log("sav")
        setTimeout(async () => {
            if (instance) {
                console.log("ing")
                const flow = instance.toObject()

                try {
                    await api.patch("/company/bots", { instance: flow }, { params: { company_id: company?.id, bot_id: bot_id } })
                } catch (error) {
                    console.log(error)
                }
            }
        }, 500)
    }

    const fetchBot = async () => {
        try {
            const response = await api.get("/company/bots", { params: { company_id: company?.id, bot_id } })
            setBot(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setInitializing(false)
        }
    }

    const onEditNode = (node: FlowNode) => {
        const index = Number(node.id.split("node_")[1])
        const updated_nodes = [...nodes]
        updated_nodes[index] = node
        console.log(updated_nodes, index)
        // setNodes(updated_nodes)
        onSave()
    }

    const deleteNodeAndDescendants = useCallback((nodeId: string, nodes: FlowNode[], edges: FlowEdge[]) => {
        const nodesToDelete = new Set()
        const stack = [nodeId]

        while (stack.length > 0) {
            const currentId = stack.pop()
            nodesToDelete.add(currentId)

            // Find children (i.e., nodes that the current node points to via edges)
            const children = edges.filter((edge) => edge.source === currentId).map((edge) => edge.target)
            stack.push(...children)
        }

        const newNodes = nodes.filter((node) => !nodesToDelete.has(node.id))
        const newEdges = edges.filter((edge) => !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target))

        return { newNodes, newEdges }
    }, [])

    const reassignNodeIds = (nodes: FlowNode[], edges: FlowEdge[]) => {
        const idMapping = new Map()
        const newNodes = nodes.map((node, index) => {
            const oldId = node.id
            const newId = `node_${index}`
            idMapping.set(oldId, newId)
            return { ...node, id: newId }
        })

        const newEdges = edges.map((edge) => ({
            ...edge,
            source: idMapping.get(edge.source) || edge.source,
            target: idMapping.get(edge.target) || edge.target,
        }))

        return { newNodes, newEdges }
    }

    const onDeleteNode = useCallback(
        (node: FlowNode) => {
            if (instance) {
                const flow = instance.toObject()
                setBotInstances((instances) => [...instances, flow])
            }

            const { newNodes, newEdges } = deleteNodeAndDescendants(node.id, nodes, edges)
            const { newNodes: reassignedNodes, newEdges: reassignedEdges } = reassignNodeIds(newNodes, newEdges)
            const layouted = updateLayout(reassignedNodes, reassignedEdges)
            setNodes(layouted.nodes)
            setEdges(layouted.edges)
            onSave()
        },
        [deleteNodeAndDescendants, nodes, edges, setNodes, setEdges, onSave, reassignNodeIds]
    )

    // Example usage in your React component
    useEffect(() => {
        // Initial layout adjustment
        const layouted = updateLayout(nodes, edges)
        setNodes(layouted.nodes)
        setEdges(layouted.edges)
    }, [])

    useEffect(() => {
        setInitializing(true)
        fetchBot()
    }, [bot_id])

    useEffect(() => {
        console.log("a")
        setNodes((ns) =>
            ns.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    onAddChild: (type: "message" | "response") => addNodeAndEdge(node.id, nodes, setNodes, edges, setEdges, type),
                    deleteNode: (node) => onDeleteNode(node),
                    editNode: (node) => setEditingNode(node),
                },
            }))
        )
    }, [setNodes, setEdges, edges])

    useEffect(() => {
        if (bot) {
            const restoreFlow = async () => {
                const flow = bot.instance

                let nodes: FlowNode[] = (flow?.nodes as FlowNode[]) || [
                    {
                        id: "node_0",
                        type: "response",
                        data: {
                            value: bot.trigger,
                            onAddChild: (type: "message" | "response") => addNodeAndEdge("node_0", nodes, setNodes, edges, setEdges, type),
                        },
                        position,
                    },
                ]
                nodes[0].data.editNode = () => setEditingNode(nodes[0])

                let edges: Edge[] = []

                if (flow) {
                    const { x = 0, y = 0, zoom = 1 } = flow.viewport
                    edges = flow.edges
                    setViewport({ x, y, zoom })
                }

                const layouted = updateLayout(nodes, edges)
                setNodes(layouted.nodes)
                setEdges(layouted.edges)
            }

            restoreFlow()
        }
    }, [bot])

    useEffect(() => {
        console.log(nodes)
        if (instance) {
            // instance.fitView()
        }
    }, [nodes, instance])

    useEffect(() => {
        if (undoToInstance) {
            console.log({ undoToInstance })
            const restoreFlow = () => {
                const flow = undoToInstance

                const nodes: FlowNode[] = (flow?.nodes as FlowNode[]) || []
                const edges: Edge[] = flow.edges || []
                const { x = 0, y = 0, zoom = 1 } = flow.viewport
                setViewport({ x, y, zoom })

                const layouted = updateLayout(nodes, edges)
                setNodes(layouted.nodes)
                setEdges(layouted.edges)
                setUndoToInstance(null)
                onSave()
            }

            restoreFlow()
        }
    }, [undoToInstance])

    return initializing ? (
        <Box sx={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <WagaLoading />
        </Box>
    ) : (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // @ts-ignore
            nodeTypes={{ custom: CustomNodeComponent, response: ResponseNode, message: MessageNode }}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            // style={{ margin: "-2vw",  }}
            nodesDraggable={false}
            onInit={setInstance}
        >
            <Background />
            <NodeModal node={editingNode} onClose={() => setEditingNode(null)} saveNode={onEditNode} />
        </ReactFlow>
    )
}

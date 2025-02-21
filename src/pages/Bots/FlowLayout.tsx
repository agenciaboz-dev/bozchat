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
import { Bot, FlowEdge, FlowNode } from "../../types/server/class/Bot/Bot"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { WagaLoading } from "../../components/WagaLoading"
import { Box } from "@mui/material"
import { ResponseNode } from "./ResponseNode"
import { MessageNode } from "./MessageNode"
import { NodeModal } from "./NodeModal"
import { useTheme } from "../../hooks/useTheme"
import { uid } from "uid"

const position = { x: 0, y: 0 }
const edgeType = "smoothstep"

interface FlowLayoutProps {
    bot_id: string
    botInstances: ReactFlowJsonObject<Node, Edge>[]
    setBotInstances: React.Dispatch<React.SetStateAction<ReactFlowJsonObject<Node, Edge>[]>>
    undoToInstance: ReactFlowJsonObject<Node, Edge> | null
    setUndoToInstance: React.Dispatch<React.SetStateAction<ReactFlowJsonObject<Node, Edge> | null>>
}



const viewport_duration = 800

export const FlowLayout: React.FC<FlowLayoutProps> = ({ bot_id, botInstances, setBotInstances, undoToInstance, setUndoToInstance }) => {
    const { company } = useUser()
    const { setViewport } = useReactFlow()
    const theme = useTheme()

    const instance = useRef<ReactFlowInstance<Node, FlowEdge> | null>(null)

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

    const addNodeAndEdge = useCallback(
        (sourceId: string, type: "response" | "message" = "response") => {
            setNodes((nodes) => {
                const sourceNode = nodes.find((n) => n.id === sourceId)
                if (!sourceNode) return []

                if (instance.current) {
                    const flow = instance.current.toObject()
                    setBotInstances((instances) => [...instances, flow])
                }

                const newNodeId = `node_${uid()}`
                const newNode: FlowNode = {
                    id: newNodeId,
                    type,
                    position: { x: sourceNode.position.x, y: sourceNode.position.y + nodeHeight + 50 }, // Default offset for direct child
                    data: {
                        onAddChild: () => {},
                        editNode: () => setEditingNode(null),
                        deleteNode: () => {},
                        getChildren: () => [],
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
                        type: ConnectionLineType.SmoothStep,
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
                setEdges(layouted.edges)

                const addedNode = layouted.nodes.find((n) => n.id === newNodeId)
                if (addedNode && instance) {
                    const { x, y } = addedNode.position
                    instance.current?.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
                        zoom: 0.9,
                        duration: viewport_duration, // optional smooth animation (in ms)
                    })
                }

                onSave()

                return layouted.nodes
            })
        },
        [nodes, edges, setNodes, setEdges]
    )

    const onSave = async () => {
        console.log("sav")
        setTimeout(async () => {
            console.log({ instance_on_save: instance })
            if (instance.current) {
                console.log("ing")
                const flow = instance.current.toObject()

                try {
                    await api.patch("/company/bots", { instance: flow }, { params: { company_id: company?.id, bot_id: bot_id } })
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log("sem instancia")
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
            setTimeout(() => setInitializing(false), 1000)
        }
    }

    const onEditNode = (node_id: string, value: string) => {
        if (instance.current) {
            //this is just for the undo function
            const flow = instance.current.toObject()
            setBotInstances((instances) => [...instances, flow])
        }

        const updatedNodes = nodes.map((n) => (n.id === node_id ? { ...n, data: { ...n.data, value: value } } : n))
        console.log({ updatedNodes })
        setNodes(updatedNodes)
        onSave()
    }

    const getChildren = (parentId: string, type: "direct" | "recursive" = "direct") => {
        if (type === "direct") {
            const children_ids = edges.filter((edge) => edge.source === parentId).map((edge) => edge.target)
            const children = nodes.filter((node) => children_ids.includes(node.id))
            return children
        }

        const children = new Set<FlowNode>()
        const stack = [parentId]

        while (stack.length > 0) {
            const currentId = stack.pop()
            if (currentId) {
                const node = nodes.find((node) => node.id === currentId)
                if (node) {
                    children.add(node)

                    // Find children (i.e., nodes that the current node points to via edges)
                    const direct_children = getChildren(currentId, "direct")
                    stack.push(...direct_children.map((node) => node.id))
                }
            }
        }

        return Array.from(children)
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

    // const reassignNodeIds = (nodes: FlowNode[], edges: FlowEdge[]) => {
    //     const idMapping = new Map()
    //     const newNodes = nodes.map((node, index) => {
    //         const oldId = node.id
    //         const newId = `node_${index}`
    //         idMapping.set(oldId, newId)
    //         return { ...node, id: newId }
    //     })

    //     const newEdges = edges.map((edge) => ({
    //         ...edge,
    //         source: idMapping.get(edge.source) || edge.source,
    //         target: idMapping.get(edge.target) || edge.target,
    //     }))

    //     return { newNodes, newEdges }
    // }

    const onDeleteNode = useCallback(
        (node: FlowNode) => {
            if (instance.current) {
                const flow = instance.current.toObject()
                setBotInstances((instances) => [...instances, flow])
            }

            setNodes((nodes) => {
                const { newNodes, newEdges } = deleteNodeAndDescendants(node.id, nodes, edges)
                // const { newNodes: reassignedNodes, newEdges: reassignedEdges } = reassignNodeIds(newNodes, newEdges)
                const layouted = updateLayout(newNodes, newEdges)
                setEdges(layouted.edges)

                const parentEdge = edges.find((edge) => edge.target === node.id)
                if (parentEdge) {
                    // find the parent node in the *layouted* array to get the final position
                    const parentNode = layouted.nodes.find((n) => n.id === parentEdge.source)
                    if (parentNode && instance) {
                        // center on the parent node
                        const { x, y } = parentNode.position
                        instance.current?.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
                            zoom: 0.9,
                            duration: viewport_duration, // optional: animate over 800ms
                        })
                    }
                }

                onSave()
                return layouted.nodes
            })
        },
        [deleteNodeAndDescendants, nodes, edges, setNodes, setEdges, onSave]
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
                    onAddChild: (type: "message" | "response") => addNodeAndEdge(node.id, type),
                    deleteNode: node.id === "node_0" ? undefined : (node) => onDeleteNode(node),
                    editNode: (node) => setEditingNode(node),
                    getChildren,
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
                            onAddChild: (type: "message" | "response") => addNodeAndEdge("node_0", type),
                            getChildren,
                        },
                        position,
                    },
                ]
                nodes[0].data.editNode = () => setEditingNode(nodes[0])
                nodes[0].data.value = bot.trigger

                let edges: Edge[] = []

                if (flow) {
                    const { x = 0, y = 0, zoom = 1 } = flow.viewport
                    edges = flow.edges
                    setViewport({ x, y, zoom })
                }

                const layouted = updateLayout(nodes, edges)
                setNodes(layouted.nodes)
                setEdges(layouted.edges)
                setTimeout(() => instance.current?.fitView({ padding: 0.1, duration: viewport_duration }), 1000)
            }

            restoreFlow()
        }
    }, [bot])

    useEffect(() => {
        console.log({ instance })
    }, [instance])

    useEffect(() => {
        console.log({ nodes })
        if (instance.current) {
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
            onInit={(value) => {
                instance.current = value
            }}
            minZoom={0}
        >
            <Background size={1} />
            <NodeModal node={editingNode} onClose={() => setEditingNode(null)} saveNode={onEditNode} />
        </ReactFlow>
    )
}

import { Handle, Position } from "@xyflow/react"

export const nodeWidth = 200
export const nodeHeight = 120

export const CustomNodeComponent: React.FC<{ data: { label: string; onAddChild: () => void } }> = ({ data }) => {
    return (
        <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px", background: "#fff", width: nodeWidth, height: nodeHeight }}>
            <Handle type="target" position={Position.Top} style={{ borderRadius: 0 }} />
            <div>{data.label}</div>
            <button onClick={data.onAddChild} style={{ marginTop: "10px" }}>
                Add Child
            </button>
            <Handle type="source" position={Position.Bottom} style={{ borderRadius: 0 }} />
        </div>
    )
}

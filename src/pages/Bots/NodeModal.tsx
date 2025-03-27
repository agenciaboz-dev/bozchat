import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Dialog, IconButton, MenuItem, TextField, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import { FlowNode } from "../../types/server/class/Bot/Bot"

interface NodeModalProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node_id: string, value: string) => void
}

export const NodeModal: React.FC<NodeModalProps> = ({ node, onClose, saveNode }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [nodeValue, setNodeValue] = useState(node?.data.value)

    const onSaveClick = () => {
        if (!node || (node.type !== "response" && !nodeValue) || nodeValue === undefined) return

        saveNode(node.id, nodeValue)

        onClose()
    }

    useEffect(() => {
        setNodeValue(node?.data.value)
    }, [node])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.focus()
        }
    }, [inputRef.current])

    return (
        <Dialog open={!!node} onClose={onClose} PaperProps={{ sx: { bgcolor: "background.default", padding: "2vw", gap: "1vw" } }}>
            {node ? (
                <>
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ color: "secondary.main", fontWeight: "bold" }}>
                            {node.type === "message" ? "Enviar mensagem" : "Ao receber resposta"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <TextField
                        inputRef={inputRef}
                        multiline={node.type === "message"}
                        minRows={3}
                        label="Texto"
                        value={nodeValue}
                        onChange={(ev) => setNodeValue(ev.target.value)}
                        onKeyDown={(ev) => (ev.ctrlKey && ev.key === "Enter" ? onSaveClick() : {})}
                    />

                    <Box sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={onSaveClick} disabled={nodeValue === node.data.value}>
                            Salvar
                        </Button>
                    </Box>
                </>
            ) : null}
        </Dialog>
    )
}

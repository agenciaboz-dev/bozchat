import React, { useEffect, useState } from "react"
import { Box, Button, Dialog, IconButton, MenuItem, TextField, Typography } from "@mui/material"
import { FlowNode } from "./FlowLayout"
import { Close } from "@mui/icons-material"

interface NodeModalProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node: FlowNode) => void
}

export const NodeModal: React.FC<NodeModalProps> = ({ node, onClose, saveNode }) => {
    const [nodeValue, setNodeValue] = useState(node?.data.value)

    const onSaveClick = () => {
        if (!node || !nodeValue) return

        const updated_node = node
        updated_node.data.value = nodeValue

        saveNode(updated_node)
        onClose()
    }

    useEffect(() => {
        setNodeValue(node?.data.value)
    }, [node])

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
                        multiline={node.type === "message"}
                        minRows={3}
                        label="Texto"
                        value={nodeValue}
                        onChange={(ev) => setNodeValue(ev.target.value)}
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
;("")

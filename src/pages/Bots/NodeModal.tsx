import React, { useEffect, useRef, useState } from "react"
import { Avatar, Box, Button, Dialog, IconButton, MenuItem, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { Close, Delete } from "@mui/icons-material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { ChatInput } from "../../components/ChatInput"

interface NodeModalProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node_id: string, value: FlowNodeData) => void
}

export const NodeModal: React.FC<NodeModalProps> = ({ node, onClose, saveNode }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isMobile = useMediaQuery("(orientation: portrait)")
    const darkMode = useDarkMode()

    const lightModePrimary = "#99dff9"
    const lightModeSecondary = "#D9D9D9"
    const primary = "#0F6787"
    const secondary = "#2a323c"

    const limited_size = true

    const [nodeData, setNodeData] = useState(node?.data)

    const onSaveClick = () => {
        if (!node || (node.type !== "response" && !nodeData) || nodeData === undefined) return

        saveNode(node.id, nodeData)

        onClose()
    }

    const removeMedia = () => {
        setNodeData((data) => ({ ...data!, media: undefined }))
    }

    useEffect(() => {
        setNodeData(node?.data)
    }, [node])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current?.focus()
        }
    }, [inputRef.current])

    return (
        <Dialog open={!!node} onClose={onClose} PaperProps={{ sx: { bgcolor: "background.default", padding: "1vw", gap: "1vw", minWidth: "30vw" } }}>
            {node ? (
                <>
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>
                            {node.type === "message" ? "Resposta do bot" : "Resposta do usuário"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    {/* <TextField
                        inputRef={inputRef}
                        multiline={node.type === "message"}
                        minRows={3}
                        label="Texto"
                        value={nodeValue}
                        onChange={(ev) => setNodeValue(ev.target.value)}
                        onKeyDown={(ev) => (ev.ctrlKey && ev.key === "Enter" ? onSaveClick() : {})}
                    /> */}

                    <Paper
                        elevation={0}
                        sx={{
                            flexDirection: "column",
                            gap: isMobile ? "2vw" : "0.5vw",
                            padding: isMobile ? "4vw" : "0.5vw",
                            position: "relative",
                            borderRadius: "4px",
                            borderTopLeftRadius: node.type === "message" ? undefined : 0,
                            borderTopRightRadius: node.type === "message" ? 0 : undefined,
                            color: "text.secondary",
                            width: "fit-content",
                            minWidth: isMobile ? "70%" : "5vw",
                            minHeight: "2vw",
                            alignSelf: node.type === "message" ? "flex-end" : undefined,
                            bgcolor: node.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary,
                            maxWidth: limited_size ? "17vw" : undefined,
                            margin: isMobile ? "1vw 0" : undefined,
                        }}
                    >
                        {nodeData?.media && (
                            <>
                                {nodeData.media.type === "image" && (
                                    <PhotoView src={nodeData.media.url}>
                                        <MenuItem sx={{ padding: 0, justifyContent: "center" }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: limited_size ? "15vw" : isMobile ? "33vw" : "20vw",
                                                    height: "auto",
                                                    maxHeight: limited_size ? "15vw" : isMobile ? "80vw" : "20vw",
                                                }}
                                                src={nodeData.media.url}
                                            />
                                        </MenuItem>
                                    </PhotoView>
                                )}

                                {nodeData.media.type === "video" && (
                                    <video
                                        src={nodeData.media.url}
                                        style={{
                                            width: limited_size ? "15vw" : isMobile ? "33vw" : "20vw",
                                            height: "auto",
                                            maxHeight: limited_size ? "15vw" : isMobile ? "80vw" : "20vw",
                                        }}
                                        controls
                                    />
                                )}

                                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                                    <IconButton onClick={removeMedia}>
                                        <Delete color="error" />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                        <Typography
                            color="#fff"
                            sx={{
                                wordBreak: "break-word",
                                whiteSpace: "pre-line",
                                color: "text.secondary",
                                maxWidth: isMobile ? "100%" : "15vw",
                            }}
                        >
                            {nodeData?.value}
                        </Typography>

                        {nodeData?.media?.type === "audio" && (
                            <AudioPlayer
                                containerSx={{
                                    height: isMobile ? undefined : "3vw",
                                    paddingBottom: isMobile ? "4vw" : undefined,
                                }}
                                media={{
                                    source: nodeData?.media.url,
                                    ext: nodeData?.media.url.split(".")[nodeData?.media.url.split(".").length - 1],
                                }}
                                inBoards={limited_size}
                            />
                        )}

                        <TrianguloFudido
                            alignment={node.type === "message" ? "right" : "left"}
                            color={node.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary}
                        />
                    </Paper>

                    <ChatInput
                        data={nodeData}
                        setData={setNodeData}
                        isBot={node.type === "message"}
                        onSubmit={onSaveClick}
                        disabled={nodeData?.value === node.data.value && nodeData?.media?.base64 === node.data.media?.base64}
                    />

                    {/* <Box sx={{ justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={onSaveClick}
                            disabled={nodeData?.value === node.data.value && nodeData?.media?.base64 === node.data.media?.base64}
                        >
                            Salvar
                        </Button>
                    </Box> */}
                </>
            ) : null}
        </Dialog>
    )
}

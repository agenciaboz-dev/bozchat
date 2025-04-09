import React, { useEffect, useRef, useState } from "react"
import { Avatar, Box, Chip, Drawer, IconButton, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useDarkMode } from "../../hooks/useDarkMode"
import { Close, Delete } from "@mui/icons-material"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { ChatInput } from "../../components/ChatInput"
import { useSnackbar } from "burgos-snackbar"

interface NodeDrawerProps {
    node: FlowNode | null
    onClose: () => void
    saveNode: (node_id: string, value: FlowNodeData) => void
}

const TextInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Paper sx={{ borderRadius: "0.5vw", padding: "0.5vw 1vw", alignSelf: "center", width: "fit-content" }}>
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", textAlign: "center" }}>{children}</Typography>
    </Paper>
)

export const NodeDrawer: React.FC<NodeDrawerProps> = ({ node, onClose, saveNode }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isMobile = useMediaQuery("(orientation: portrait)")
    const darkMode = useDarkMode()
    const { snackbar } = useSnackbar()

    const lightModePrimary = "#99dff9"
    const lightModeSecondary = "#D9D9D9"
    const primary = "#0F6787"
    const secondary = "#2a323c"

    const limited_size = true

    const [nodeData, setNodeData] = useState(node?.data)

    const onSaveClick = () => {
        if (!node || (node.type !== "response" && !nodeData) || nodeData === undefined) return

        saveNode(node.id, nodeData)
        snackbar({ severity: "success", text: "Salvo" })
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
        <Drawer open={!!node} onClose={onClose} anchor="right" variant="persistent">
            {node ? (
                <Paper sx={{ flexDirection: "column", bgcolor: "background.default", flex: 1, padding: "1vw", gap: "1vw", maxWidth: "25vw" }}>
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>
                            {node.type === "message" ? "Resposta do bot" : "Resposta do usuário"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                        <Box
                            sx={{
                                flexDirection: "column",
                                bgcolor: "background.default",
                                padding: "1vw",
                                borderRadius: "0.5vw",
                                gap: "1vw",
                                overflow: "auto",
                                height: "80vh",
                            }}
                        >
                            {node.type === "message" ? (
                                <>
                                    <TextInfo>Escreva abaixo, no campo de mensagem, a resposta do bot ao usuário.</TextInfo>
                                    <TextInfo>Utilize o botão à esquerda inferior para enviar mídias (imagens, documentos, etc).</TextInfo>
                                    {/* <TextInfo>Para ajustar configurações avançadas acesse as abas superiores.</TextInfo> */}
                                </>
                            ) : (
                                <>
                                    <TextInfo>Escreva abaixo, no campo de mensagem, as opções de resposta.</TextInfo>
                                    <TextInfo>Essas respostas são os gatilhos que ativarão a próxima resposta do bot.</TextInfo>
                                </>
                            )}
                            <Paper
                                elevation={0}
                                sx={{
                                    marginTop: "auto",
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
                                    bgcolor:
                                        node.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary,
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
                                    color={
                                        node.type === "message" ? (darkMode ? primary : lightModePrimary) : darkMode ? secondary : lightModeSecondary
                                    }
                                />
                            </Paper>
                        </Box>

                        <ChatInput
                            data={nodeData}
                            setData={setNodeData}
                            isBot={node.type === "message"}
                            onSubmit={onSaveClick}
                            disabled={nodeData?.value === node.data.value && nodeData?.media?.base64 === node.data.media?.base64}
                        />
                    </Box>
                </Paper>
            ) : null}
        </Drawer>
    )
}

import React from "react"
import { Avatar, Box, IconButton, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useSnackbar } from "burgos-snackbar"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhotoView } from "react-photo-view"
import { Delete } from "@mui/icons-material"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "../Zap/TrianguloFudido"
import { ChatInput } from "../../components/ChatInput"
import { TextInfo } from "./TextInfo"
import { BotMessageContainer } from "./BotMessageContainer"

interface SettingsTabProps {
    node: FlowNode | null
    nodeData?: FlowNodeData
    setNodeData: React.Dispatch<React.SetStateAction<FlowNodeData>>
    saveNode: (node_id: string, value: FlowNodeData) => void
}

export const BotMessageTab: React.FC<SettingsTabProps> = (props) => {
    const { snackbar } = useSnackbar()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const lightModePrimary = "#99dff9"
    const lightModeSecondary = "#D9D9D9"
    const primary = "#0F6787"
    const secondary = "#2a323c"

    const limited_size = true

    const onSaveClick = () => {
        if (!props.node || (props.node.type !== "response" && !props.nodeData) || props.nodeData === undefined) return

        props.saveNode(props.node.id, props.nodeData)
        snackbar({ severity: "success", text: "Salvo" })
    }

    const removeMedia = () => {
        props.setNodeData((data) => ({ ...data!, media: undefined }))
    }

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <Box
                sx={{
                    flexDirection: "column",
                    bgcolor: "background.default",
                    padding: "1vw",
                    borderRadius: "0.5vw",
                    gap: "1vw",
                    overflow: "auto",
                    height: props.node?.type === "message" ? "76vh" : "82vh",
                }}
            >
                {props.node?.type === "message" ? (
                    <>
                        <TextInfo>Escreva abaixo, no campo de mensagem, a resposta do bot ao usuário.</TextInfo>
                        <TextInfo>Utilize o botão à esquerda inferior para enviar imagem ou vídeo.</TextInfo>
                        <TextInfo>Para configurar ações que serão executadas com essa mensagem, acesse as abas superiores.</TextInfo>
                    </>
                ) : (
                    <>
                        <TextInfo>Escreva abaixo, no campo de mensagem, as opções de resposta.</TextInfo>
                        <TextInfo>Essas respostas são os gatilhos que ativarão a próxima resposta do bot.</TextInfo>
                    </>
                )}
                <BotMessageContainer node={props.node} nodeData={props.nodeData} />
            </Box>

            <ChatInput
                data={props.nodeData}
                setData={props.setNodeData}
                isBot={props.node?.type === "message"}
                onSubmit={onSaveClick}
                disabled={props.nodeData?.value === props.node?.data.value && props.nodeData?.media?.url === props.node?.data.media?.url}
            />
        </Box>
    )
}

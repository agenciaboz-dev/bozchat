import React, { useState } from "react"
import { Box, CircularProgress, IconButton } from "@mui/material"
import { api } from "../../../../api"
import { WashimaMessage } from "../../../../types/server/class/Washima/WashimaMessage"
import { Chat } from "../../../../types/Chat"
import { Check, CheckCircle, CopyAll } from "@mui/icons-material"
import { WashimaMedia } from "../../../../types/server/class/Washima/Washima"

interface CopyAllProps {
    chat: Chat
}

export const CopyAllButton: React.FC<CopyAllProps> = ({ chat }) => {
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const fetchMetadata = async (washima_id: string, message_id: string) => {
        const response = await api.get("/washima/media-metadata", { params: { washima_id, message_id } })
        return response.data as WashimaMedia
    }

    const copyAllMessages = async () => {
        if (loading) return
        const texts: string[] = []

        setLoading(true)
        try {
            const response = await api.get("/washima/tools/copy-chat", { params: { chat_id: chat.id._serialized } })
            const messages = response.data as WashimaMessage[]

            await Promise.all(
                messages
                    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
                    .map(async (message) => {
                        const media = message.hasMedia ? await fetchMetadata(message.washima_id, message.sid) : null
                        const text = `${new Date(Number(message.timestamp * 1000)).toLocaleString("pt-br")} - ${
                            message.fromMe ? "Eu:" : (message.author || chat.name) + ":"
                        } ${
                            media
                                ? `[[ARQUIVO]] \nnome: ${media.filename}\ntamanho: ${media.size}\nmensagem: ${message.body}\n[[FIM DO ARQUIVO]]`
                                : message.body
                        }`
                        texts.push(text)
                    })
            )

            navigator.clipboard.writeText(texts.join("\n"))
            setCopied(true)
            setTimeout(() => setCopied(false), 1000 * 5)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <IconButton sx={{ color: "white" }} onClick={copyAllMessages}>
            {loading ? <CircularProgress size="1.5rem" color="secondary" /> : copied ? <Check color="success" /> : <CopyAll />}
        </IconButton>
    )
}

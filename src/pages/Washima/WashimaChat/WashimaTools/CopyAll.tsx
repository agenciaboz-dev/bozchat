import React, { useState } from "react"
import { Box, CircularProgress, IconButton } from "@mui/material"
import { api } from "../../../../api"
import { WashimaMessage } from "../../../../types/server/class/Washima/WashimaMessage"
import { Chat } from "../../../../types/Chat"
import { Check, CheckCircle, CopyAll } from "@mui/icons-material"

interface CopyAllProps {
    chat: Chat
}

export const CopyAllButton: React.FC<CopyAllProps> = ({ chat }) => {
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const copyAllMessages = async () => {
        if (loading) return
        const texts: string[] = []

        setLoading(true)
        try {
            const response = await api.get("/washima/tools/copy-chat", { params: { chat_id: chat.id._serialized } })
            const messages = response.data as WashimaMessage[]
            messages.forEach((message) => {
                const text = `${message.fromMe ? "Eu:" : chat.name + ":"} ${message.body}`
                texts.push(text)
            })

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

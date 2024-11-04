import React, { useEffect, useState } from "react"
import { Check, DoneAll } from "@mui/icons-material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface MessageAckProps {
    message: WashimaMessage
}
const SIZE = "0.85vw"

export const MessageAck: React.FC<MessageAckProps> = ({ message: _message }) => {
    const [message, setMessage] = useState(_message)

    const read = message?.ack === 3 || message?.ack === 4

    useEffect(() => {
        setMessage(_message)
    }, [_message])

    return (
        message?.fromMe &&
        !!message?.ack &&
        (message.ack < 2 ? (
            <Check sx={{ width: SIZE, height: SIZE }} />
        ) : (
            <DoneAll sx={{ width: SIZE, height: SIZE }} color={read ? "warning" : "inherit"} />
        ))
    )
}

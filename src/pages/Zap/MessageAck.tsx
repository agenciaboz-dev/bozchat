import React, { useEffect, useState } from "react"
import { Check, DoneAll } from "@mui/icons-material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { useMediaQuery } from "@mui/material"

interface MessageAckProps {
    message: WashimaMessage
}

export const MessageAck: React.FC<MessageAckProps> = ({ message: _message }) => {
    const [message, setMessage] = useState(_message)
    const isMobile = useMediaQuery("(orientation: portrait)")

    const SIZE = isMobile ? "4vw" : "0.85vw"

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

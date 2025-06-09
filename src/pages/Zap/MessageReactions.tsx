import React from "react"
import { Paper, Typography } from "@mui/material"
import { _ } from "numeral"

interface MessageReactionsProps {
    reactions: string[] 
    length: number
    from_me: boolean
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions, length, from_me }) => {
    return reactions.length ? (
        <Paper
            sx={{
                position: "absolute",
                bottom: "-1.5vw",
                right: from_me ? "0.5vw" : undefined,
                left: !from_me ? "0.5vw" : undefined,
                padding: "0.3vw",
                borderRadius: "5vw",
                bgcolor: "background.default",
                gap: "0.25vw",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.85vw",
                lineHeight: '0.85vw',
                color: 'secondary.main'
            }}
            onClick={() => console.log(reactions)}
        >
            {reactions.map((reaction) => (
                <Typography key={reaction} sx={{ fontSize: "0.85vw" }}>
                    {reaction}
                </Typography>
            ))}
            {length > 1 ? length : undefined}
        </Paper>
    ) : null
}

import React from "react"
import { Box, Typography } from "@mui/material"
import { WashimaCall } from "../../types/server/class/Washima/WashimaMessage"
import { Call, PhoneCallback } from "@mui/icons-material"
import { formatDurationMaxInteger, formatTimeDuration } from "../../tools/formatTimeDuration"

interface CallInfoProps {
    call: WashimaCall
    from_me: boolean
}

export const CallInfo: React.FC<CallInfoProps> = ({ call, from_me }) => {
    const Icon = from_me ? Call : PhoneCallback

    return (
        <Box
            sx={{
                bgcolor: "#00000033",
                flex: 1,
                padding: "0.5vw",
                margin: "-0.2vw",
                borderRadius: "0.5vw",
                gap: "0.5vw",
                alignItems: "center",
                marginBottom: '0.5vw',
            }}
        >
            <Icon sx={{ bgcolor: "#ffffff33", borderRadius: "100%", width: "2.5vw", height: "auto", padding: "0.5vw" }} />
            <Box sx={{ flexDirection: "column", gap: "0vw", alignItems: "flex-start" }}>
                <Typography sx={{fontWeight: 'bold'}}>Ligação de voz</Typography>
                {/* <Typography sx={{fontSize: '0.8rem', opacity: 0.6}}>{!call.callDuration ? "Sem resposta" : formatDurationMaxInteger(call.callDuration)}</Typography> */}
                <Typography sx={{fontSize: '0.8rem', opacity: 0.6}}>Retorne as ligações pelo celular</Typography>
            </Box>
        </Box>
    )
}

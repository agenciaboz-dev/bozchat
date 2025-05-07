import React, { useEffect, useMemo, useState } from "react"
import { Box, IconButton, Tooltip } from "@mui/material"
import { Android } from "@mui/icons-material"
import { Bot } from "../../../../types/server/class/Bot/Bot"
import { api } from "../../../../api"
import { useUser } from "../../../../hooks/useUser"
import { useIo } from "../../../../hooks/useIo"

interface BotActivityProps {
    chat_id: string
}

export const BotActivity: React.FC<BotActivityProps> = (props) => {
    const { user, company } = useUser()
    const io = useIo()

    const [activeBot, setActiveBot] = useState<Bot | null>(null)
    const [pausedBot, setPausedBot] = useState<Bot | null>(null)


    const fetchActiveBot = async () => {
        try {
            const response = await api.get("/company/bots/active-on", {
                params: { company_id: company?.id, user_id: user?.id, chat_id: props.chat_id },
            })
            setActiveBot(response.data.activeBot || null)
            setPausedBot(response.data.paused || null)

        } catch (error) {
            console.log(error)
        }
    }

    const toggleBot = async () => { 
        try {
            const response = await api.get("/company/bots/toggle", {
                params: { company_id: company?.id, user_id: user?.id, chat_id: props.chat_id, bot_id: activeBot?.id || pausedBot?.id },
            })
            setActiveBot(response.data.activeBot)
            setPausedBot(response.data.paused)
        } catch (error) {
            console.log(error)
        }
     }

    useEffect(() => {
        fetchActiveBot()

        io.on(`bot:activity:${props.chat_id}`, (bot) => {
            setActiveBot(bot)
        })

        io.on(`bot:paused:${props.chat_id}`, (bot) => {
            setPausedBot(bot)
        })

        return () => {
            io.off(`bot:activity:${props.chat_id}`)
            io.off(`bot:paused:${props.chat_id}`)
        }
    }, [])

    return (
        <Tooltip title={pausedBot ? `Bot pausado` : activeBot ? `Bot ativo: ${activeBot.name}` : "Nenhum bot ativo"} arrow>
            <IconButton onClick={(activeBot || pausedBot) ? toggleBot : undefined}  >
                <Android color={pausedBot ? 'error' : activeBot ? "success" : "disabled"} />
            </IconButton>
        </Tooltip>
    )
}

import React, { useState } from "react"
import { Box, IconButton } from "@mui/material"
import { Subroute } from "../Nagazap/Subroute"
import { useLocation } from "react-router-dom"
import { Bot } from "../../types/server/class/Bot/Bot"
import { Settings, SettingsApplications } from "@mui/icons-material"
import { BotForm } from "./BotForm"
import { FlowContainer } from "./FlowContainer"

interface BotPageProps {
    onSave: (bot: Bot) => void
}

export const BotPage: React.FC<BotPageProps> = ({ onSave }) => {
    const bot = useLocation().state as Bot

    const [showForm, setShowForm] = useState(false)

    return (
        <Subroute
            title={bot.name}
            right={
                <Box>
                    <IconButton onClick={() => setShowForm((value) => !value)}>
                        <Settings color={showForm ? "primary" : "secondary"} />
                    </IconButton>
                </Box>
            }
        >
            {showForm ? (
                <BotForm
                    onSubmit={(bot) => {
                        onSave(bot)
                        setShowForm(false)
                    }}
                    bot={bot}
                />
            ) : (
                <FlowContainer bot={bot} />
            )}
        </Subroute>
    )
}

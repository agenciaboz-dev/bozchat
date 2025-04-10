import React, { useEffect, useState } from "react"
import { Box, IconButton } from "@mui/material"
import { Subroute } from "../Nagazap/Subroute"
import { useLocation } from "react-router-dom"
import { Bot } from "../../types/server/class/Bot/Bot"
import { Redo, Settings, SettingsApplications, Undo } from "@mui/icons-material"
import { BotForm } from "./BotForm"
import { FlowLayout } from "./FlowLayout"
import { Edge, Node, ReactFlowInstance, ReactFlowJsonObject } from "@xyflow/react"
import { useDarkMode } from "../../hooks/useDarkMode"
import { BotProvider } from "../../contexts/bot.context"

interface BotPageProps {
    onSave: (bot: Bot) => void
    onDelete: (bot: Bot) => void
}

export const BotPage: React.FC<BotPageProps> = ({ onSave, onDelete }) => {
    const { darkMode } = useDarkMode()
    const bot = useLocation().state as Bot

    const [showForm, setShowForm] = useState(false)
    const [botInstances, setBotInstances] = useState<ReactFlowJsonObject<Node, Edge>[]>([])
    const [undoToInstance, setUndoToInstance] = useState<ReactFlowJsonObject<Node, Edge> | null>(null)

    const onUndo = () => {
        const instances = [...botInstances]
        const instance = instances.pop()
        if (instance) {
            setUndoToInstance(instance)
            setBotInstances(instances)
        }
    }

    useEffect(() => {
        console.log({ botInstances })
    }, [botInstances])

    useEffect(() => {
        setBotInstances([])
    }, [bot])

    return (
        <Subroute
            title={bot.name}
            right={
                <Box>
                    {!showForm && (
                        <>
                            <IconButton disabled={botInstances.length === 0} onClick={() => onUndo()}>
                                <Undo />
                            </IconButton>
                            {/* <IconButton onClick={() => setShowForm((value) => !value)}>
                                <Redo />
                            </IconButton> */}
                        </>
                    )}
                    <IconButton onClick={() => setShowForm((value) => !value)}>
                        <Settings color={showForm ? "primary" : darkMode ? "secondary" : "action"} />
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
                    onDelete={(bot) => {
                        onDelete(bot)
                        setShowForm(false)
                    }}
                    bot={bot}
                />
            ) : (
                <Box sx={{ flex: 1, margin: "-2vw" }}>
                    <FlowLayout
                        bot_id={bot.id}
                        botInstances={botInstances}
                        setBotInstances={setBotInstances}
                        undoToInstance={undoToInstance}
                        setUndoToInstance={setUndoToInstance}
                    />
                </Box>
            )}
        </Subroute>
    )
}

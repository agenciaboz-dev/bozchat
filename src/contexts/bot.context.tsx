import { createContext, useEffect, useState } from "react"
import React from "react"

interface BotContextValue {
    loopingNodeId: string | null
    setLoopingNodeId: React.Dispatch<React.SetStateAction<string | null>>
    actionsTab: boolean
    setActionsTab: React.Dispatch<React.SetStateAction<boolean>>
}

interface BotProviderProps {
    children: React.ReactNode
}

const BotContext = createContext<BotContextValue>({} as BotContextValue)

export default BotContext

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
    const [loopingNodeId, setLoopingNodeId] = useState<string | null>(null)
    const [actionsTab, setActionsTab] = useState(false)

    useEffect(() => {
        console.log({ loopingNodeId })
    }, [loopingNodeId])

    return <BotContext.Provider value={{ loopingNodeId, setLoopingNodeId, actionsTab, setActionsTab }}>{children}</BotContext.Provider>
}

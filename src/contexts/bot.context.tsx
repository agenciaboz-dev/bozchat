import { createContext, useEffect, useState } from "react"
import React from "react"

interface BotContextValue {
    loopingNodeId: string | null
    setLoopingNodeId: React.Dispatch<React.SetStateAction<string | null>>
}

interface BotProviderProps {
    children: React.ReactNode
}

const BotContext = createContext<BotContextValue>({} as BotContextValue)

export default BotContext

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
    const [loopingNodeId, setLoopingNodeId] = useState<string | null>(null)

    useEffect(() => {
        console.log({ loopingNodeId })
    }, [loopingNodeId])

    return <BotContext.Provider value={{ loopingNodeId, setLoopingNodeId }}>{children}</BotContext.Provider>
}

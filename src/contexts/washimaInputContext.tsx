import { createContext, useState } from "react"
import React from "react"
import { WashimaMessage } from "../types/server/class/Washima/WashimaMessage"

export interface WashimaInputContext {}

interface WashimaInputContextValue {
    replyMessage: WashimaMessage | null
    setReplyMessage: React.Dispatch<React.SetStateAction<WashimaMessage | null>>
}

interface WashimaInputContextProviderProps {
    children: React.ReactNode
}

const WashimaInputContext = createContext<WashimaInputContextValue>({} as WashimaInputContextValue)

export default WashimaInputContext

export const WashimaInputContextProvider: React.FC<WashimaInputContextProviderProps> = ({ children }) => {
    const [replyMessage, setReplyMessage] = useState<WashimaMessage | null>(null)

    return <WashimaInputContext.Provider value={{ replyMessage, setReplyMessage }}>{children}</WashimaInputContext.Provider>
}

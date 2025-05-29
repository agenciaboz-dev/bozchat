import { createContext, useState } from "react"
import React from "react"
import { WashimaMessage } from "../types/server/class/Washima/WashimaMessage"

export interface WashimaInputContext {}

interface WashimaInputContextValue {
    replyMessage: WashimaMessage | null
    setReplyMessage: React.Dispatch<React.SetStateAction<WashimaMessage | null>>
    deleting: boolean | "everyone"
    setDeleting: React.Dispatch<React.SetStateAction<boolean | "everyone">>
}

interface WashimaInputContextProviderProps {
    children: React.ReactNode
}

const WashimaInputContext = createContext<WashimaInputContextValue>({} as WashimaInputContextValue)

export default WashimaInputContext

export const WashimaInputContextProvider: React.FC<WashimaInputContextProviderProps> = ({ children }) => {
    const [replyMessage, setReplyMessage] = useState<WashimaMessage | null>(null)
    const [deleting, setDeleting] = useState<boolean | "everyone">(false)

    return <WashimaInputContext.Provider value={{ replyMessage, setReplyMessage, deleting, setDeleting }}>{children}</WashimaInputContext.Provider>
}

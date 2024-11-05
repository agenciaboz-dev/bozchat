import { createContext, useEffect, useState } from "react"
import React from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

interface DarkModeContextValue {
    value: boolean
    setValue: (value: boolean) => void
    toogleDarkMode: () => void
}

interface DarkModeProviderProps {
    children: React.ReactNode
}

const DarkModeContext = createContext<DarkModeContextValue>({} as DarkModeContextValue)

export default DarkModeContext

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
    const storage = useLocalStorage()
    const [value, setValue] = useState<boolean>(true)

    const toogleDarkMode = () => {
        setValue(!value)
    }

    useEffect(() => {
        storage.set("boz:darkmode", value)
        // setTimeout(() => toogleDarkMode(), 100)
    }, [value])

    return <DarkModeContext.Provider value={{ value, setValue, toogleDarkMode }}>{children}</DarkModeContext.Provider>
}

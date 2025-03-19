import { useLocalStorage } from "@mantine/hooks"
import { createContext, useEffect, useState } from "react"
import React from "react"

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
    const [value, setValue] = useLocalStorage({ key: "chatboz:darkmode", defaultValue: true })

    const toogleDarkMode = () => {
        setValue((value) => !value)
    }

    return <DarkModeContext.Provider value={{ value, setValue, toogleDarkMode }}>{children}</DarkModeContext.Provider>
}

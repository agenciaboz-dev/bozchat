import { createContext, useState } from "react"
import React from "react"
import { useMenuList } from "../hooks/useMenuList"
import { Menu } from "../types/Menu"
import { useDisclosure } from "@mantine/hooks"

interface MenuContextValue {
    opened: boolean
    handlers: {
        readonly open: () => void
        readonly close: () => void
        readonly toggle: () => void
    }
    menus: Menu[]
}

interface MenuProviderProps {
    children: React.ReactNode
}

const MenuContext = createContext<MenuContextValue>({} as MenuContextValue)

export default MenuContext

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
    const menus = useMenuList()

    // const [openDrawer, setOpenDrawer] = useState(false)
    const [opened, handlers] = useDisclosure(false)

    return <MenuContext.Provider value={{ opened, handlers, menus }}>{children}</MenuContext.Provider>
}

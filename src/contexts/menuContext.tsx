import { createContext, useState } from "react"
import React from "react"
import { useMenuList } from "../hooks/useMenuList"

interface MenuContextValue {
    drawer: {
        open: boolean
        setOpen: (open: boolean) => void
        menus: Menu[]
    }
}

interface MenuProviderProps {
    children: React.ReactNode
}

const MenuContext = createContext<MenuContextValue>({} as MenuContextValue)

export default MenuContext

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
    const menus = useMenuList()

    const [openDrawer, setOpenDrawer] = useState(false)

    const drawer = {
        open: openDrawer,
        setOpen: setOpenDrawer,
        menus,
    }

    return <MenuContext.Provider value={{ drawer }}>{children}</MenuContext.Provider>
}

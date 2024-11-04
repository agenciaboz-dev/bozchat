import { useContext } from "react"
import MenuContext from "../contexts/menuContext"

export const useMenu = () => {
    const menuContext = useContext(MenuContext)

    const drawer = {
        open: menuContext.drawer.open,
        menus: menuContext.drawer.menus,
        toogle: () => menuContext.drawer.setOpen(!menuContext.drawer.open),
        close: () => menuContext.drawer.setOpen(false),
    }

    return { drawer }
}

import React from "react"
import { Box, Drawer } from "@mui/material"
import { useMenu } from "../../hooks/useMenu"
import { backdropStyle } from "../../style/backdrop"
import { MenuButton } from "./MenuButton"
import { useMediaQuery } from "@mui/material"
import { useDarkMode } from "../../hooks/useDarkMode"

interface MenuDrawerProps {}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const { drawer } = useMenu()

    return (
        <Drawer
            anchor={"left"}
            open={drawer.opened}
            onClose={drawer.handlers.close}
            PaperProps={{ sx: { width: isMobile ? "80vw" : "22vw", backgroundColor: "background.paper" } }}
            ModalProps={{ BackdropProps: { sx: backdropStyle } }}
        >
            <Box
                sx={{ padding: isMobile ? "6vw" : "2vw", flexDirection: "column", gap: "1vw", width: "100%", alignItems: "center" }}
                color={"text.secondary"}
            >
                <img
                    src={darkMode ? "/logos/negativos/1.png" : "/logos/negativos/3.png"}
                    style={{ width: isMobile ? "25vw" : "10vw" }}
                    draggable={false}
                />
            </Box>
            <Box sx={{ flexDirection: "column", flex: 1 }}>
                {drawer.menus.map((menu) => (
                    <MenuButton sx={{ fontSize: isMobile ? "4vw" : "1vw" }} menu={menu} key={menu.path} />
                ))}
            </Box>
        </Drawer>
    )
}

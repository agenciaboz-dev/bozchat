import React, { useState } from "react"
import { Box, Collapse, MenuItem, SxProps, alpha, darken, useMediaQuery } from "@mui/material"
import { useMenu } from "../../hooks/useMenu"
import { useLocation } from "react-router-dom"
import { useColors } from "../../hooks/useColors"
import { KeyboardArrowDown } from "@mui/icons-material"
import { Menu } from "../../types/Menu"
import { useDarkMode } from "../../hooks/useDarkMode"

interface MenuButtonProps {
    menu: Menu
    sx?: SxProps
}

export const MenuButton: React.FC<MenuButtonProps> = ({ menu, sx }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const Icon = () => menu.icon
    const location = useLocation()
    const active = location.pathname.split("/")[1] == menu.path.split("/")[1]

    const { drawer } = useMenu()

    const [collapse, setCollapse] = useState(active)

    const buildStyle = (active: boolean, menu: Menu) => {
        const menuItemStyle: SxProps = {
            backgroundColor: active ? (menu.submenus ? "" : "background.default") : "",
            color: darkMode
                ? active
                    ? menu.submenus
                        ? "secondary.main"
                        : "primary.main"
                    : "secondary.main"
                : active
                ? menu.submenus
                    ? "text.secondary"
                    : "primary.main"
                : "text.secondary",
            pointerEvents: active ? (menu.submenus ? "auto" : "none") : "auto",
            fontWeight: darkMode ? "bold" : active ? "bold" : "normal",
            fontSize: "1vw",
            gap: "1vw",
            ...sx,
        }

        return menuItemStyle
    }

    const handleMenuClick = (menu: Menu) => {
        if (!menu.submenus) {
            drawer.handlers.close()
            menu.onClick()
        } else {
            setCollapse((collapse) => !collapse)
        }
    }

    return (
        <>
            <MenuItem key={menu.path} sx={buildStyle(active, menu)} onClick={() => handleMenuClick(menu)}>
                <Icon />
                {menu.name}
                {menu.submenus && <KeyboardArrowDown sx={{ marginLeft: "auto", rotate: collapse ? "-180deg" : "", transition: "0.3s" }} />}
            </MenuItem>

            <Collapse in={collapse}>
                <Box sx={{ flexDirection: "column", width: "100%" }}>
                    {menu.submenus?.map((menu) => {
                        const active = location.pathname.split("/")[2] == menu.path.split("/")[1]
                        const Icon = () => menu.icon

                        return (
                            <MenuItem
                                key={menu.path}
                                sx={{
                                    ...buildStyle(active, menu),
                                    paddingLeft: isMobile ? "14vw" : "3vw",
                                    fontSize: isMobile ? "3.5vw" : "0.85vw",
                                    whiteSpace: "normal",
                                    overflow: "hidden",
                                }}
                                onClick={() => handleMenuClick(menu)}
                            >
                                <Icon />
                                {menu.name}
                            </MenuItem>
                        )
                    })}
                </Box>
            </Collapse>
        </>
    )
}

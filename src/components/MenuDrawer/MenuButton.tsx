import React, { useState } from "react"
import { Box, Collapse, MenuItem, SxProps, useMediaQuery } from "@mui/material"
import { useMenu } from "../../hooks/useMenu"
import { useLocation } from "react-router-dom"
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
    const location = useLocation()
    const { drawer } = useMenu()

    const isActive = (menu: Menu): boolean => {
        if (menu.submenus && menu.submenus.length > 0) {
            return menu.submenus.some((submenu) => location.pathname.startsWith(submenu.path))
        }
        if (menu.path === "/") {
            return location.pathname === "/"
        }
        return location.pathname.startsWith(menu.path)
    }

    const active = isActive(menu)
    const [collapse, setCollapse] = useState(true)

    const buildStyle = (active: boolean, menu: Menu): SxProps => {
        return {
            backgroundColor: active ? (menu.submenus ? "" : "primary.main") : "",
            color: active ? (menu.submenus ? "text.secondary" : "secondary.main") : "text.secondary",
            pointerEvents: active ? (menu.submenus ? "auto" : "none") : "auto",
            fontWeight: darkMode ? "bold" : active ? "bold" : "normal",
            fontSize: "1vw",
            gap: "1vw",
            ...sx,
        }
    }

    const handleMenuClick = (menu: Menu) => {
        if (!menu.submenus) {
            drawer.handlers.close()
            menu.onClick()
        } else {
            setCollapse((prev) => !prev)
        }
    }

    return (
        <>
            <MenuItem key={menu.path} sx={buildStyle(active, menu)} onClick={() => handleMenuClick(menu)}>
                {menu.icon}
                {menu.name}
                {menu.submenus && (
                    <KeyboardArrowDown
                        sx={{
                            marginLeft: "auto",
                            rotate: collapse ? "-180deg" : "",
                            transition: "0.3s",
                        }}
                    />
                )}
            </MenuItem>

            <Collapse in={collapse}>
                <Box sx={{ flexDirection: "column", width: "100%" }}>
                    {menu.submenus?.map((submenu) => {
                        const submenuActive = location.pathname.startsWith(submenu.path)

                        return (
                            <MenuItem
                                key={submenu.path}
                                sx={{
                                    ...buildStyle(submenuActive, submenu),
                                    paddingLeft: isMobile ? "14vw" : "3vw",
                                    fontSize: isMobile ? "3.5vw" : "0.85vw",
                                    whiteSpace: "normal",
                                    overflow: "hidden",
                                }}
                                onClick={() => handleMenuClick(submenu)}
                            >
                                {submenu.icon}
                                {submenu.name}
                            </MenuItem>
                        )
                    })}
                </Box>
            </Collapse>
        </>
    )
}

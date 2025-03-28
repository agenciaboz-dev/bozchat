import React from 'react'
import { Avatar, IconButton, Menu, MenuItem, Paper, useMediaQuery } from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import { useMenu } from "../../hooks/useMenu"
import { useUser } from "../../hooks/useUser"
import { CompanyCard } from "./CompanyCard"
import { ThemeSwitch } from "../../pages/Settings/ThemeSwitch"
import { useDarkMode } from "../../hooks/useDarkMode"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const menu = useMenu()
    const { darkMode } = useDarkMode()
    const { user, logout } = useUser()
    const splitted_name = user?.name.split(" ").slice(0, 2) || []

    const isMobile = useMediaQuery("(orientation: portrait)")

    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget)
    }
    const handleCloseMenu = () => {
        setMenuAnchor(null)
    }

    return (
        <Paper
            sx={{
                height: "10%",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundColor: darkMode ? "background.default" : "primary.main",
                borderRadius: 0,
            }}
        >
            <IconButton sx={{ position: "absolute", left: "2vw", color: "white" }} onClick={() => menu.drawer.handlers.toggle()}>
                <MenuIcon />
            </IconButton>
            <img src="/logos/negativos/1.png" style={{ width: isMobile ? "16vw" : "4vw", height: isMobile ? "16vw" : "4vw" }} draggable={false} />
            {/* <ThemeSwitch /> */}
            <IconButton sx={{ position: "absolute", right: "2vw" }} onClick={handleClickMenu}>
                <Avatar sx={{ bgcolor: "secondary.main", color: "primary.main", fontWeight: "bold" }} imgProps={{ draggable: false }}>
                    {splitted_name.map((word) => word[0])}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={handleCloseMenu}
                slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
            >
                <CompanyCard />
                <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
        </Paper>
    )
}
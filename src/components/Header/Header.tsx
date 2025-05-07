import React from 'react'
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { Menu as MenuIcon, Security } from "@mui/icons-material"
import { useMenu } from "../../hooks/useMenu"
import { useUser } from "../../hooks/useUser"
import { CompanyCard } from "./CompanyCard"
import { ThemeSwitch } from "../ThemeSwitch"
import { useDarkMode } from "../../hooks/useDarkMode"
import { version } from "../../version"
import { useNavigate } from "react-router-dom"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const { darkMode } = useDarkMode()
    const menu = useMenu()
    const navigate = useNavigate()
    const { boz, user, logout } = useUser()
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
            <img src="/logos/negativos/horizontal.svg" style={{ width: isMobile ? "32vw" : "8vw", height: "auto" }} draggable={false} />
            <Box sx={{ position: "absolute", right: "2vw", gap: "0.5vw" }}>
                {boz && user?.admin && (
                    <IconButton onClick={() => navigate("/admin/")}>
                        <Security
                            sx={{
                                bgcolor: "secondary.main",
                                color: "primary.main",
                                boxSizing: "border-box",
                                height: "40px",
                                width: "40px",
                                padding: "8px",
                                borderRadius: "50%",
                            }}
                        />
                    </IconButton>
                )}
                <IconButton onClick={handleClickMenu}>
                    <Avatar sx={{ bgcolor: "secondary.main", color: "primary.main", fontWeight: "bold" }} imgProps={{ draggable: false }}>
                        {splitted_name.map((word) => word[0])}
                    </Avatar>
                </IconButton>
            </Box>
            <Menu
                anchorEl={menuAnchor}
                open={!!menuAnchor}
                onClose={handleCloseMenu}
                slotProps={{
                    paper: {
                        sx: { flexDirection: "column", bgcolor: "background.default", minWidth: isMobile ? "60vw" : "15vw", alignItems: "center" },
                    },
                }}
            >
                <ThemeSwitch sx={{ marginTop: 0, justifyContent: "center", padding: "0 0 8px" }} />
                <Divider sx={{ margin: "0 16px" }} />
                <CompanyCard />
                <Divider sx={{ margin: "0 16px" }} />
                <Typography sx={{ padding: "0.5vw 16px 0", fontSize: "0.7rem", color: "text.secondary" }}>App v{version}</Typography>
                <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
        </Paper>
    )
}
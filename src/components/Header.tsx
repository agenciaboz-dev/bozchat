import React from 'react'
import { Avatar, Box, IconButton, Menu, MenuItem, Paper, useMediaQuery } from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import { useMenu } from "../hooks/useMenu"
import { useUser } from "../hooks/useUser"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
    const menu = useMenu()
    const { user, logout } = useUser()
    const splitted_name = user?.name.split(" ").slice(0, 2) || []

    const isMobile = useMediaQuery("(orientation: portrait)")

    const [menuAchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
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
                backgroundColor: "background.default",
                borderRadius: 0,
            }}
        >
            <img src="/wagazap.svg" style={{ width: isMobile ? "16vw" : "4vw", height: isMobile ? "16vw" : "4vw" }} draggable={false} />
            <IconButton sx={{ position: "absolute", left: "2vw" }} onClick={() => menu.drawer.toogle()}>
                <MenuIcon />
            </IconButton>

            <IconButton sx={{ position: "absolute", right: "2vw" }} onClick={handleClickMenu}>
                <Avatar sx={{ bgcolor: "secondary.main", color: "primary.main", fontWeight: "bold" }} imgProps={{ draggable: false }}>
                    {splitted_name.map((word) => word[0])}
                </Avatar>
            </IconButton>
            <Menu anchorEl={menuAchor} open={!!menuAchor} onClose={handleCloseMenu} slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}>
                <Box sx={{ padding: "1vw", color: "secondary.main", fontSize: "0.8rem" }}>{user?.name}</Box>
                <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
        </Paper>
    )
}
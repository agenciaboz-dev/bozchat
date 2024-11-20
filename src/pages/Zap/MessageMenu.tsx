import React, { useState } from "react"
import { Box, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const MessageMenuButton: React.FC<{ onClick: (event: React.MouseEvent<HTMLElement>) => void; showMenuButton: boolean }> = ({
    onClick,
    showMenuButton,
}) => {
    return showMenuButton ? (
        <IconButton
            onClick={onClick}
            sx={{
                bgcolor: "#5e5e5e",
                "&:hover": {
                    bgcolor: "#5e5e5e",
                },
            }}
        >
            <ExpandMoreIcon />
        </IconButton>
    ) : null
}

const MessageMenuItem: React.FC<{ onClick: () => void; option: string }> = ({ onClick, option }) => {
    return (
        <MenuItem onClick={onClick}>
            <Typography
                sx={{
                    color: "#d9d9d9",
                }}
            >
                {option}
            </Typography>
        </MenuItem>
    )
}

interface MessageMenuProps {
    showMenuButton: boolean
}

export const MessageMenu: React.FC<MessageMenuProps> = ({ showMenuButton }) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        setMenuIsOpen(!menuIsOpen)
    }

    const handleCloseMenu = () => {
        setMenuIsOpen(false)
    }

    return (
        <>
            <MessageMenuButton onClick={handleToggleMenu} showMenuButton={showMenuButton} />

            <Menu
                anchorEl={anchorEl}
                open={menuIsOpen}
                onClose={handleCloseMenu}
                MenuListProps={{
                    sx: {
                        bgcolor: "#5e5e5e",
                    },
                }}
            >
                <MessageMenuItem onClick={handleCloseMenu} option="Deletar" />
                <MessageMenuItem onClick={handleCloseMenu} option="Responder" />
                <MessageMenuItem onClick={handleCloseMenu} option="Editar" />
            </Menu>
        </>
    )
}
